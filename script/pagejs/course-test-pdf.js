/*课程测试题页面js*/
document.documentElement.style.fontSize = (document.documentElement.clientWidth / 1280) * 100 + 'px';
//变量信息
var courseId;//课程id
var course_detail;//章节课程信息
var last_progress = 0;//当前的进度

var task_info = '';//当前任务信息
var task_info_detail;
var task_arr;//所有的任务信息
var swiper;



apiready = function() {
    //获取参数
    courseId = api.pageParam.courseId;//课程id
    course_detail = api.pageParam.course_detail;//课程详情
    courseName = course_detail.courseName;//课程名字
    if(!isEmpty(api.pageParam.last_progress)){
        last_progress = api.pageParam.last_progress;//当前的进度
    }

    task_info = api.pageParam.task_info;//任务信息
    //chapter_info = api.pageParam.chapter_info;//任务信息
    task_arr = save_tasks(course_detail);
    task_info_detail = api.pageParam.task_info_detail;


	//二级章节信息
	var pdf_tpl = $('#pdf_tpl').html();
	var content = doT.template(pdf_tpl);
	$('#pdf_content').html(content(task_info));
	api.parseTapmode();

	swiper = new Swiper('.swiper-container', {
		nextButton : '.swiper-button-next',
		prevButton : '.swiper-button-prev',
		spaceBetween : 30,
		pagination : '.swiper-pagination',
		paginationClickable : true,
		paginationBulletRender : function(index, className) {
			return '<span class="' + className + '">' + (index + 1) + '</span>';
		},
		onInit : function(swiper) {
			$('.swiper-pagination-bullet').eq(15).nextAll().hide();
		},
		onSlideChangeEnd : function(swiper) {
			var num = parseInt($('.swiper-pagination-bullet-active').text());
			if (num > 10) {
				$('.swiper-pagination-bullet').show().eq(num - 9).prevAll().hide();
				$('.swiper-pagination-bullet').eq(num + 5).nextAll().hide();
			}
			//切换测试题时保存学习进度
			var now_progress = parseInt(swiper.activeIndex) + 1;
			var total = swiper.slides.length;
			if (now_progress == total) {
				var state = 'complate';
				//任务已完成
			} else {
				var state = 'init';
				//任务未完成
			}
			saveTaskProgress(now_progress, total, state);
		}
	});
	//根据任务进度，判断默认从第几页开始
	if (!isEmpty(last_progress) && last_progress > 1) {
		var tmpSlide = last_progress;
		if (tmpSlide > 1) {
			swiper.slideTo(tmpSlide - 1, 1000, false);
		}
	}
};

//下个任务
function next_task() {
    var flag = false;
    var is_find = false;
    for(var i in task_arr){
        if(flag==true){
            if(!isEmpty(task_arr[i]) && !isEmpty(task_arr[i].taskInfo)){
                task_info = task_arr[i].taskInfo;
                task_info_detail = task_arr[i];
                exeNewTask();//执行新任务
                is_find = true;
            }
            break;
        }else{
            if(i==task_info.taskId){
                flag = true;
            }
        }
    }
    if(!is_find){
        api.toast({
            msg : '没有更多任务啦',
            location : 'middle'
        });
    }
}


//执行新任务
function exeNewTask() {
	//判断当前任务类型
	if (task_info.taskType == 'video') {
		//跳转到播放页面
		api.openWin({
			name : 'video',
			url : 'video.html',
			delay : 200,
			slidBackEnabled : false,
            reload : true,
			pageParam : {
				from : 'course-test',
				courseId : courseId,
				course_detail : course_detail,
                last_progress : 0,
				task_info : task_info
			}
		});
	}else{
		//如果为测试题的头部
		api.openWin({
			name : 'course-test',
			url : 'course-test.html',
			reload : true,
			pageParam : {
                name : 'video-exam',
                last_progress : 0,
                courseId : courseId,
                course_detail : course_detail,
                task_info : task_info,
                from : 'course-test'
			},
			delay : 200
		});
	}
}

//保存任务进度
function saveTaskProgress(now_progress, total, state) {
	var user_nickname = get_loc_val('mine', 'nickName');
	var user_token = $api.getStorage('token');
	var user_memberId = get_loc_val('mine', 'memberId');
	var post_param = {
		memberId : user_memberId, //必须，用户id	ff8080815065f95a01506627ad4c0007
		progress : now_progress, //必须，当前进度值，视频为秒，试卷为题数量，文档为页码	5
		taskId : task_info.taskId, //必须，任务id	1
		chapterId : task_info_detail.chapterId, //必须，章节id	chapterId
		courseId : course_detail.courseId, //必须，课程id	ff808081486933e6014889882d9c0590
		taskName : task_info.title, //必须，任务名称	taskName
		chapterName : task_info_detail.chapterName, //必须，章节名称	chapterName
		courseName : course_detail.courseName, //必须，课程名称	courseName
		total : total, //必须，任务总长度	48
		subjectId : course_detail.subjectId, //必须，科目id	ff808081473905e7014762542d940078
		categoryId : course_detail.categoryId, //必须，证书id	ff808081473905e701475cd3c2080001
		token : user_token, //必须，用户token	144594636417159iPhoneCourse
		memberName : user_nickname, //必须，用户昵称	zhangxiaoyu01
		state : state//必须，进度状态默认init，完成：complate	complate
	};
	ajaxRequest('api/v2.1/chapter/taskProgress', 'post', post_param, function(ret, err) {//008.024保存任务进度日志（new）tested
		if (ret && ret.state == 'success') {
			//$api.setStorage(user_nickname + 'self' + courseId, '');
			//清除整个课程结构的课程进度
			//$api.setStorage(user_nickname + 'last' + courseId, '');
			//清除上一次的进度
		}
	})
}

/*点击切换回到顶部*/
window.onload = function() {
	$('.swiper-button-next,.swiper-pagination-bullet,.swiper-button-prev').on('click', function() {
		$('body').scrollTop(0);
	});
}; 