var pageSize = 10;
function renew() {
	var systemType = api.systemType;
	if (systemType == 'ios') {
		api.openApp({
			iosUrl : 'http://www.caicui.com/mc/examReport/add?token=' + $api.getStorage('token')
		});
	} else {
		api.openApp({
			androidPkg : 'android.intent.action.VIEW',
			mimeType : 'text/html',
			uri : 'http://www.caicui.com/mc/examReport/add?token=' + $api.getStorage('token')
		}, function(ret, err) {
		});
	}
	//api.openWin({
	//    name:'outside',
	//    url:'outside.html',
	//    delay:200,
	//    pageParam:{title:'申请重听',url:'http://www.caicui.com/mc/examReport/add'}
	//});
}
var is_loding=false;
function getData(page) {
	//var tpl = $('#tpl').html();
	//var content = doT.template(tpl);
	//if (page == 1) {
	//    $('#content').html(content(data));
	//} else {
	//    $('#content').append(content(data));
	//}
	//return;
	var param = {};
	param.pageNo = page;
	param.pageSize = pageSize;
	param.token = $api.getStorage('token');
	if(page==1&&show_pro && !is_loding){
	    api.showProgress({
	        title : '加载中',
	        modal : false
	    });
	}
	ajaxRequest('api/v2.1/learning/expirationcourse', 'get', param, function(ret, err) {//008.004.1 已过期课程
        api.refreshHeaderLoadDone();
        is_loding=true;
		if(show_pro){
            api.hideProgress();
        }
		if (err) {
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		var tpl = $('#tpl').html();
		var content = doT.template(tpl);
		if (ret && ret.state == 'success') {
            var is_show;
            var systemType = api.systemType;  // 比如: ios
			total = ret.data.total;
			if (page == 1) {
				if (isEmpty(ret.data.courselist)) {
					$('body').addClass('null');
					return false;
				}
                if(systemType=='ios'){
                    is_show=  ret.data.isdisplay
                }else{
                    is_show=true;
                }
				$('#content').html(content({data:ret.data.courselist,is_show:is_show}));
			} else {
				if (isEmpty(ret.data.courselist)) {
					return false;
				}
                if(systemType=='ios'){
                    is_show=  ret.data.isdisplay
                }else{
                    is_show=true;
                }
				$('#content').append(content({data:ret.data.courselist,is_show:is_show}));
			}
			api.parseTapmode();
		} else {
			/*api.toast({
				msg : ret.msg,
				location : 'middle'
			});*/
		}
	});
}

var total = 0;
apiready = function() {
	getData(1);
	var currentPage = 1;
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/arrow-down-o.png',
		bgColor : '#f3f3f3',
		textColor : '#787b7c',
		textDown : '下拉更多',
		textUp : '松开刷新',
		showTime : false
	}, function(ret, err) {
		getData(1);
		currentPage = 1;
	});
	//滚动到底部
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (total == 0 || currentPage < Math.ceil(total / pageSize)) {
			currentPage++;
			getData(currentPage);
		}
	});
};
