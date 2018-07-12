const toXML = require('./toXML');
const toJSON = require('./toJSON');
const checkSign = require('./checkSign');
const util = require('./util');
const oauth = require('./oauth');

/**
 * 基础类
 * @param token
 * @param msgHandler
 * @constructor
 */
function WX(token, msgHandler) {
    this.token = token;
    this.msgHandler = msgHandler;
    this.res = null;
}
/**
 * 验证sign
 * @param req
 * @param res
 * @returns {*}
 */
WX.prototype.checkSign = function (req, res) {
    return checkSign(this.token, req);
}
// 初始化
WX.prototype.middlewarify = function (req, res) {
    this.res = res;
    this.valid = this.checkSign(req, res);
    // 签名错误返回
    if (!this.valid.isSign) {
        return this.send('Invalid signature', 500);
    }
    switch (req.method.toUpperCase()) {
        case 'GET':
            return this.send(this.valid.echostr);
        case 'POST':
            let inMsg = toJSON(req.payload);
            let outMsg = {
                msgType: 'text',
                createTime: inMsg.createTime,
                fromUsername: inMsg.toUsername,
                toUsername: inMsg.fromUsername
            };
            if (this.msgHandler[inMsg.msgType]) {
                outMsg = Object.assign(outMsg, this.msgHandler[inMsg.msgType](inMsg));
            } else {
                outMsg = Object.assign(outMsg, { content: '暂不支持的消息类型' });
            }
            return this.send(toXML(outMsg));
    }
};

WX.prototype.send = function (outMsg, code = 200) {
    return this.res.response(outMsg).header('Content-Type', 'text/plain').code(code);
}

util.extend(WX.prototype, oauth);

// 接口
module.exports = function (token, msgHandler) {
    return new WX(token, msgHandler);
}