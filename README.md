# hapi-wechat
Wechat plugin for hapi

# install
```
npm install github:dhso/hapi-wechat
```

#api doc

```
http://doxmate.cool/node-webot/wechat-api/api.html
```

# options
```
routerPath: '/wechat, required'
handlerPath: 'wechat/*.js',, required'
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
* modules like this
```
/wechat/text.js

module.exports = (inMsg) => {
    return {
        content: inMsg.content
    }
};
```