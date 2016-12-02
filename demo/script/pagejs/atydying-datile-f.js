/**
 *视频缓存页面js
 */
//获取页面数据函数
function getData() {
	//api.showProgress({
	//    title: '加载中',
	//    modal: false
	//});
	var param = {};
	param.token = $api.getStorage('token');
	param.courseId = api.pageParam.courseId;
	ajaxRequest('api/v2.1/course/courseDetail', 'get', param, function(ret, err) {//004.006  章节目录和资料列表
		if (err) {
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		if (ret && ret.state == 'success') {
			var result = ret.data[0];
			var tpl = $('#tpl').html();
			var content = doT.template(tpl);
			$('#content').html(content(result.chapters));
		}
	});
}

function next(chapter1, chapter2) {
	var courseId = api.pageParam.courseId;
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
				//用户上次的学习进度
				var res_process = findTask(chapter1, chapter2, course_detail);
				judge_task(res_process, course_detail, 0);
			}
		});
	} else {
		var course_detail = tmp_course_detail;
		//存储课程详细信息
		var res_progress = findTask(chapter1, chapter2, course_detail);
		judge_task(res_process, course_detail, 0);
		//用户上次学习进度数据
	}
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
	//当前二级章节信息
	if (isEmpty(chapters_child_info.tasks)) {
		api.toast({
			msg : '获取当前二级章节失败',
			location : 'middle'
		});
		return false;
	}
	var task_info = chapters_child_info.tasks[res_process.child_task_num];
	//当前任务信息
	//判断当前任务类型
	if (isEmpty(task_info) || isEmpty(task_info.taskType)) {
		api.toast({
			msg : '无课程任务',
			location : 'middle'
		});
		return;
	}
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
		from : 'atydying-datile-f',
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

//获取上一次的学习进度
function getLastProgress(course_detail) {
	var courseId = course_detail.courseId;
	var tmpParam = {
		'token' : $api.getStorage('token'), //必须
		'memberId' : get_loc_val('mine', 'memberId'),
		'categoryId' : course_detail.categoryId, //非必须
		'subjectId' : course_detail.subjectId, //非必须
		'courseId' : courseId, //非必须
		'chapterId' : '', //非必须
		'taskId' : ''//非必须
	};
	//(实时)最后一次任务状态（new）tested,编号:008.026,GET - /api/v2.1/chapter/tasklastProgress
	ajaxRequest('api/v2.1/chapter/tasklastProgress', 'get', tmpParam, function(ret, err) {//008.026 最后一次任务状态（new）tested，接口编号：008-026
		if (err) {
			api.hideProgress();
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		if (ret && ret.state == 'success') {
			var study_progress = ret.data;
			var res_process = findTask(study_progress, course_detail);
			//根据进度和课程信息，找到要学习的任务
			if (isEmpty(res_process)) {
				return false;
			} else {
				judge_task(res_process, course_detail, study_progress);
			}
		}
	});
}

//找出任务进度
function findTask(cha1, cha2, course_detail) {
	var chapters_num = 0;
	//一级章节索引
	var chapters_child_num = 0;
	//二级章节索引
	var child_task_num = 0;
	//任务索引
	if (!isEmpty(study_progress)) {
		//二级章节id
		for (var i in course_detail.chapters) {
			var first_charpter_info = course_detail.chapters[i];
			if (first_charpter_info.chapterId == cha1) {
				//循环获取一级章节信息
				for (var j in first_charpter_info.children) {
					var second_charpter_info = first_charpter_info.children[j];
					//循环获取二级章节信息
					if (second_charpter_info.chapterId == cha2) {
						//继续执行该任务
						return {
							chapters_num : i,
							chapters_child_num : j,
							child_task_num : 0
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

apiready = function() {
	getData();
};

