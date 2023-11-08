const Tpl = require('./index.js');

// async function test() {
// 	var tpl = new Tpl();
// 	var body = tpl.render("<a>${test} + 123123</a>", {
// 		test: 123
// 	});
// 	console.log(body);
// }

// async function test() {
// 	var tpl = new Tpl();
// 	// var body = tpl.render("<a>${loop arr value idx} ${idx} ${ value } ${/loop} + 123123</a>", { arr: [123,234] });

// 	var body = tpl.render("<a>${ loop obj value key } ${ key } ${ value } ${/loop} + 123123</a>", { obj: { a: 123, b: 467 } });

// 	// var body = tpl.render("<a><!--[ for(var i = 0; i < arr.length; i++){ ]--> ${ arr[i] } <!--[ } ]--> + 123123</a>", {
// 	// 	arr: [123, 234]
// 	// });

// 	// var body = tpl.render("<a>${ each arr } ${ arr[$index] } ${/each} + 123123</a>", { arr: [123,234] });
// 	// var view = tpl.render("<a>${ each arr } ${ $value } ${/each} + 123123</a>", { arr: [123,234] });
// 	console.log(body);
// }

// async function test() {
// 	var tpl = new Tpl();
// 	// 设置全局变量
// 	$.globalBag.name = "超级美眉Art模板引擎";

// 	// 设置实例化视图变量
// 	tpl.viewBag.name = "系统名称";

// 	// 渲染视图
// 	var body = tpl.view("./test.html", { arr: [123,234] });
// 	console.log(body);
// }

async function test() {
	var tpl = new Tpl();

	// 设置全局变量
	$.globalBag.name = "超级美眉Art模板引擎";

	// 设置实例化视图变量
	tpl.viewBag.name = "系统名称";
	tpl.current_theme = "game";
	tpl.dir = "";

	$.hook.addFunc('list', async function(m, req, type) {
		var query = req.query;
		if (query.user_id) {
			m.user_id = query.user_id;
		}
		if (query.project_id) {
			m.project_id = query.project_id;
		}
		console.log(m);
	});

	$.hook.addAction('test', function aa (m, param) {
		// console.log(param, m);
		return "<div>你好吗？</div>";
	}, 2);

	$.hook.addAction('test', function(m, param) {
		return "<div>你好！</div>";
	}, 1, "测试动作1");

	$.hook.addFilter('test', function(ret, m, param) {
		// console.log(ret, param, m);
		return ret.replace("你", "您");
	}, 1, "测试过滤");
	
	// $.hook.delAction('test', "aa");
	// $.hook.delAction('test', "测试动作1");
	// $.hook.delFilter('test', "测试过滤");

	await tpl.runFunc('list', {
		query: {
			user_id: 1,
			project_id: 2
		}
	}, 'article');

	// 渲染视图(并缓存)
	var body = tpl.view("./test", {
		arr: [123, 234],
		message: "hello world！"
	}, {
		// 是否读取缓存文件, 如果为false, 但有cache_filename, 表示只保存缓存，但不读取
		cache: false,
		// 缓存文件名
		cache_filename: "./test"
	});
	// 删除指定目录的缓存文件
	// tpl.clear_cache('./mall');
	console.log(body);
}
test();