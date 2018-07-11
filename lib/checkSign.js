var crypto = require('crypto');
var querystring = require('querystring');
var url = require('url');
/**
 * 验证token
 * @param query
 * @param token
 * @returns {boolean}
 */
module.exports = function (token, req) {
    var query = querystring.parse(url.parse(req.url).query);

    var sign = query.signature,
        stamp = query.timestamp,
        nonce = query.nonce

    var arr = [token, stamp, nonce].sort();

    var sha1 = crypto.createHash('sha1');
    sha1.update(arr.join(''));
    return {
        isSign: sha1.digest('hex') === sign,
        echostr: query.echostr
    };
}
