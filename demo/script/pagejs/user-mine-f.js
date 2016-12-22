//时间值不够10的在数字前面补0函数
function addZero(value) {
	return parseInt(value) < 10 ? "0" + value : parseInt(value);
}

function setTime() {
	if (is_show_time == false) {
		return false;
	}
	var date = new Date(Date.now());
	var h = extra(date.getHours());
	var m = extra(date.getMinutes());
	var setTime = document.getElementById("setTime");
	api.openPicker({
		type : 'time',
		date : h + ':' + m,
		title : '选择时间'
	}, function(ret, err) {
		var hour = ret.hour;
		var minute = ret.minute;
		var newTimer = addZero(hour) + ":" + addZero(minute);
		setTime.innerHTML = newTimer;
		var val = isEmpty(newTimer) ? '19:30' : newTimer;
		$api.setStorage('notice_time', val);
		var notice = isEmpty($api.getStorage('open_notice')) ? 0 : $api.getStorage('open_notice');
		clearInterval(push_timer);
		if (notice == 1) {
			init_push();
		}
	});
}

function go_next(name) {
	var reload = true;
	if (name == 'video-buffer') {
		reload = true;
	}
	api.openWin({
		name : name,
		url : name + '.html',
		delay : 200,
		reload : reload
	});
}

