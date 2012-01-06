var oauthModule = require('./oauth');

var bitbucket = module.exports =
oauthModule.submodule('bitbucket')
    .apiHost('https://bitbucket.org/api/1.0')
    .oauthHost('https://bitbucket.org/api/1.0/oauth')
    .requestTokenPath('/request_token')
    .authorizePath('/authenticate')
    .accessTokenPath('/access_token')
    .entryPath('/auth/bitbucket')
    .callbackPath('/auth/bitbucket/callback')
    .fetchOAuthUser( function (accessToken, accessTokenSecret, params) {
        var p = this.Promise();
        this.oauth.get(this.apiHost() + '/user', accessToken, accessTokenSecret, function (err, data) {
            if (err) {
                console.error(err);
                return p.fail(err.error_message);
            }
            var oauthUser = JSON.parse(data);
            p.fulfill(oauthUser);
        })
        return p;
    })
    .convertErr( function (data) {
        return new Error(data.error_message);
    });

