'user strict'

const Joi = require('joi')
const Pkg = require('../package.json')
const WechatAPI = require('wechat-api')

const singleOption = Joi.object({
    appid: Joi.string().required(),
    appsecret: Joi.string().required()
})

async function register(server, pluginOptions) {
    let options
    try {
        options = await singleOption.validate(pluginOptions)
    } catch (err) {
        throw err
    }

    const wechat = new WechatAPI(options.appid, options.appsecret);

    server.decorate('toolkit', 'wechat', wechat)
}
exports.plugin = {
    register: register,
    pkg: Pkg
}