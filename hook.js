const {
	types
} = require("node:util");

class Hook {
	constructor() {
		this.dict_func = {};
		this.dict_action = {};
		this.dict_filter = {};
	}
}

/**
 * 排序
 * @param {Array} list 钩子列表
 */
Hook.prototype.sort = function(list) {
	return list.sort((o1, o2) => {
		return o2.sort - o1.sort
	});
}

/**
 * 添加函数钩子
 * @param {String} name 钩子名称
 * @param {Function} func 钩子函数
 * @param {Number} sort 执行顺序
 * @param {String} alias 函数别名，用于删除
 */
Hook.prototype.addFunc = function(name, func, sort, alias) {
	var obj = {
		func,
		sort,
		alias
	}
	var arr = this.dict_func[name];
	if (!arr) {
		arr = [];
	}
	arr.push(obj);
	this.dict_func[name] = this.sort(arr);
}

/**
 * 添加动作钩子
 * @param {String} name 钩子名称
 * @param {Function} func 钩子函数
 * @param {Number} sort 执行顺序
 * @param {String} alias 函数别名，用于删除
 */
Hook.prototype.addAction = function(name, func, sort, alias) {
	var obj = {
		func,
		sort,
		alias
	}
	var arr = this.dict_action[name];
	if (!arr) {
		arr = [];
	}
	arr.push(obj);
	this.dict_action[name] = this.sort(arr);
}

/**
 * 添加过滤钩子
 * @param {String} name 钩子名称
 * @param {Function} func 钩子函数
 * @param {Number} sort 执行顺序
 * @param {String} alias 函数别名，用于删除
 */
Hook.prototype.addFilter = function(name, func, sort, alias) {
	var obj = {
		func,
		sort,
		alias
	}
	var arr = this.dict_filter[name];
	if (!arr) {
		arr = [];
	}
	arr.push(obj);
	this.dict_filter[name] = this.sort(arr);
}


/**
 * 删除函数钩子
 * @param {String} name 钩子名称
 * @param {String} alias 函数别名
 */
Hook.prototype.delFunc = function(name, alias) {
	var arr = this.dict_func[name];
	if (arr) {
		arr.del({
			alias
		});
	}
}

/**
 * 删除动作钩子
 * @param {String} name 钩子名称
 * @param {String} alias 函数别名
 */
Hook.prototype.delAction = function(name, alias) {
	var arr = this.dict_action[name];
	if (arr) {
		arr.del({
			alias
		});
	}
}

/**
 * 删除过滤钩子
 * @param {String} name 钩子名称
 * @param {String} alias 函数别名
 */
Hook.prototype.delFilter = function(name, alias = "") {
	var arr = this.dict_filter[name];
	if (arr) {
		arr.del({
			alias
		});
	}
}

/**
 * 运行动作钩子
 * @param {String} name 钩子名称
 * @param {Object} model 模型
 * @param {Object} args 附加参数
 */
Hook.prototype.runAction = function(name, model, ...args) {
	var ret = "";
	var dict = this.dict_action;
	var list = dict[name];
	if (list) {
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			try {
				ret += o.func(model, ...args);
			} catch (err) {
				console.error(ret);
			}
		}
	}
	return ret;
}

/**
 * 运行过滤钩子
 * @param {String} name 钩子名称
 * @param {Object} ret 结果
 * @param {Object} model 模型
 * @param {Object} args 附加参数
 */
Hook.prototype.runFilter = function(name, ret, model, ...args) {
	var dict = this.dict_filter;
	var list = dict[name];
	if (list) {
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			try {
				ret = o.func(ret, model, ...args);
			} catch (err) {
				console.error(ret);
			}
		}
	}
	return ret;
}

/**
 * 运行函数钩子
 * @param {String} name 钩子名称
 * @param {Object} model 模型
 * @param {Object} req 请求参数
 * @param {Object} args 附加参数
 */
Hook.prototype.runFunc = async function(name, model, req, ...args) {
	var ret;
	var dict = this.dict_func;
	var list = dict[name];
	if (list) {
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			try {
				ret = o.func(model, req, ...args);
				if (ret) {
					ret = await ret;
				}
			} catch (err) {
				console.error(ret);
			}
		}
	}
	return ret;
}

module.exports = Hook;