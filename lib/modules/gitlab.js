var oauthModule = require('./oauth2');

var gitlab = module.exports =
oauthModule.submodule('gitlab')
  .oauthHost('https://gitlab.com/oauth')
  .apiHost('https://gitlab.com/api/v4')
  .authPath('/authorize')
  .accessTokenPath('/token')
  .entryPath('/auth/gitlab')
  .callbackPath('/auth/gitlab/callback')
  .authQueryParam('response_type', 'code')
  .accessTokenParam('grant_type', 'authorization_code')

  .fetchOAuthUser( function (accessToken) {
    var p = this.Promise();
    this.oauth.get(this.apiHost() + '/user', accessToken, function (err, data) {
      if (err) {
        console.log(err);
        return p.fail(err);
      }
      var oauthUser = JSON.parse(data);
      p.fulfill(oauthUser);
    });
    return p;
  })
  .convertErr( function (err) {
      console.log(err);
      return new Error(err.error_message);
  })
  .moduleTimeout(30000);
