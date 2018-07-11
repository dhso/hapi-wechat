'user strict'

const Joi = require('joi')
const Pkg = require('../package.json')
const Wechat = require('./wechat')

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

    const wechat = Wechat(options.token);
    server.decorate('toolkit', 'wechat', wechat);

    server.route({
        method: ['POST', 'GET'],
        path: options.path,
        handler: async (req, h) => {
            return wechat.middlewarify(req, h);
        }
    });
}
exports.plugin = {
    register: register,
    pkg: Pkg
}