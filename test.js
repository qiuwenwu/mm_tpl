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
	// 渲染视图(并缓存)
	var body = tpl.view("./test", { arr: [123, 234] }, {
		// 是否读取缓存文件, 如果为false, 但有cache_filename, 表示只保存缓存，但不读取
		cache: true,
		// 缓存文件名
		cache_filename: "./test"
	});
	
	// 删除指定目录的缓存文件
	// tpl.clear_cache('./mall');
	console.log(body);
}
test();
