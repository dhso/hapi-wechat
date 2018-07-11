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
            wechat.middlewarify(req, h);
            wechat.text(function (data) {
                var msg = {
                    msgType: 'news',
                    createTime: data.createTime,
                    fromUsername: data.fromUsername,
                    toUsername: data.toUsername,
                    content: [
                        {
                            title: "sublime自定义",
                            description: "多年来，我已经用了很多的代码编辑器，从Windows上的“记事本”到Mac上的Espresso ，TextMate和Sublime Text。最终，一直使用Sublime Text 2，因为它是如此的简单易用，可定制的。",
                            url: "http://liuqing.pw/2013/09/12/sublime-customizing-your-workflow.html"
                        }
                    ]
                }
                wechat.send(msg);
            });

        }
    });
}
exports.plugin = {
    register: register,
    pkg: Pkg
}