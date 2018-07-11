const events = require('events');
const emitter = new events.EventEmitter();

const toXML = require('./toXML');
const toJSON = require('./toJSON');
const checkSign = require('./checkSign');
const util = require('./util');
const oauth = require('./oauth');

/**
 * 基础类
 * @param token
 * @constructor
 */
function WX(token) {
    this.token = token;
    this.res = null;
}
/**
 * 验证sign
 * @param req
 * @param res
 * @returns {*}
 */
WX.prototype.checkSign = function (req, res) {
    var valid = checkSign(this.token, req);
    // 签名错误返回
    if (!valid.isSign) {
        return res.response('Invalid signature').code(500);
    }
    if (req.method !== 'GET') return this;
    req.response.header('Content-Type', 'text/plain');
    res.response(valid.echostr);
}
// 初始化
WX.prototype.middlewarify = function (req, res) {
    this.res = res;
    this.checkSign(req, res);
    var method = req.method;
    if (method === 'POST') {
        var self = this;
        var xml = '';

        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            xml += chunk;
        });
        req.on('end', function () {
            self.toJSON(xml);
        });
        return;
    }

    if (method === 'GET') return;

};
// 监听函数
function eventBind(fn) {
    ['text', 'image', 'voice', 'video', 'location', 'link', 'subscribe', 'unsubscribe', 'click'].forEach(function (name) {
        fn && fn(name);
    });
}
// 监听单个事件
eventBind(function (name) {
    WX.prototype[name] = function (fn) {
        emitter.on(name, fn);
        return this;
    }
});
// 监听所有信息
WX.prototype.all = function (fn) {
    eventBind(function (name) {
        emitter.on(name, fn);
    });
    return this;
}

WX.prototype.toXML = toXML;
WX.prototype.toJSON = function (data) {
    var message = toJSON(data);
    emitter.emit(message.msgType, message);
};
// 消息回复
WX.prototype.send = function (data) {
    req.response.header('Content-Type', 'text/plain');
    // 不传入，默认为 text
    data.msgType = data.msgType || 'text';
    var XML = this.toXML(data);
    return res.response(XML);
}

util.extend(WX.prototype, oauth);
// 接口
module.exports = function (token) {
    return new WX(token);
}