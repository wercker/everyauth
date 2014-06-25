var oauthModule = require('./oauth')
  , Parser = require('xml2js').Parser
  , url = require('url');

var t = module.exports =
oauthModule.submodule('tumblr')
  .apiHost('https://api.tumblr.com/v2')
  .oauthHost('https://www.tumblr.com')
  .entryPath('/auth/tumblr')
  .callbackPath('/auth/tumblr/callback')
  .sendCallbackWithAuthorize(false)
  .fetchOAuthUser( function (accessToken, accessTokenSecret, params) {
    var promise = this.Promise();
    this.oauth.get(this.apiHost() + '/user/info', accessToken, accessTokenSecret, function (err, data) {
      if (err) return promise.fail(err);
      var oauthUser = JSON.parse(data);
      promise.fulfill(oauthUser);
    });
    return promise;
  })
  .authCallbackDidErr( function (req) {
    var parsedUrl = url.parse(req.url, true);
    return !parsedUrl.query || !parsedUrl.query.oauth_token;
  })
  .handleAuthCallbackError( function (req, res) {
    if (res.render) {
      res.render(__dirname + '/../views/auth-fail.jade', {
        errorDescription: 'The user denied your request'
      });
    } else {
      // TODO Replace this with a nice fallback
      throw new Error("You must configure handleAuthCallbackError if you are not using express");
    }
  })
  .convertErr( function (data) {
    return new Error(data.data);
  });
