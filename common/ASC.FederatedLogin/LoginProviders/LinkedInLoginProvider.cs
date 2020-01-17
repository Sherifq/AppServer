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
using ASC.Common.Utils;
using ASC.Core;
using ASC.Core.Common.Configuration;
using ASC.FederatedLogin.Helpers;
using ASC.FederatedLogin.Profile;
using ASC.Security.Cryptography;

using Microsoft.Extensions.Configuration;

using Newtonsoft.Json.Linq;

namespace ASC.FederatedLogin.LoginProviders
{
    public class LinkedInLoginProvider : BaseLoginProvider<LinkedInLoginProvider>
    {
        private const string LinkedInProfileUrl = "https://api.linkedin.com/v1/people/~:(id,first-name,last-name,formatted-name,email-address)?format=json";

        public override string AccessTokenUrl
        {
            get { return "https://www.linkedin.com/uas/oauth2/accessToken"; }
        }

        public override string RedirectUri
        {
            get { return this["linkedInRedirectUrl"]; }
        }

        public override string ClientID
        {
            get { return this["linkedInKey"]; }
        }

        public override string ClientSecret
        {
            get { return this["linkedInSecret"]; }
        }

        public override string CodeUrl
        {
            get { return "https://www.linkedin.com/uas/oauth2/authorization"; }
        }

        public override string Scopes
        {
            get { return "r_basicprofile r_emailaddress"; }
        }

        public LinkedInLoginProvider() { }
        public LinkedInLoginProvider(TenantManager tenantManager,
            CoreBaseSettings coreBaseSettings,
            CoreSettings coreSettings,
            ConsumerFactory consumerFactory,
            IConfiguration configuration,
            ICacheNotify<ConsumerCacheItem> cache,
            Signature signature,
            InstanceCrypto instanceCrypto,
            string name, int order, Dictionary<string, string> props, Dictionary<string, string> additional = null)
            : base(tenantManager, coreBaseSettings, coreSettings, consumerFactory, configuration, cache, signature, instanceCrypto, name, order, props, additional) { }

        public override LoginProfile GetLoginProfile(string accessToken)
        {
            if (string.IsNullOrEmpty(accessToken))
                throw new Exception("Login failed");

            return RequestProfile(accessToken);
        }

        private LoginProfile RequestProfile(string accessToken)
        {
            var linkedInProfile = RequestHelper.PerformRequest(LinkedInProfileUrl,
                headers: new Dictionary<string, string> { { "Authorization", "Bearer " + accessToken } });
            var loginProfile = ProfileFromLinkedIn(linkedInProfile);
            return loginProfile;
        }

        internal LoginProfile ProfileFromLinkedIn(string linkedInProfile)
        {
            var jProfile = JObject.Parse(linkedInProfile);
            if (jProfile == null) throw new Exception("Failed to correctly process the response");

            var profile = new LoginProfile(Signature, InstanceCrypto)
            {
                Id = jProfile.Value<string>("id"),
                FirstName = jProfile.Value<string>("firstName"),
                LastName = jProfile.Value<string>("lastName"),
                DisplayName = jProfile.Value<string>("formattedName"),
                EMail = jProfile.Value<string>("emailAddress"),
                Provider = ProviderConstants.LinkedIn,
            };

            return profile;
        }
    }
}