function get_ranking() {
	var able = $api.getStorage('capabilityAssessment');
	able = '';
	if (!isEmpty(able)) {
		var ranking = able.ranking;
		$('.ranking').html(ranking).parents('p').removeClass('none');
		return false;
	}
	ajaxRequest('api/v2/capabilityAssessment', 'get', {//008.017  能力评估
		token : $api.getStorage('token'),
		id : get_loc_val('mine', 'memberId')
	}, function(ret, err) {
		if (err) {
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		if (ret.state == 'success') {
			$api.setStorage('capabilityAssessment', ret.data[0]);
			if (!isEmpty(ret.data[0]) && !isEmpty(ret.data[0].ranking)) {
				var ranking = ret.data[0].ranking;
				$('.ranking').html(ranking).parents('p').removeClass('none');
			}

		} else {
			//api.toast({
			//	msg : ret.msg,
			//	location : 'middle'
			//});
			//return false;
		}
	});
}

function get_count() {
	ajaxRequest('api/studytools/mycount/v2.1', 'get', {//003.304   学员信息统计
		token : $api.getStorage('token'),
		id : get_loc_val('mine', 'memberId')
	}, function(ret, err) {
		if (err) {
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		if (ret.state == 'success') {
			var nodeNum = ret.data.nodeNum;
			var questionNum = ret.data.questionNum;
			var discuss = ret.data.discuss;
			$('.nodeNum').html(nodeNum);
			$('.questionNum').html(questionNum);
			$('.discuss').html(discuss);
		} else {
			//			api.toast({
			//				msg : ret.msg,
			//				location : 'middle'
			//			});
			//			return false;
		}
	});
}

var is_show_time = true;
apiready = function() {
	api.addEventListener({
		name : 'modify'
	}, function(ret, err) {
		var nickName = get_loc_val('mine', 'nickName');
		var avatar = static_url + get_loc_val('mine', 'avatar') + '?s=' + Math.random();
		$('.nickName').html(nickName);
		$('.headimg').attr('src', avatar);
	});
	var notice_time = isEmpty($api.getStorage('notice_time')) ? "19:30" : $api.getStorage('notice_time');
	//学习提醒推送
	var notice = isEmpty($api.getStorage('open_notice')) ? 0 : $api.getStorage('open_notice');
	if (notice == 0) {
		$('.set-time').addClass('none');
		$('#setTime').text('');
		is_show_time = false;
		$('input[name=notice_time]').prop('checked', false);
	} else {
		$('.set-time').removeClass('none');
		$('#setTime').text(notice_time);
		is_show_time = true;
		$('input[name=notice_time]').prop('checked', true);
	}
	$('input[name=notice_time]').change(function() {
         notice_time = isEmpty($api.getStorage('notice_time')) ? "19:30" : $api.getStorage('notice_time');
		var open_notice;
		if ($(this).attr('checked') == true) {
			$('#setTime').text(notice_time);
			is_show_time = true;
			$('.set-time').removeClass('none');
			open_notice = 1;
			init_push();
		} else {
			$('#setTime').text('');
			clearInterval(push_timer);
			$('.set-time').addClass('none');
			is_show_time = false;
			open_notice = 0;
		}
		$api.setStorage('open_notice', open_notice);
	});
	if (!isEmpty($api.getStorage('center_num'))) {
		var num = $api.getStorage('center_num');
		if (num == 0) {
			$('.message-bells .msg-mark').addClass('none');
		} else {
			$('.message-bells .msg-mark').html(num);
		}

	} else {
		var param = {};
		param.pageNo = 0;
		param.pageSize = 1;
		param.typeId = '';
		param.isRead = 0;
		param.type = 1;
		param.token = $api.getStorage('token');
		ajaxRequest('api/v2/message/list', 'get', param, function(ret, err) {
<<<<<<< HEAD
=======
			var ret = {"totalCount":2,"pageNo":1,"pageSize":20,"state":"success","data":[{"sender":"系统","content":"<p>\r\n\t<p>\r\n\t\t同学们大家好，首先感谢您选择财萃网学习。\r\n\t</p>\r\n\t<p>\r\n\t\t为了可以及时准确解决你们提问的问题，请在学习中心提问时注意以下几点：\r\n\t</p>\r\n第一：提问时记得附带问题照片和题号，避免照片看不清楚；<br />\r\n第二：提问时如果是带有步骤的题目，请大家标注自己哪一部分不会还是整个题不会；<br />\r\n第三：大家尽量不要在助教老师已回答过的问题下继续提问，如果解释还没有听懂，重新提问附带照片和自己的见解，老师回答问题时一般都是点击没有回答的问题，已回答过的不再查看。\r\n</p>","id":"b15ffad1b09b11e6927800163e022e38","sentTime":1478587129,"title":"关于学习中心提问时注意事项","headImg":"","urlId":null,"textId":"013d3cd3a57e11e68a1f00163e022e38","senderId":"ff8080814833c067014843672bc0026a"},{"sender":"系统","content":"新增加&nbsp;1.考试出题形式讲解 2.模考题 3.考官文章讲解","id":"f31d3195690411e6a34f00163e022e38","sentTime":1471938046,"title":"针对2016年考纲F6课程串讲更新啦！小伙伴们重新下载讲义哦~","headImg":"","urlId":null,"textId":"e6fc18f9690411e6a34f00163e022e38","senderId":"ff8080814833c067014843672bc0026a"}],"msg":""}
			
>>>>>>> d10f40d6f70419e1c1626e3253a8bcada14a5f8b
			if (err) {
				api.toast({
					msg : err.msg,
					location : 'middle'
				});
				return false;
			}
			if (ret && ret.state == 'success') {
				if (ret.totalCount == 0) {
					$('.message-bells .msg-mark').addClass('none');
				} else {
					$('.message-bells .msg-mark').html(ret.totalCount);
				}
				$api.setStorage('center_num', ret.totalCount);
			} else {
				//api.toast({
				//	msg : ret.msg,
				//	location : 'middle'
				//});
			}
		});
	}
	//用户昵称和头像
	var nickName = get_loc_val('mine', 'nickName');
	var avatar = static_url + get_loc_val('mine', 'avatar');
	$('.nickName').html(nickName);
	$('.headimg').attr('src', avatar + '?s=' + Math.random());
	$('.user-info').removeClass('none');
	//财迷排名
	get_ranking();
	//学员信息统计
	get_count();
	//已读消息更新接听
	api.addEventListener({
		name : 'center_num'
	}, function(ret) {

		if ($api.getStorage('center_num') && $api.getStorage('center_num') != 0) {
			var num = $api.getStorage('center_num');
			$('.message-bells .msg-mark').html(num);
		} else {
			$('.message-bells .msg-mark').addClass('none');
		}

	});
	api.addEventListener({
		name : 'get_count'
	}, function(ret) {
		get_count();
	});
};

