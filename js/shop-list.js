var laydate;
var laypage;
var layer;
var table;
var carousel;
var upload;
var element;
var slider;

layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
	laydate = layui.laydate; //日期
	laypage = layui.laypage; //分页
	layer = layui.layer; //弹层
	table = layui.table; //表格
	carousel = layui.carousel; //轮播
	upload = layui.upload; //上传
	element = layui.element; //元素操作
	slider = layui.slider; //滑块
	// 请求数据
	loadShopData();
});
// 请求商品列表数据
function loadShopData() {
	layer.load(1);
	$.ajax({
		type: "post",
		url: baseUrl + "/mobile/home/QueryGoodsList",
		async: true,
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data: {
			currpage: 1,
			userId: "71c33fa8d957bf71fed3c47c974988ce1405057a"
		},
		dataType: "json"
	}).success(function(res) {
		if(res.code == 200) {
			setTimeout(function() {
				layer.closeAll('loading');
			});
			tableShop(res.result);
		} else {
			setTimeout(function() {
				layer.closeAll('loading');
				layer.msg(res.message);
			});
		}
	}).error(function(res) {
		setTimeout(function() {
			layer.closeAll('loading');
			layer.msg('请求失败！');
		});
		//向世界问个好
	});
}
// 设置数据到表格
function tableShop(data) {
	//执行一个 table 实例
	table.render({
		elem: '#shopList',
		height: 500,
		title: '用户表',
		page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
			layout: ['prev', 'page', 'next', 'skip', 'count'], //自定义分页布局
			//,curr: 5 //设定初始在第 5 页
			groups: 1, //只显示 1 个连续页码
			first: false, //不显示首页
			last: false, //不显示尾页
			limit: 5,
		},
		toolbar: '#toolbarShop', //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
		totalRow: false, //开启合计行
		data: data,
		cols: [
			[ //表头
				{
					type: 'checkbox',
					fixed: 'left'
				}, {
					field: 'id',
					title: 'ID',
					width: 150,
					sort: true,
					fixed: 'left',
					totalRowText: '合计：'
				}, {
					field: 'subTitle',
					title: '商品名称',
					width: 278
				}, {
					field: 'price',
					title: '现价',
					width: 100,
					sort: true,
					totalRow: true
				}, {
					field: 'oldPrice',
					title: '原价',
					width: 100,
					sort: true
				}, {
					field: 'detail',
					title: '简介',
					width: 470,
					sort: true,
					totalRow: true
				}, {
					fixed: 'right',
					width: 165,
					align: 'center',
					toolbar: '#barShop'
				}
			]
		]
	});

	//监听头工具栏事件
	table.on('toolbar(shop-layui)', function(obj) {
		var checkStatus = table.checkStatus(obj.config.id),
			data = checkStatus.data; //获取选中的数据
		switch(obj.event) {
			case 'add':
				layer.msg('添加');
				break;
			case 'update':
				if(data.length === 0) {
					layer.msg('请选择一行');
				} else if(data.length > 1) {
					layer.msg('只能同时编辑一个');
				} else {
					layer.alert('编辑 [id]：' + checkStatus.data[0].id);
				}
				break;
			case 'delete':
				if(data.length === 0) {
					layer.msg('请选择一行');
				} else {
					layer.msg('删除');
				}
				break;
		};
	});

	//监听行工具事件
	table.on('tool(shop-layui)', function(obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
		var data = obj.data, //获得当前行数据
			layEvent = obj.event; //获得 lay-event 对应的值
			console.log(JSON.stringify(data))
			
		if(layEvent === 'detail') {
			layer.msg('查看操作');
		} else if(layEvent === 'del') {
			layer.confirm('真的删除行么', function(index) {
				obj.del(); //删除对应行（tr）的DOM结构
				layer.close(index);
				//向服务端发送删除指令
			});
		} else if(layEvent === 'edit') {
			layer.msg('编辑操作');
			// 点击弹出一个html内容
			layer.open({
				type: 2,
				title:"编辑商品",
				area: ['980px', '460px'],
				maxmin: true,
				content: 'edit_shop.html?id=' +data.id
			});
		}
	});
}