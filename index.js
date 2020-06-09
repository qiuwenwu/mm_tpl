require('mm_expand');
const template = require('art-template');
const {
	nativeRule,
	artRule,
	htmlRule,
	jsRule
} = require('./tpl_rule');

if (!$.globalBag) {
	$.globalBag = {};
}

/**
 * 模板类
 * @class
 */
class Tpl {
	/**
	 * 创建模板帮助类函数 (构造函数)
	 * @param {String} scope 作用域
	 * @param {String} dir 文件存储路径
	 * @constructor
	 */
	constructor(config) {
		/**
		 * 配置参数
		 */
		this.config = {
			root: $.runPath + '',
			extname: ".html",
			rules: [nativeRule, artRule, htmlRule, jsRule],
			cache_root: './cache'.fullname(),
			cache_extname: '.cache.html'
		};

		/**
		 * 模板引擎
		 */
		this.template = template;

		/**
		 * 视图背包
		 */
		this.viewBag = {};

		// 修改配置
		this.set_config(config);
	}
}

/**
 * 修改配置
 * @param {Object} config 配置参数
 */
Tpl.prototype.set_config = function(config) {
	if (config) {
		this.config = Object.assign(this.config, config);
	}
	var cg = this.config;
	for (var key in cg) {
		template.defaults[key] = cg[key];
	}
	if (!cg.cache_root.hasDir()) {
		cg.cache_root.addDir()
	}
};

/**
 * 渲染模板(之前)
 * @param {String} body 模板
 * @param {Object} model 数据模型
 * @param {Object} options 配置参数
 * @return {String} 渲染结果
 */
Tpl.prototype.render_before = function(body, model, options) {
	var ret = "";
	if (options && options.cache) {
		var f = options.cache_filename;
		if (f) {
			if (f.replace('./', '').indexOf('.') == -1 && !f.endWith(this.config.cache_extname)) {
				f += this.config.cache_extname;
			}
			var file = f.fullname(this.config.cache_root);
			// 如果文件存在
			if (file.hasFile()) {
				ret = file.loadText();
			}
		}
	}
	return ret;
};

/**
 * 渲染模板(主要)
 * @param {String} body 模板
 * @param {Object} model 数据模型
 * @param {Object} options 配置参数
 * @return {String} 渲染结果
 */
Tpl.prototype.render_main = function(body, model, options) {
	var ret = "";
	if (body) {
		ret = template.render(body, Object.assign({}, {
			viewBag: this.viewBag,
			globalBag: $.globalBag
		}, model), options);
	}
	return ret;
};

/**
 * 渲染模板(之后)
 * @param {String} body 模板
 * @param {Object} model 数据模型
 * @param {Object} options 配置参数
 * @return {String} 渲染结果
 */
Tpl.prototype.render_after = function(body, model, options) {
	if (body) {
		if (options) {
			var f = options.cache_filename;
			if (f) {
				if (f.replace('./', '').indexOf('.') == -1 && !f.endWith(this.config.cache_extname)) {
					f += this.config.cache_extname;
				}
				var file = f.fullname(this.config.cache_root);
				file.saveText(body);
			}
		}
	}
	return body;
};


/**
 * 渲染模板
 * @param {String} body 模板
 * @param {Object} model 数据模型
 * @param {Object} options 配置参数
 * @return {String} view 渲染后的视图
 */
Tpl.prototype.render = function(body, model, options) {
	var ret = this.render_before(body, model, options);
	if (!ret) {
		ret = this.render_main(body, model, options);
		if (ret) {
			ret = this.render_after(ret, model, options);
		}
	}
	return ret;
};

/**
 * 编译模板并返回渲染函数
 * @param {String} body 模板
 * @param {Object} options 配置参数
 * @return {Function} 渲染函数
 */
Tpl.prototype.compile = function(body, options) {
	return template.compile(body, options);
};

/**
 * 渲染模板文件
 * @param {String} file 模板文件路径
 * @param {Object} model 数据模型
 * @param {Object} options 配置参数
 * @return {String} 渲染后的视图
 */
Tpl.prototype.view = function(file, model, options) {
	if (file.replace('./', '').indexOf('.') == -1 && !file.endWith(this.config.extname)) {
		file += this.config.extname;
	}
	var f = file.fullname(this.dir);
	var body = f.loadText();
	if (body) {
		return this.render(body, model, options);
	}
	return "";
};

/**
 * 设置视图背包成员
 * @param {Object} obj 设置的对象
 */
Tpl.prototype.set = function(obj) {
	$.push(this.viewBag, obj, true);
};

/**
 * 删除视图背包成员
 * @param {Array|String} arrOrStr 删除的键或键数组
 */
Tpl.prototype.del = function(arrOrStr) {
	if (typeof(arrOrStr) == 'string') {
		delete this.viewBag[arrOrStr];
	} else {
		arr.map(function(k) {
			delete this.viewBag[k];
		});
	}
};

/**
 * 获取视图背包成员
 * @param {String} key 获取的对象键名
 * @return {Object} 值
 */
Tpl.prototype.get = function(key) {
	return this.viewBag[key];
};

/**
 * 清除缓存
 * @param {Object} path 检索的路径
 * @param {Object} file 文件名
 */
Tpl.prototype.clear_cache = function(path, file) {
	var cg = this.config;
	var root = cg.cache_root;
	var dir = path ? path.fullname(root) : root;
	var keyword = file || '*' + cg.cache_extname;
	var list_file = $.file.getAll(dir, keyword);
	list_file.forEach((f) => {
		f.delFile(root);
	});
	list_file = $.file.get(dir, keyword);
	list_file.forEach((f) => {
		f.delFile(root);
	});
};

if (global.$) {
	$.Tpl = Tpl;
	$.tpl = new Tpl();
}

module.exports = Tpl;
