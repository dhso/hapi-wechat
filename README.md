# hapi-wechat
Wechat plugin for hapi

# install
```
npm install github:dhso/hapi-wechat
```

#api doc

```
http://doxmate.cool/node-webot/co-wechat-api/api.html
```

# options
```
routerPath: '/wechat, required'
handlerPath: 'wechat/*.js', required'
appid: 'your appid, required',
appsecret: 'your appsecret, required'
token: 'your token, required'
encodingAESKey: 'your encodingAESKey, optional'
```

# example
* support type
```
['text', 'image', 'voice', 'video', 'location', 'link', 'subscribe', 'unsubscribe', 'click']
```
* text handler
```
/wechat/text.js

module.exports = async (inMsg, req, h) => {
    try {
        // wechat api send message
        let res = await h.wechat_api.sendText(inMsg.fromUsername, 'Hello world');
        console.log(res);
        // send common message
        return {
            content: inMsg.content
        }
    } catch (err) {
        // send error message
        return {
            content: err.message
        }
    }
};
```

* subscribe handler
```
/wechat/subscribe.js
module.exports = (inMsg, req, h) => {
    return {
        msgType: 'news',
        content: [
            {
                title: "欢迎关注ThinkApp",
                description: "这是本人测试用的订阅公众号，欢迎访问我的Oschina Git。",
                url: "https://gitee.com/dhso"
            }
        ]
    }
};
```

* a tuling robot example
```
module.exports = async (inMsg, req, h) => {
    try {
        let reply, tuling = await h.axios.post('http://www.tuling123.com/openapi/api', {
            "key": "your key",
            "userid": inMsg.fromUsername,
            "info": inMsg.content
        });
        switch (tuling.data.code) {
            case 100000:
                reply = { 'content': tuling.data.text };
                break;
            case 200000:
                reply = {
                    'msgType': 'news',
                    'content': [{
                        'title': tuling.data.text,
                        'description': '请点击跳转到结果页面。',
                        'url': tuling.data.url
                    }]
                }
                break;
            case 302000:
                reply = {
                    'msgType': 'news',
                    'content': []
                }
                for (var item of tuling.data.list) {
                    if (reply.content.length >= 8) break;
                    reply.content.push({
                        'title': item.article,
                        'description': item.source,
                        'picurl': item.icon.indexOf('//') == 0 ? 'http:' + item.icon : item.icon,
                        'url': item.detailurl
                    });
                }
                break;
            case 308000:
                reply = {
                    'msgType': 'news',
                    'content': []
                }
                for (var item of tuling.data.list) {
                    if (reply.content.length >= 8) break;
                    reply.content.push({
                        'title': item.name,
                        'description': item.info,
                        'picurl': item.icon.indexOf('//') == 0 ? 'http:' + item.icon : item.icon,
                        'url': item.detailurl
                    });
                }
                break;
        }
        return reply;
    } catch (err) {
        return {
            content: err.message
        }
    }
};
```