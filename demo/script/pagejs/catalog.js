
var course_detail;
var pageName = 'catalog';

var total = 0;
function getData() {
	var uid =memberId;
	var cid = api.pageParam.course_id;
	var time1 = Date.now();
	var data = isEmpty($api.getStorage(cid + '-' + uid)) ? '' : $api.getStorage(cid + '-' + uid);
	if (data && time1 - data['time'] < course_detail_expire) {
		var course_data = data.data;
		course_detail = course_data[0];
        $api.setStorage(cid, course_detail);
		if (isEmpty(course_data)) {
			$('body').addClass('null');
			return false;
		}
		var tpl = $('#tpl').html();
		var content = doT.template(tpl);
		var ret_data = course_data;
		api.getFreeDiskSpace(function(ret, err) {
			var size = (ret.size / 1000 / 1000).toFixed(2);
			var htm = "<div class='avaiace'  onclick='to_cache()'><span class='manage'>课程缓存管理</span><p class='space'>可用空间" + size + "MB<span></span></p></div>";
			htm = htm + content(ret_data[0]);
			$('#content').html(htm);
			//处理圈圈
			isSolidcircle('circle', '', '');
            init_process();
		});
	} else {
		var param = {};
		param.courseId = api.pageParam.course_id;
		ajaxRequest('api/v2.1/course/courseDetail', 'get', param, function(ret, err) {
			api.parseTapmode();
			if (err) {
				/*api.toast({
					msg : err.msg,
					location : 'middle'
				});*/
				return false;
			}
			var tpl = $('#tpl').html();
			var content = doT.template(tpl);
			if (ret && ret.state == 'success') {
				if (isEmpty(ret.data)) {
					$('body').addClass('null');
					return false;
				}
				var ret_data = ret.data;
				course_detail = ret_data[0];
                $api.setStorage(cid, course_detail);
				api.getFreeDiskSpace(function(ret, err) {
					var size = (ret.size / 1000 / 1000).toFixed(2);
					var htm = "<div class='avaiace'  onclick='to_cache()'><span class='manage'>课程缓存管理</span><p class='space'>可用空间" + size + "MB<span></span></p></div>";
					htm = htm + content(ret_data[0]);
					$('#content').html(htm);
					//处理圈圈
					isSolidcircle('circle', '', '');
                    init_process();
				});
				var time_now = Date.now();
				var data = {
					'time' : time_now,
					'data' : ret.data
				};
				$api.setStorage(cid + '-' + uid, data);
			} else {
				api.toast({
					msg : ret.msg,
					location : 'middle'
				});
			}
		});
	}
	$('.bewrite .bewtitl').parent().siblings().css({
		height : '0px'
	});
}
function init_process(){
    circleProgress();
    //圆形进度条绘制
    $.each($('.down-progress'), function(k, v) {
        var num = parseInt($(v).find('.val').html());
        if (!isEmpty(num)) {
            var percent = num / 100, perimeter = Math.PI * 0.9 * $('#svgDown').width();
            $(v).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
        }
    });
    //初始化下载状态
    var downed = $api.getStorage(memberId+'downed');
    if (downed) {
        var chapterIdA = get_loc_val(memberId + 'downed', 'chapterIdA'),chapterIdB = get_loc_val(memberId + 'downed', 'chapterIdB'),chapterIdC = get_loc_val(memberId + 'downed', 'chapterIdC'), progress = get_loc_val(memberId + 'downed', 'progress');
        var id='';
        //一级章节下载记录
        if(!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)){
            id=chapterIdA;
        }
        //二级章节下载记录
        if(!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)){
            id=chapterIdB;
        }
        //三级章节下载记录
        if(!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)){
            id=chapterIdC;
        }
        if (progress == 100) {
            $("#" + id).attr({
                'type' : 4
            });
        } else {
            $("#" + id).attr({
                'type' : 1
            });
        }
    }else{
        $('.down-progress[type="1"]').attr({
            type : 2
        });
    }
}
function to_cache(name) {
	name = 'video-buffer';
	api.openWin({
		name : name,
		url : name + '.html',
		delay : 200,
		reload : true,
		pageParam : {
			course_id : api.pageParam.course_id
		}
	});
}
var memberId;
function set_down_status(str){
    //var data=JSON.parse(str);
    var data=str;
    var type = data.type, chapterIdA = isEmpty(data.chapterIdA) ? '' : data.chapterIdA ,chapterIdB = isEmpty(data.chapterIdB) ? '' : data.chapterIdB,chapterIdC = isEmpty(data.chapterIdC) ? '' : data.chapterIdC;
    var id='';
    //一级章节下载记录
    if(!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) id=chapterIdA;
    //二级章节下载记录
    if(!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) id=chapterIdB;
    //三级章节下载记录
    if(!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) id=chapterIdC;
    var obj = $('#' + id);
    switch (type) {
        case 'error':
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '下载失败！',
                location : 'middle'
            });
            break;
        case 'redown':
            $('.down-progress[type="1"]').attr({
                type :  3
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '下载失败！',
                location : 'middle'
            });
            break;
        case 'filedel':
            $(obj).attr({
                type : 2
            });
            var num = $api.getStorage(memberId + id + 'progress');
            $(obj).find('.val').text(num);
            var _w = $('#svgDown').width();
            var percent = num / 100, perimeter = Math.PI * _w * 0.9;
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            api.alert({
                msg : '缓存文件被清理,请重新下载',
                location : 'middle'
            });
            break;
        case 'no_video':
            api.toast({
                msg : '无视频任务',
                location : 'middle'
            });
            break;
        case 'less_space':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 2
            });
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '可用空间不足,下载已暂停',
                location : 'middle'
            });
            break;
        case 'not_wifi':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 2
            });
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '脱离WiFi环境自动暂停下载',
                location : 'middle'
            });
            break;
        case 'deny_down':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 2
            });
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '当前正在移动网络，请在WIFI环境中下载',
                location : 'middle'
            });
            break;
        case 'shut_network':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 2
            });
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '网络已断开，请检查网络状态',
                location : 'middle'
            });
            break;
        case 'wait':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                'type' : 2
            }).siblings('.down_speed').html('').addClass('none');
            break;
        case '1':
        case 1:
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            //下载中->暂停
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            $(obj).attr({
                'type' : 2
            });
            break;
        case '2':
        case 2:
            //暂停->下载中
            $('.down-progress[type="1"]').attr({
                type : 2
            });
            $('.down_speed').html('').addClass('none');
            $(obj).attr({
                type : 1
            });
            break;
        case '3':
        case 3:
            $('.down-progress[type="1"]').attr({
                type : 2
            });
            break;
        case 'ing':
            $('.down-progress[type="1"]').attr({
                type : 2
            });
            $(obj).attr({
                type : 1
            });
            break;
        case 'progress':
            $.each($('.down_speed'),function(k,v){
                if($(v).siblings('.down-progress').attr('id')!=id){
                    $(v).html('').addClass('none');
                }
            });
            $(obj).attr({
                type : 1
            });
            var percent = data.progress / 100, perimeter = Math.PI * 0.9 * $('#svgDown').width();
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            if (data.progress >= 100) {
                $(obj).attr({
                    type : 4
                }).siblings('.down_speed').html('').addClass('none');
            }

            $('.space').html("可用空间" + data.size + "MB<span></span>");
            $(obj).find('.val').text(data.progress);

            break;
        case 'end':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 4
            }).siblings('.down_speed').html('').addClass('none');
            break;
    }
}

