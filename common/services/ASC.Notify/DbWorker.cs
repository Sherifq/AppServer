/*
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/


using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using ASC.Common.Data;
using ASC.Common.Data.Sql;
using ASC.Common.Data.Sql.Expressions;
using ASC.Notify.Config;
using ASC.Notify.Messages;
using Google.Protobuf.Collections;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace ASC.Notify
{
    public class DbWorker
    {
        private readonly string dbid;
        private readonly object syncRoot = new object();

        public IServiceProvider ServiceProvider { get; }
        public NotifyServiceCfg NotifyServiceCfg { get; }

        public DbWorker(IServiceProvider serviceProvider, IOptions<NotifyServiceCfg> notifyServiceCfg)
        {
            ServiceProvider = serviceProvider;
            NotifyServiceCfg = notifyServiceCfg.Value;
            dbid = NotifyServiceCfg.ConnectionStringName;
        }

        public int SaveMessage(NotifyMessage m)
        {
            using var scope = ServiceProvider.CreateScope();
            using var db = scope.ServiceProvider.GetService<DbOptionsManager>().Get(dbid);
            using var tx = db.BeginTransaction(IsolationLevel.ReadCommitted);
            var i = new SqlInsert("notify_queue")
.InColumns("notify_id", "tenant_id", "sender", "reciever", "subject", "content_type", "content", "sender_type", "creation_date", "reply_to", "attachments")
.Values(0, m.Tenant, m.From, m.To, m.Subject, m.ContentType, m.Content, m.Sender, new DateTime(m.CreationDate), m.ReplyTo, m.EmbeddedAttachments.ToString())
.Identity(0, 0, true);

            var id = db.ExecuteScalar<int>(i);

            i = new SqlInsert("notify_info")
                .InColumns("notify_id", "state", "attempts", "modify_date", "priority")
                .Values(id, 0, 0, DateTime.UtcNow, m.Priority);
            var affected = db.ExecuteNonQuery(i);

            tx.Commit();
            return affected;
        }

        public IDictionary<int, NotifyMessage> GetMessages(int count)
        {
            lock (syncRoot)
            {
                using var scope = ServiceProvider.CreateScope();
                using var db = scope.ServiceProvider.GetService<DbOptionsManager>().Get(dbid);
                using var tx = db.BeginTransaction();
                var q = new SqlQuery("notify_queue q")
.InnerJoin("notify_info i", Exp.EqColumns("q.notify_id", "i.notify_id"))
.Select("q.notify_id", "q.tenant_id", "q.sender", "q.reciever", "q.subject", "q.content_type", "q.content", "q.sender_type", "q.creation_date", "q.reply_to", "q.attachments")
.Where(Exp.Eq("i.state", MailSendingState.NotSended) | (Exp.Eq("i.state", MailSendingState.Error) & Exp.Lt("i.modify_date", DateTime.UtcNow - TimeSpan.Parse(NotifyServiceCfg.Process.AttemptsInterval))))
.OrderBy("i.priority", true)
.OrderBy("i.notify_id", true)
.SetMaxResults(count);

                var messages = db
                    .ExecuteList(q)
                    .ToDictionary(
                        r => Convert.ToInt32(r[0]),
                        r =>
                        {
                            var res = new NotifyMessage
                            {
                                Tenant = Convert.ToInt32(r[1]),
                                From = (string)r[2],
                                To = (string)r[3],
                                Subject = (string)r[4],
                                ContentType = (string)r[5],
                                Content = (string)r[6],
                                Sender = (string)r[7],
                                CreationDate = Convert.ToDateTime(r[8]).Ticks,
                                ReplyTo = (string)r[9]
                            };
                            try
                            {
                                res.EmbeddedAttachments.AddRange(JsonConvert.DeserializeObject<RepeatedField<NotifyMessageAttachment>>((string)r[10]));
                            }
                            catch (Exception)
                            {

                            }
                            return res;
                        });

                var u = new SqlUpdate("notify_info").Set("state", MailSendingState.Sending).Where(Exp.In("notify_id", messages.Keys));
                db.ExecuteNonQuery(u);
                tx.Commit();

                return messages;
            }
        }


        public void ResetStates()
        {
            using var scope = ServiceProvider.CreateScope();
            using var db = scope.ServiceProvider.GetService<DbOptionsManager>().Get(dbid);
            var u = new SqlUpdate("notify_info").Set("state", 0).Where("state", 1);
            db.ExecuteNonQuery(u);
        }

        public void SetState(int id, MailSendingState result)
        {
            using var scope = ServiceProvider.CreateScope();
            using var db = scope.ServiceProvider.GetService<DbOptionsManager>().Get(dbid);
            using var tx = db.BeginTransaction();
            if (result == MailSendingState.Sended)
            {
                var d = new SqlDelete("notify_info").Where("notify_id", id);
                db.ExecuteNonQuery(d);
            }
            else
            {
                if (result == MailSendingState.Error)
                {
                    var q = new SqlQuery("notify_info").Select("attempts").Where("notify_id", id);
                    var attempts = db.ExecuteScalar<int>(q);
                    if (NotifyServiceCfg.Process.MaxAttempts <= attempts + 1)
                    {
                        result = MailSendingState.FatalError;
                    }
                }
                var u = new SqlUpdate("notify_info")
                    .Set("state", (int)result)
                    .Set("attempts = attempts + 1")
                    .Set("modify_date", DateTime.UtcNow)
                    .Where("notify_id", id);
                db.ExecuteNonQuery(u);
            }
            tx.Commit();
        }
    }

    public static class DbWorkerExtension
    {
        public static IServiceCollection AddDbWorker(this IServiceCollection services)
        {
            services.TryAddSingleton<DbWorker>();

            return services
                .AddDbManagerService();
        }
    }
}
