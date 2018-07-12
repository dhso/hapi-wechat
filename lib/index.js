'user strict'

const glob = require('glob')
const castArray = require('cast-array')
const colors = require('colors')
const fs = require('fs')
const Joi = require('joi')
const Pkg = require('../package.json')
const Wechat = require('./wechat')
const WechatAPI = require('co-wechat-api')

const singleOption = Joi.object({
    routerPath: Joi.string().required(),
    handlerPath: Joi.string().required(),
    appid: Joi.string().required(),
    appsecret: Joi.string().required(),
    token: Joi.string().required(),
    encodingAESKey: Joi.string().optional()
})

var globOptions = {
    nodir: true,
    strict: true,
    cwd: process.cwd(),
    ignore: false
}

async function register(server, pluginOptions) {
    let options, msgHandler = {};
    try {
        options = await singleOption.validate(pluginOptions)
    } catch (err) {
        throw err
    }
    castArray(options.handlerPath).forEach(function (pattern) {
        glob.sync(pattern, globOptions).forEach(function (file) {
            let filename = file.substring(file.lastIndexOf('/') + 1);
            let key = filename.substring(0, filename.lastIndexOf('.'));
            if (['text', 'image', 'voice', 'video', 'location', 'link', 'subscribe', 'unsubscribe', 'click'].includes(key)) {
                msgHandler[key] = require(globOptions.cwd + '/' + file);
                console.log(`wechat [${key}] handler load success.`.green)
            } else {
                console.log(`wechat [${key}] handler load failed, unsupport type!`.red)
            }
        })
    })

    // const wechat = Wechat(options.token, msgHandler);
    // server.decorate('toolkit', 'wechat', wechat);

    const wechat_api = new WechatAPI(options.appid, options.appsecret, async function () {
        // 传入一个获取全局token的方法
        var txt = await fs.readFile('access_token.txt', 'utf8');
        return JSON.parse(txt);
    }, async function (token) {
        // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
        // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
        await fs.writeFile('access_token.txt', JSON.stringify(token));
    });
    
    server.decorate('toolkit', 'wechat_api', wechat_api);

    server.route({
        method: ['POST', 'GET'],
        path: options.routerPath,
        handler: async (req, h) => {
            return wechat.middlewarify(req, h);
        }
    });
}
exports.plugin = {
    register: register,
    pkg: Pkg
}