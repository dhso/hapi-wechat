'user strict'

const Joi = require('joi')
const Pkg = require('../package.json')
const Wechat = require('wechat')
const WechatAPI = require('wechat-api')

const singleOption = Joi.object({
    path: Joi.string().required(),
    appid: Joi.string().required(),
    appsecret: Joi.string().required(),
    token: Joi.string().required(),
    encodingAESKey: Joi.string().optional()
})

async function register(server, pluginOptions) {
    let options
    try {
        options = await singleOption.validate(pluginOptions)
    } catch (err) {
        throw err
    }

    const wechat_api = new WechatAPI(options.appid, options.appsecret);
    server.decorate('toolkit', 'wechat_api', wechat_api)
    server.route({
        method: ['POST', 'GET'],
        path: options.path,
        handler: function (req, h) {
            Wechat(options.encodingAESKey ? options : options.token, function (req, res, next) {
                // 微信输入信息都在req.weixin上
                console.log(req.weixin);
                // 具体逻辑处理 和 自动回复
                return next();
            });
        }
    });
}
exports.plugin = {
    register: register,
    pkg: Pkg
}