'user strict'

const Joi = require('joi')
const Pkg = require('../package.json')
const Wechat = require('wechat')
const WechatAPI = require('wechat-api')

const singleOption = Joi.object({
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

    const wechat = Wechat(options.options ? options : options.token);
    server.decorate('toolkit', 'wechat', wechat)
    const wechat_api = new WechatAPI(options.appid, options.appsecret);
    server.decorate('toolkit', 'wechat_api', wechat_api)
}
exports.plugin = {
    register: register,
    pkg: Pkg
}