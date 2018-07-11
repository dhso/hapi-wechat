'user strict'

const Joi = require('joi')
const Pkg = require('../package.json')
const Wechat = require('co-wechat')
const WechatAPI = require('co-wechat-api')

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
            Wechat(options.encodingAESKey ? options : options.token).middleware(async (msg, ctx) => {
                console.log(msg);
            })
        }
    });
}
exports.plugin = {
    register: register,
    pkg: Pkg
}