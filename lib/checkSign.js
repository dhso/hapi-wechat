var crypto = require('crypto');
/**
 * 验证token
 * @param query
 * @param token
 * @returns {boolean}
 */
module.exports = function (token, req) {
    var arr = [token, req.query.timestamp, req.query.nonce].sort();
    var sha1 = crypto.createHash('sha1');
    sha1.update(arr.join(''));
    return {
        isSign: sha1.digest('hex') === req.query.signature,
        echostr: req.query.echostr
    };
}
