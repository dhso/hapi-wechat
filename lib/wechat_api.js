'use strict';

const API = require('./api_common');
// 菜单接口
API.mixin(require('./api_menu'));
// 分组管理
API.mixin(require('./api_group'));
// 用户信息
API.mixin(require('./api_user'));
// 二维码
API.mixin(require('./api_qrcode'));
// 媒体管理（上传、下载）
API.mixin(require('./api_media'));
// 永久素材管理接口
API.mixin(require('./api_material'));
// 客服消息
API.mixin(require('./api_message'));
// 模板消息
API.mixin(require('./api_template'));
// 获取客服聊天记录
API.mixin(require('./api_custom_service'));
// 高级群发接口
API.mixin(require('./api_mass_send'));
// 微信小店商品管理接口
API.mixin(require('./api_shop_goods'));
// 微信小店库存管理接口
API.mixin(require('./api_shop_stock'));
// 微信小店邮费模版管理接口
API.mixin(require('./api_shop_express'));
// 微信小店分组管理接口
API.mixin(require('./api_shop_group'));
// 微信小店货架管理接口
API.mixin(require('./api_shop_shelf'));
// 微信小店订单管理接口
API.mixin(require('./api_shop_order'));
// 微信小店功能管理接口
API.mixin(require('./api_shop_common'));
// 支付接口
API.mixin(require('./api_payment'));
// 用户维权系统接口
API.mixin(require('./api_feedback'));
// 短网址接口
API.mixin(require('./api_url'));
// 语义查询接口
API.mixin(require('./api_semantic'));
// 获取微信服务器IP地址
API.mixin(require('./api_ip'));
// 图文消息数据分析接口
API.mixin(require('./api_datacube'));
// js sdk接口
API.mixin(require('./api_js'));
// 卡券接口
API.mixin(require('./api_card'));
// 设备接口
API.mixin(require('./api_device'));
// 摇一摇周边接口
API.mixin(require('./api_shakearound'));
// 门店管理接口
API.mixin(require('./api_poi'));

module.exports = API;