function open_img(obj) {
	api.openFrame({
		name : 'select-photo-f',
		url : 'select-photo-f.html',
		delay : 200
	});
}

var pageSize = 20;
var is_loaded = false;
var totalCount = '';
var flo;
var num;
var is_loding=false;
function getData(page) {
	var param = {};
	param.id = api.pageParam.id;
	//param.id='ff8080814e9b907a014eb49955473e3f';//'ff8080814e9b907a014eb49955473e3f';
	param.pageNo = page;
	param.pageSize = pageSize;
	//param.ordertype = 2;
	param.token = $api.getStorage('token');
    if(page==1&&show_pro && !is_loding){
        api.showProgress({
            title:'加载中',
            modal:false
        });
    }
	ajaxRequest('api/studytools/discussdetail/v2.1', 'get', param, function(ret, err) {//003.301.1  讨论详情和回复列表
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
		if (ret && ret.state == 'success') {
			var memberId = get_loc_val('mine', 'memberId');
			//if(api.pageParam.memberId == memberId){
			//    api.sendEvent({
			//        name: 'notes_bj_lx',
			//        extra: {key1: ret.data.imgPath,soundPath:ret.data.soundPath,soundlen:ret.data.soundlen,content:ret.data.content}
			//    });
			//}
			var tpl_main = $('#tpl_main').html();
			var content_main = doT.template(tpl_main);
			var tpl_content = $('#tpl_content').html();
			var cont;
			totalCount = ret.data.totalCount;
			if (page == 1) {
				if (isEmpty(ret.data.id)) {
					$('body').addClass('null');
				}
				$('#main1').html(content_main(ret.data));
				if (ret.data.replys.length > 0) {
					flo = 1;
					cont = doT.template(tpl_content);
					$('#content').html(cont({
						'res1' : ret.data.replys,
						'res2' : flo
					}));
				}else{
                    is_loaded=true;
                }
			} else {
				if (ret.data.replys.length > 0) {
					flo = (page - 1) * 20 + 1;
					cont = doT.template(tpl_content);
					$('#content').append(cont({
						'res1' : ret.data.replys,
						'res2' : flo
					}));
				}else{
                    is_loaded=true;
                }
			}
			audioDom();
			api.parseTapmode();
		} else {
			//api.toast({
			//	msg : ret.msg,
			//	location : 'middle'
			//});
		}
	});
}
var currentPage = 0;
function reload(){
    is_loaded = false;
    //var pa= Math.floor( replay_con/20)+1;
    //alert(pa);
    getData(1);
    currentPage=0;
}
apiready = function() {
	getData(1);
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
		is_loaded = false;
		currentPage = 1;
	});
	//滚动到底部
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
        if(!is_loaded){
            currentPage++;
            getData(currentPage);
        }
	});
	api.addEventListener({
		name : 'talk_detail_f_lx'
	}, function(ret) {
		is_loaded = false;
		getData(1);
	});
};