apiready = function() {

    // api.addEventListener({
    //     name : 'DOWN'
    // }, function(ret) {
    //    api.toast({
    //        msg:JSON.stringify(ret.value),
    //        location:'middle'
    //    })
    // });

     memberId = getstor('memberId');
	getData();
	api.addEventListener({
		name : 'flush_catalog'
	}, function(ret) {
		getData();
	});
    api.addEventListener({
        name : 'down_speed'
    }, function(ret) {
        if(ret){
            var speed=ret.value.speed;
            //初始化下载状态
            var downed = $api.getStorage(memberId+'downed');

            // api.toast({
            //     msg:downed
            // })
            //api.alert({msg:downed});
            var chapterIdA = get_loc_val(memberId + 'downed', 'chapterIdA'),chapterIdB = get_loc_val(memberId + 'downed', 'chapterIdB'),chapterIdC = get_loc_val(memberId + 'downed', 'chapterIdC'), progress = get_loc_val(memberId + 'downed', 'progress');
            var id='';
            //一级章节下载记录
            if(!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)){
                id=chapterIdA;
            }
            //二级章节下载记录
            if(!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)){
                id=chapterIdB;
            }
            //三级章节下载记录
            if(!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)){
                id=chapterIdC;
            }
            //$('.down-progress').siblings('.down_speed').html('').addClass('none');
            $('#'+id).siblings('.down_speed').html(speed).removeClass('none');
        }
    });
};
