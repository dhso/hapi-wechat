var xml2js = require('xml2js');

/*!
 * 检查对象是否为空，对xml2js的workaround
 */
var isEmpty = function (thing) {
    return typeof thing === "object" && (thing != null) && Object.keys(thing).length === 0;
};

/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
var formatMessage = function (result) {
    var message = {};
    for (var key in result.xml) {
        var val = result.xml[key][0];
        message[key] = (isEmpty(val) ? '' : val).trim();
    }
    return message;
};

var toJSON = function (data) {
    if (!data) return {};
    var info = {}
    xml2js.parseString(data, { trim: true }, function (err, result) {
        var content = formatMessage(result);
        var type = 'text';
        info.content = content || '';
        // 原始数据存储
        info.default = content;
        if (Array.isArray(content)) {
            type = 'news';
        } else if (typeof content === 'object') {
            if (content.hasOwnProperty('MsgType')) {
                type = content.MsgType;
                info.content = content.Content;
                var evt = content.Event || type;
                type = evt;
            } else {
                type = 'music';
            }
        } else {
            type = 'text';
        }
        info.msgType = type;
        info.createTime = new Date().getTime();
        info.toUsername = content.ToUserName;
        info.fromUsername = content.FromUserName;
    });
    return info;
}

module.exports = toJSON;