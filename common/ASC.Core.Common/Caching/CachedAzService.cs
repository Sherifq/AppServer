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
using ASC.Common.Caching;
using ASC.Core.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace ASC.Core.Caching
{
    class AzServiceCache
    {
        internal ICache Cache { get; }
        internal ICacheNotify<AzRecordCache> CacheNotify { get; }

        public AzServiceCache(ICacheNotify<AzRecordCache> cacheNotify)
        {
            CacheNotify = cacheNotify;
            Cache = AscCache.Memory;

            cacheNotify.Subscribe((r) => UpdateCache(r, true), CacheNotifyAction.Remove);
            cacheNotify.Subscribe((r) => UpdateCache(r, false), CacheNotifyAction.InsertOrUpdate);
        }

        private void UpdateCache(AzRecord r, bool remove)
        {
            var aces = Cache.Get<AzRecordStore>(GetKey(r.Tenant));
            if (aces != null)
            {
                lock (aces)
                {
                    if (remove)
                    {
                        aces.Remove(r);
                    }
                    else
                    {
                        aces.Add(r);
                    }
                }
            }
        }

        public static string GetKey(int tenant)
        {
            return "acl" + tenant.ToString();
        }
    }

    class CachedAzService : IAzService
    {
        private readonly IAzService service;

        private readonly ICacheNotify<AzRecordCache> cacheNotify;

        private ICache Cache { get; }

        private TimeSpan CacheExpiration { get; set; }


        public CachedAzService(DbAzService service, AzServiceCache azServiceCache)
        {
            this.service = service ?? throw new ArgumentNullException("service");
            Cache = azServiceCache.Cache;
            cacheNotify = azServiceCache.CacheNotify;
            CacheExpiration = TimeSpan.FromMinutes(10);
        }


        public IEnumerable<AzRecord> GetAces(int tenant, DateTime from)
        {
            var key = AzServiceCache.GetKey(tenant);
            var aces = Cache.Get<AzRecordStore>(key);
            if (aces == null)
            {
                var records = service.GetAces(tenant, default);
                Cache.Insert(key, aces = new AzRecordStore(records), DateTime.UtcNow.Add(CacheExpiration));
            }
            return aces;
        }

        public AzRecord SaveAce(int tenant, AzRecord r)
        {
            r = service.SaveAce(tenant, r);
            cacheNotify.Publish(r, CacheNotifyAction.InsertOrUpdate);
            return r;
        }

        public void RemoveAce(int tenant, AzRecord r)
        {
            service.RemoveAce(tenant, r);
            cacheNotify.Publish(r, CacheNotifyAction.Remove);
        }
    }

    public static class AzConfigExtension
    {
        public static IServiceCollection AddAzService(this IServiceCollection services)
        {
            services.TryAddScoped<DbAzService>();
            services.TryAddScoped<IAzService, CachedAzService>();
            services.TryAddSingleton<AzServiceCache>();
            services.TryAddSingleton(typeof(ICacheNotify<>), typeof(KafkaCache<>));

            return services;
        }
    }
}