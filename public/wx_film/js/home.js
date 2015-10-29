$(function(){
	$.dialog({
		title : '编辑快捷导航',
		content : 'url:pop/set_nav.html',
		title : '编辑快捷导航',
		content : 'url:pop/set_nav.html',
		data:{},
		width : 750,
		height : 350,
		max : false,
		min : false,
		cache : false,
		lock: true,
		ok: function(data){
			alert('保存快捷导航');
		},
		okVal: '保存'
	});
	//for ie	
	if($.support.getSetAttribute==false){
		$('body').prepend('<div class="update">您现在使用的浏览器版本过低，可能会导致部分图片和信息的缺失。请立即 <a href="http://http://www.microsoft.com/china/windows/IE/upgrade/index.aspx" target="_blank">升级IE浏览器</a> 或者下载其它浏览器，如 <a href="http://www.firefox.com.cn/" target="_blank">Firefox</a> 或 <a href="http://www.google.cn/intl/zh-CN/chrome/browser/" target="_blank">Chrome</a></div>');
		function hideUpdate() {$('.update').remove(); }
		setTimeout(hideUpdate, 3000 );
	}
});