// 点击替换主布局
var replaceUrl = "test1.html";
// 定义保存lay-id的数组
var urlList = [replaceUrl];

//JavaScript代码区域
layui.use('element', function() {
	var $ = layui.jquery;
	var element = layui.element;
	// 点击删除tab的事件回调
	$(".layui-tab").on("click", function(e) {
		if($(e.target).is(".layui-tab-close")) {
			// 获取被删除的lay-id的值
			var id = $(e.target).parent().attr("lay-id");
			if(id == undefined) {
				return;
			} else {
				// 找到该lay-id的值在数组中的位置
				var index = urlList.indexOf(id);
				if(index > -1) {
					// 删除数组里面的内容
					urlList.splice(index);
				}
			}
		}
	})

	//触发事件
	var active = {
		// 触发点击增加tab事件
		tabAdd: function() {
			//获取相应内容
			var id = $(this).attr('lay-id');
			var name = $(this).attr('data-name');
			if(replaceUrl == id) {
				return false;
			}
			replaceUrl = id;
			$("#main-content").attr("src", replaceUrl);
			var index = $.inArray(id, urlList);
			if(index >= 0) {
				// 切换到：
				element.tabChange('indexTab', replaceUrl);
				return false;
			}
			// 在集合里面添加lay-id
			urlList.push(id);
			element.tabAdd('indexTab', {
				title: name, //用于演示
				content: id,
				id: id //实际使用一般是规定好的id，这里以时间戳模拟下
			});
			element.tabChange('indexTab', replaceUrl); //切换到：用户管理
		},
		tabDelete: function(othis) {
			//删除指定Tab项
			element.tabDelete('indexTab', '44'); //删除：“商品管理”
			othis.addClass('layui-btn-disabled');
		},
		tabChange: function() {
			//切换到指定Tab项
			element.tabChange('indexTab', '22'); //切换到：用户管理
		}
	};
	$('.menu-item').on('click', function() {
		var othis = $(this),
			type = othis.data('type');
		active[type] ? active[type].call(this, othis) : '';

	});
	//Hash地址的定位
	var layid = location.hash.replace(/^#indexTab=/, '');
	element.tabChange('indexTab', layid);

	element.on('tab(indexTab)', function(elem) {
		location.hash = 'indexTab=' + $(this).attr('lay-id');
		if(replaceUrl == $(this).attr('lay-id')) {
			return false;
		}
		replaceUrl = $(this).attr('lay-id');
		$("#main-content").attr("src", replaceUrl);
	});
});