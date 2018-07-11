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
    return checkSign(this.token, req);
}
// 初始化
WX.prototype.middlewarify = function (req, res) {
    this.res = res;
    this.valid = this.checkSign(req, res);
    console.log('valid', this.valid);
    // 签名错误返回
    if (!this.valid.isSign) {
        return res.response('Invalid signature').code(500);
    }
    switch (req.method.toUpperCase()) {
        case 'GET':
            return res.response(this.valid.echostr).header('Content-Type', 'text/plain');
        case 'POST':
            let inMsg = toJSON(req.payload);
            let outMsg = {
                msgType: 'news',
                createTime: inMsg.createTime,
                fromUsername: inMsg.fromUsername,
                toUsername: inMsg.toUsername,
                content: [
                    {
                        title: "sublime自定义",
                        description: "多年来，我已经用了很多的代码编辑器，从Windows上的“记事本”到Mac上的Espresso ，TextMate和Sublime Text。最终，一直使用Sublime Text 2，因为它是如此的简单易用，可定制的。",
                        url: "http://liuqing.pw/2013/09/12/sublime-customizing-your-workflow.html"
                    }
                ]
            }
            // 不传入，默认为 text
            outMsg.msgType = outMsg.msgType || 'text';
            let XML = this.toXML(outMsg);
            return this.res.response(XML).header('Content-Type', 'text/plain');
        // return this.toJSON(req.payload);
    }
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
    // 不传入，默认为 text
    data.msgType = data.msgType || 'text';
    var XML = this.toXML(data);
    return this.res.response(XML).header('Content-Type', 'text/plain');
}

util.extend(WX.prototype, oauth);
// 接口
module.exports = function (token) {
    return new WX(token);
}