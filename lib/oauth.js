var urllib = require('urllib');
/**
 * 公共处理函数
 * @param fn
 * @returns {Function}
 */
function handle(fn) {
    var self = this;
    return function (err, data, res) {
        if (err) {
            console.log(err);
            return fn && fn(err, data);
        }
        self.accessToken = data.access_token;
        var time = new Date().getTime();
        self.expireTime = time + (data.expires_in - 10) * 1000;
        fn && fn.call(self, data, res);
    }
}

module.exports = {
    OAuth: function (opts) {
        this.appid = opts.appid;
        this.appsecret = opts.appsecret;
        console.log('set oAuth success!');
    },
	/**
	 * 根据 appid/secret 获取accessToken
	 * @param fn
	 */
    getAccessToken: function (fn) {
        var self = this;
        var url = 'https://api.weixin.qq.com/cgi-bin/token';
        var info = {
            appid: this.appid,
            secret: this.appsecret,
            grant_type: 'client_credential'
        }

        urllib.request(url, {
            data: info,
            dataType: 'json'
        }, handle.call(self, fn));

        console.log('getAccessToken!');
    },
	/**
	 * 上传图文素材
	 * @param fn
	 */
    uploadNews: function (infoArr, fn) {
        var self = this;
        var url = 'https://api.weixin.qq.com/cgi-bin/media/uploadnews';

        var info = {
            access_token: self.accessToken,
            articles: infoArr || []
        }

        urllib.request(url, {
            method: 'post',
            data: info,
            dataType: 'json'
        }, handle.call(self, fn));
    },
	/**
	 * 上传图文素材
	 * @param grounpId
	 * @param type
	 * @param infoArr
	 * @param fn
	 */
    uploadNews: function (grounpId, type, infoArr, fn) {
        var self = this;
        var url = 'https://api.weixin.qq.com/cgi-bin/media/uploadnews';

        var info = {
            access_token: self.accessToken,
            filter: grounpId,
            msgtype: type
        }

        switch (type) {
            case 'mpnews':
                info.mpnews = infoArr;
                break;
        }

        urllib.request(url, {
            method: 'post',
            data: info,
            dataType: 'json'
        }, handle.call(self, fn));
    },
	/**
	 * 获取所有分组
	 * @param fn
	 */
    getGroups: function (fn) {
        var self = this;
        var url = 'https://api.weixin.qq.com/cgi-bin/groups/get';

        var info = {
            access_token: self.accessToken
        }

        urllib.request(url, {
            data: info,
            dataType: 'json'
        }, handle.call(self, fn));
        console.log('getGroups!');
    },
	/**
	 * 根据openid 群发
	 * @param touser
	 * @param type
	 * @param mpnews
	 * @param fn
	 */
    massSendId: function (touser, type, mpnews, fn) {
        var self = this;
        var url = 'https://api.weixin.qq.com/cgi-bin/message/mass/send';

        var info = {
            access_token: self.accessToken,
            touser: touser,
            mpnews: mpnews,
            msgtype: type
        }
        urllib.request(url, {
            method: 'post',
            data: info,
            dataType: 'json'
        }, handle.call(self, fn));
    }
}