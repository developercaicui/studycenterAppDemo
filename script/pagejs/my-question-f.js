function detail(obj, taskId, courseId, memberId,taskType,taskprogress) {
	courseId = isEmpty(courseId) || courseId == undefined || courseId == 'undefined' ? '课程id' : courseId;
	taskId = isEmpty(taskId) || taskId == undefined || taskId == 'undefined' ? '' : taskId;
    taskType = isEmpty(taskType) || taskType == undefined || taskType == 'undefined' ? '' : taskType;
    taskprogress = isEmpty(taskprogress) || taskprogress == undefined || taskprogress == 'undefined' ? 0 : taskprogress;
	api.openWin({
		name : 'question-detail-head',
		url : 'question-detail-head.html',
		delay : 200,
		pageParam : {
			id : obj,//问题id
			taskId : taskId,
			courseId : courseId,
			memberId : memberId,
            taskType:taskType,
            taskprogress:taskprogress,
			qf : 'question-detail'
		}
	});
}

function lx(obj) {
	var courseId = $(obj).attr('courseId');
	var chapterId = $(obj).attr('chapterId');
	var taskId =  isEmpty($(obj).attr('taskId')) ? '任务id' : $(obj).attr('taskId');
    var taskprogress = isEmpty($(obj).attr('taskprogress')) ? 0 : $(obj).attr('taskprogress');
	var taskType = $(obj).attr('taskType');
	if (isEmpty(courseId) || isEmpty(chapterId) || isEmpty(taskId)) {
		return false;
	} else {
		//如果没有缓存信息，就从接口获取
		var tmp_course_detail = $api.getStorage(courseId);
		if (isEmpty(tmp_course_detail)) {
			//获取课程的详细信息
			//api/v2.1/course/courseDetail，接口编号：004-006
			ajaxRequest('api/v2.1/course/courseDetail', 'get', {
				courseId : courseId
			}, function(ret, err) {//004.006获取课程的详细信息
				if (err) {
					api.hideProgress();
					api.toast({
						msg : err.msg,
						location : 'middle'
					});
					return false;
				}
				if (ret && ret.state == 'success') {
					var course_detail = ret.data[0];
					//课程详情数据
					$api.setStorage(courseId, course_detail);
					var res_process = findTask(course_detail, chapterId, taskId);
					//用户上次学习进度数据
					judge_task(res_process, course_detail, taskprogress);
					//跳转页面
				}
			});
		} else {
			var course_detail = tmp_course_detail;
			//存储课程详细信息
			var res_process = findTask(course_detail, chapterId, taskId);
			//用户上次学习进度数据
			judge_task(res_process, course_detail, taskprogress);
			//跳转页面
		}
	}

}

var pageNum = 10;
var is_loding=false;
function getData(page) {
	var param = {};
	param.self = 1;
	param.ordertype = 1;
	param.pageNo = page;
	param.pageSize = pageNum;
	param.token = $api.getStorage('token');
	if(page==1 && show_pro && !is_loding){
	    api.showProgress({
	        title : '加载中',
	        modal : false
	    });
	}
	ajaxRequest('api/studytools/questionlist/v2.1', 'get', param, function(ret, err) {//003.206 问题列表
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
			total = ret.totalCount;
			if (page == 1) {
				if (isEmpty(ret.data)) {
					$('#content').html('');
					$('body').addClass('null');
					return false;
				}
				$('body').removeClass('null');
				$('#content').html(content(ret.data));
			} else {
				$('#content').append(content(ret.data));
			}
			api.parseTapmode();
		} else {
			api.toast({
				msg : ret.msg,
				location : 'middle'
			});
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
		if (currentPage < Math.ceil(total / pageNum)) {
			currentPage++;
			getData(currentPage);
		} else {
			api.toast({
				msg : '加载完成！!'
			});
		}
	});
	api.addEventListener({
		name : 'new-question-f'
	}, function(ret) {
		getData(1);
	});

	api.addEventListener({
		name : 'my-question-lx'
	}, function(ret) {
		getData(1);
	});
};

//找出任务进度
function findTask(course_detail, chapterId, taskId) {
	var chapters_num = 0;
	//一级章节索引
	var chapters_child_num = 0;
	//二级章节索引
	var child_task_num = 0;
	//任务索引
	var tmp_chapterId = chapterId;
	//二级章节id
	var tmp_taskId = taskId;
	//任务id
	for (var i in course_detail.chapters) {
		var first_charpter_info = course_detail.chapters[i];
		//循环获取一级章节信息
		for (var j in first_charpter_info.children) {
			var second_charpter_info = first_charpter_info.children[j];
			//循环获取二级章节信息
			if (second_charpter_info.chapterId == tmp_chapterId) {
				var tasks = second_charpter_info.tasks;
				for (var k in tasks) {
					if (tasks[k].taskId == tmp_taskId) {
						return {
							chapters_num : i,
							chapters_child_num : j,
							child_task_num : k
						};
					}
				}
			}
		}
	}
	return {
		chapters_num : chapters_num,
		chapters_child_num : chapters_child_num,
		child_task_num : child_task_num
	};
}

//判断任务类型，跳转相应的页面
function judge_task(res_process, course_detail, last_progress) {
	if (isEmpty(course_detail) || isEmpty(course_detail.chapters)) {
		api.toast({
			msg : '获取课程和章节失败',
			location : 'middle'
		});
		return false;
	}
	if (isEmpty(res_process)) {
		res_process = {
			chapters_num : 0,
			chapters_child_num : 0,
			child_task_num : 0
		};
	}
	var chapters_info = course_detail.chapters[res_process.chapters_num];
	//当前一级章节信息
	if (isEmpty(chapters_info.children)) {
		api.toast({
			msg : '获取当前一级章节失败',
			location : 'middle'
		});
		return false;
	}
	var chapters_child_info = chapters_info.children[res_process.chapters_child_num];
	if (isEmpty(chapters_child_info.tasks)) {
		return false;
	}
	//当前二级章节信息
	var task_info = chapters_child_info.tasks[res_process.child_task_num];
	//当前任务信息
	//判断当前任务类型
	if (task_info.taskType == 'video') {
		//视频类型
		var new_win_name = 'video';
		var new_win_url = 'video.html';
	} else if (task_info.taskType == 'entry' || task_info.taskType == 'pdfread' || task_info.taskType == 'exam') {
		//entry（外链类型）、pdfread（pdf类型）、exam（测试题类型）
		var new_win_name = 'course-test';
		var new_win_url = 'course-test.html';
	} else {
		api.toast({
			msg : '课程任务异常，请稍后再试或联系客服',
			location : 'middle'
		});
		return false;
	}
	//需要传递的参数
	var pageParams = {
		from : 'my-question',
		last_progress : last_progress, //上次的学习进度
		course_detail : course_detail, //课程详情
		chapters_num : res_process.chapters_num, //一级章节索引
		chapters_child_num : res_process.chapters_child_num, //二级章节索引
		child_task_num : res_process.child_task_num, //任务索引
		task_info : task_info, //当前要学习的任务信息
		type : 'task'
	};
	api.hideProgress();
	//设置屏幕向右翻转
	api.setScreenOrientation({
		orientation : 'landscape_right'
	});
	//跳转到横屏页面
	api.openWin({
		name : new_win_name,
		url : new_win_url,
		delay : 200,
		slidBackEnabled : false, //iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
		pageParam : pageParams
	});
}
