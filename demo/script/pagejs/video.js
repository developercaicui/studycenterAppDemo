/*video页面js*/
var courseId;//课程id
var course_detail;//章节课程信息
//var study_progress;//当前的进度
var chapter_info;//当前章节详情信息
var task_info = '';//当前任务信息
var courseName;//播放器标题(只显示课程的标题，不显示章节和任务标题)
var chapterName;//播放器标题(只显示课程的标题，不显示章节和任务标题)
var videoid;//播放视频id
var videoTimes;//视频时间长度
var demo;//视频模块
var task_arr;//所有的任务信息
var task_info_detail;
var last_progress = 0;
function  closeVideo() {
    demo.close();
}
apiready = function() {

    api.setScreenOrientation({
        orientation : 'auto_landscape'
    });

    api.addEventListener({
        name : 'closeVideo'
    }, function(ret) {
        closeVideo();
    });
    

    is_check=false;
	api.closeWin({
		name : 'course-test'
	});
	$('body').css('background', '#21292b');
	//获取参数
	courseId = api.pageParam.courseId;//课程id
	course_detail = api.pageParam.course_detail;//课程详情
	courseName = course_detail.courseName;//课程名字
	//study_progress = api.pageParam.study_progress;//当前的进度

	task_info = api.pageParam.task_info;//任务信息
	videoid = task_info.videoCcid;
	videoTimes = task_info.videoTime;
    if(!isEmpty(api.pageParam.last_progress)){
        last_progress = api.pageParam.last_progress;
    }
    task_arr = save_tasks(course_detail);

    task_info_detail = task_arr[task_info.taskId];
	//获取章节信息
	//getChapterInfo();

	if (isEmpty(task_info) || task_info.taskType != 'video') {
		api.alert({
			title : '温馨提示',
			msg : '数据异常，请返回重试',
			buttons : ['返回']
		}, function(ret, err) {
			if (ret.buttonIndex == 1) {
				api.setStatusBarStyle({
					style : 'dark'
				});
				api.closeWin();
				//课程结束，关闭页面
			}
		});
		return false;
	}

	//设置ios状态栏背景色
	if (api.systemType == 'ios') {
		api.setStatusBarStyle({
			style : 'light'
		});
	}
	demo = api.require('lbbVideo');
	//监听切换视频事件
	api.addEventListener({
		name : 'change_video'
	}, function(ret) {
		if (ret && ret.value) {
			/*
            study_progress = ret.value.study_progress;
			study_progress.progress = 0;//新任务从0开始
			task_info = ret.value.task_info;
			videoid = task_info.videoCcid;
			videoTimes = task_info.videoTime;
			//更新章节信息
			//getChapterInfo();
            */
            lastVtime = 0;//新任务从0开始
            var task_id = ret.value.taskId;
            task_info = task_arr[task_id].taskInfo;
            task_info_detail = task_arr[task_id];
            videoid = task_info.videoCcid;
            videoTimes = task_info.videoTime;
			if (api.systemType == 'android') {
				demo.close();
			}
			play_video();
		}
	});

	//监听继续播放事件
	api.addEventListener({
		name : 'continue_video'
	}, function(ret) {
		if (ret && ret.value) {
			demo.start();
			//var times = ret.value.times;
			//if (times > 20) {
			//	times = times - 20;
			//} else {
			//	times = 0;
			//}
			//if (api.systemType == 'android') {
			//	times = times * 1000;
			//	demo.seekTo({
			//		totime : times
			//	}, function() {
			//		demo.start();
			//	});
			//} else {
			//	demo.start();
			//}
		}
	});

	//监听返回键
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		closeThisWin(0);
		//关闭页面
	});
	//监听关闭视频
	api.addEventListener({
		name : 'close_video_demo'
	}, function(ret, err) {
		if (api.systemType == 'android') {
			demo.close();
		}else{
			demo.close();
		}
	});

	//播放视频
	play_video();

    api.addEventListener({
        name : 'lbbpause'
    }, function(ret) {
        demo.stop();
    });
    api.addEventListener({
        name : 'lbbresume'
    }, function(ret) {   
        demo.start({type:1});
    });

};

//根据进度索引,获取章节信息
/*
function getChapterInfo(){
	if (study_progress.chapterDeep >= 0) {
		var res = course_detail.chapters[study_progress.oneChapterIndex];
	}
	if (study_progress.chapterDeep >= 1) {
		var res = res.children[study_progress.twoChapterIndex];
	}
	if (study_progress.chapterDeep >= 2) {
		var res = res.children[study_progress.threeChapterIndex];
	}
	chapter_info = res;
	chapterName = chapter_info.chapterTitle;
}
*/
var is_check=false;
function check_net(videoid){
    //if(isEmpty($api.getStorage('cache'+videoid)) && (isEmpty($api.getStorage(videoid)) || $api.getStorage(videoid)!='YES')){
    if((isEmpty($api.getStorage(videoid)) || $api.getStorage(videoid)!='YES')){
        if(api.connectionType=='unknown' || api.connectionType=='none'){
            is_check=true;
            api.alert({
                msg : '网络已断开，请检查网络状态'
            });
        }else if(api.connectionType=='2g' || api.connectionType=='3g' || api.connectionType=='4g' || api.connectionType=='2G' || api.connectionType=='3G' || api.connectionType=='4G'){
            is_check=true;
            api.alert({
                msg : '正处于移动网络，会产生大量流量费用。请注意！'
            });
        }else{
            is_check=false;
        }
    }else{
        is_check=false
    }
}
//播放视频函数
function play_video() {

    getCCconfig(function(CCconfig){
        if(CCconfig){
            var UserId=task_info.videoSiteId;
            if(api.systemType == 'android'){
                api.setFullScreen({
                    fullScreen:true
                });
            }
            if(last_progress==0){
                last_progress=getVideoProgress(videoid);
            }
            //alert(task_info.apiKey+'===='+UserId+'====='+(isEmpty(CCconfig[UserId]) ? 0 : 1));
            //用户学习进度
            var param = {
                //title : courseName.substring(0,40),
                //title : chapterName.substring(0,40),
                title : task_info_detail.chapterName.substring(0,40),
                videoId : videoid,
                totime : last_progress,
                apiKey : task_info.apiKey,
                UserId : UserId,
                isEncryption:isEmpty(CCconfig[UserId]) ? 0 : 1
            };
            param.isFinish=!isEmpty($api.getStorage(param.videoId))&&$api.getStorage(param.videoId)=='YES' ? true : false;

            param.definition=isEmpty($api.getStorage('Video_quilty')) ||  $api.getStorage('Video_quilty')==1 ? 1  : 2;

            if(!is_check){
                check_net(videoid);
            }



            if(!CourseIsexpire(courseId)){
                api.alert({
                    title : '温馨提示',
                    msg : '该课程已过期',
                    buttons : ['返回']
                }, function(ret, err) {
                    if (ret.buttonIndex == 1) {
                        closeThisWin(0);
                    }
                });
                return false;
            }
            demo.open(param, function(ret, err) {

                $api.rmStorage('saveTaskProgress');
                if(ret.status=='filedel'){
                  if(!isEmpty($api.getStorage('cache'+videoid))){
                        var cache_ccid=$api.getStorage('cache'+videoid);
                        var res=cache_ccid[videoid];
                        var chapterIdA= isEmpty(res['chapterIdA']) ? '' :  res['chapterIdA'];
                        var chapterIdB= isEmpty(res['chapterIdB']) ? '' :  res['chapterIdB'];
                        var chapterIdC= isEmpty(res['chapterIdC']) ? '' :  res['chapterIdC'];
                        //删除下载进度
                          var sel = '';
                          if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                              sel = chapterIdA;
                          }
                          if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                              sel = chapterIdB;
                          }
                          if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                              sel = chapterIdC;
                          }
                          var memberId = getstor('memberId');
                          var key = memberId + sel + 'progress';
                          $api.setStorage(key,1);
                          $api.setStorage(videoid,'NO');
                            //改变下载状态
                            var data = {
                              type : 'filedel',
                              chapterida : chapterIdA,
                              chapteridb : chapterIdB,
                              chapteric : chapterIdC
                          };
                          set_down(data);
                  }
                    return false;
                }
                if (ret.btnType == 1) {
                    //demo.close();
                    //关闭页面
                    //api.closeWin();

                    if (ret.ctime == 'nan') {
                        //视频未加载完毕,视频进度为0
                        var tmp_progress = 0;
                    } else {
                        if (api.systemType == 'android') {
                            var tmp_progress = parseInt(ret.ctime / 1000);
                        } else {
                            var tmp_progress = parseInt(ret.ctime);
                        }
                    }
                    //关闭页面
                    closeThisWin(tmp_progress);

                } else if (ret.btnType == 2) {
                    //点击右上角按钮,保存进度,并打开横屏的章节页面
                    demo.stop(function(res) {
                        if (res.ctime == 'nan' || res.ctime==0) {
                            api.toast({
                                msg : '请等待视频加载完'
                            });
                        }else{
                            if (api.systemType == 'android') {
                                var tmp_progress = parseInt(res.ctime / 1000);
                            } else {
                                var tmp_progress = parseInt(res.ctime);
                            }
                            var total = task_info.videoTime;
                            if (total * 0.9 <= tmp_progress) {
                                var state = 'complate';
                            } else {
                                var state = 'init';
                            }
                            saveTaskProgress(tmp_progress, total, state);
                            api.openFrame({
                                name : 'video-menu',
                                url : 'video-menu.html',
                                delay : 200,
                                reload : true,
                                pageParam : {
                                    courseId : courseId,//课程id
                                    course_detail : course_detail,//课程详情
                                    times : tmp_progress,//观看时间进度
                                    //study_progress : study_progress,//任务学习的进度
                                    task_info : task_info,//章节信息
                                    from_page : 'video'
                                },
                                bgColor : 'rgba(0,0,0,0)'
                            });
                        }
                    });
                } else if (ret.btnType == 3) {
                    is_check=false;
                    //播放上一个视频
                    demo.stop(function(res) {
                        //保存任务进度
                        if (res.ctime == 'nan' || res.ctime==0) {
                            api.toast({
                                msg : '请等待视频加载完'
                            });
                        }
                        else{
                            if (api.systemType == 'android') {
                                var tmp_progress = parseInt(res.ctime / 1000);
                            } else {
                                var tmp_progress = parseInt(res.ctime);
                            }
                            var total = videoTimes;
                            if (total * 0.9 <= tmp_progress) {
                                var state = 'complate';
                            } else {
                                var state = 'init';
                            }
                            saveTaskProgress(tmp_progress, total, state);
                            //播放上一个视频
                            prevVideo();
                        }
                    })
                } else if (ret.btnType == 4) {
                    is_check=false;
                    //播放下一个视频
                    demo.stop(function(res) {
                        //保存任务进度
                        if (res.ctime == 'nan' || res.ctime==0) {
                            api.toast({
                                msg : '请等待视频加载完'
                            });

                        }
                        else{
                            if (api.systemType == 'android') {
                                var tmp_progress = parseInt(res.ctime / 1000);
                            } else {
                                var tmp_progress = parseInt(res.ctime);
                            }
                            var total = videoTimes;
                            if (total * 0.9 <= tmp_progress) {
                                var state = 'complate';
                            } else {
                                var state = 'init';
                            }
                            saveTaskProgress(tmp_progress, total, state);
                            nextVideo();
                        }
                    });
                } else if (ret.btnType == 5) {
                    //alert("倍率");
                } else if (ret.btnType == 6) {
                    alert("声音");
                } else if (ret.btnType == 7) {
                    //暂停视频,打开横屏的创建笔记页面
                    demo.stop(function(res) {
                        if (res.ctime == 'nan' || res.ctime==0) {
                            api.toast({
                                msg : '请等待视频加载完'
                            });
                        } else {
                            if (api.systemType == 'android') {
                                var tmp_progress = parseInt(res.ctime / 1000);
                            } else {
                                var tmp_progress = parseInt(res.ctime);
                            }
                            var total = task_info.videoTime;
                            if (total * 0.9 <= tmp_progress) {
                                var state = 'complate';
                            } else {
                                var state = 'init';
                            }
                            saveTaskProgress(tmp_progress, total, state);
                            api.openWin({
                                name : 'create-notes',
                                url : 'create-notes.html',
                                delay : 200,
                                pageParam : {
                                    //下个页面要用到的一些参数
                                    courseId : courseId,//课程id
                                    course_detail : course_detail,//课程详情
                                    progress : tmp_progress,//观看时间进度
                                    //study_progress : study_progress,//任务学习的进度
                                    from_page : 'video',
                                    task_info : task_info,
                                    task_info_detail : task_info_detail
                                    //chapter_info : chapter_info
                                }
                            });
                        }
                    });
                } else if (ret.btnType == 8) {
                    //暂停视频,打开横屏的创建提问页面
                    demo.stop(function(res) {
                        if (res.ctime == 'nan' || res.ctime==0) {
                            api.toast({
                                msg : '请等待视频加载完'
                            });
                        } else {
                            if (api.systemType == 'android') {
                                var tmp_progress = parseInt(res.ctime / 1000);
                            } else {
                                var tmp_progress = parseInt(res.ctime);
                            }
                            var total = videoTimes;
                            if (total * 0.9 <= tmp_progress) {
                                var state = 'complate';
                            } else {
                                var state = 'init';
                            }
                            saveTaskProgress(tmp_progress, total, state);
                            api.openWin({
                                name : 'create-question',
                                url : 'create-question.html',
                                delay : 200,
                                pageParam : {
                                    //下个页面要用到的一些参数
                                    courseId : courseId,//课程id
                                    course_detail : course_detail,//课程详情
                                    progress : tmp_progress,//观看时间进度
                                    //study_progress : study_progress,//任务学习的进度
                                    from_page : 'video',
                                    task_info : task_info,
                                    task_info_detail : task_info_detail
                                    //chapter_info : chapter_info
                                }
                            });
                        }
                    });
                } else if (ret.btnType == 9) {
                    //用户点击讲义按钮
                    if (isEmpty(task_info.attachmentPath)) {
                        demo.stop(function(res){});
                        api.toast({
                            msg : '该视频没有讲义'
                        });
                    } else {
                        //暂停视频
                        demo.stop(function(res) {
                            if (res.ctime == 'nan' || res.ctime==0) {
                                var tmp_progress = 0;
                            } else {
                                if (api.systemType == 'android') {
                                    var tmp_progress = parseInt(res.ctime / 1000);
                                } else {
                                    var tmp_progress = parseInt(res.ctime);
                                }
                                var total = videoTimes;
                                if (total * 0.9 <= tmp_progress) {
                                    var state = 'complate';
                                } else {
                                    var state = 'init';
                                }
                                saveTaskProgress(tmp_progress, total, state);
                                api.showProgress({
                                    title : "加载中",
                                    modal : false
                                });
                                //打开讲义，使用api模块查看pdf
                                var pdf_url = static_url + task_info.attachmentPath;
                                var url_arr = pdf_url.split("/");
                                for (var i in url_arr) {
                                    url_arr[i] = encodeURI(url_arr[i]);
                                }
                                var new_url = url_arr.join("/");
                                //api.alert({msg:new_url});return;
                                api.download({
                                    //url: static_url+task_info.attachmentPath,
                                    url : new_url,
                                    //savePath: 'fs://caicui/pdf/',//（可选项）存储路径，不传时使用自动创建的路径
                                    report : true, //（可选项）下载过程是否上报
                                    cache : false, //（可选项）是否使用本地缓存
                                    allowResume : true//（可选项）是否允许断点续传
                                }, function(ret, err) {
                                    if (err) {
                                        api.toast({
                                            msg : err.msg
                                        });
                                        demo.start();
                                        api.hideProgress();
                                    } else if (ret) {
                                        //var value = ('文件大小：' + ret.fileSize + '；下载进度：' + ret.percent + '；下载状态' + ret.state + '存储路径: ' + ret.savePath);
                                        if (ret.percent == 100) {
                                            api.hideProgress();
                                            var obj = api.require('pdfReader');
                                            obj.open({
                                                path : ret.savePath
                                            });
                                        }
                                    }
                                });
                            }
                        })
                    }
                } else if (ret.btnType == 10) {
                    var ctime=ret.ctime;
                    if (api.systemType == 'android') {
                        var tmp_progress = parseInt(ctime / 1000);
                    } else {
                        var tmp_progress = parseInt(ctime);
                    }
                    var total = videoTimes;
                    if (total * 0.9 <= tmp_progress) {
                        var state = 'complate';
                    } else {
                        var state = 'init';
                    }
                    saveTaskProgress(tmp_progress, total, state);
                   // nextVideo();
                } else if (ret.btnType == 100){
                    /*(var ctime=ret.ctime;
                    if (api.systemType == 'android') {
                        var tmp_progress = parseInt(ctime / 1000);
                    } else {
                        var tmp_progress = parseInt(ctime);
                    }
                    var total = videoTimes;
                    if (total * 0.9 <= tmp_progress) {
                        var state = 'complate';
                    } else {
                        var state = 'init';
                    }
                    saveTaskProgress(tmp_progress, total, state);*/
                    is_check=false;
                    if(last_progress>0){
                        var jumptime;
                        if (api.systemType == 'android') {
                            jumptime =last_progress * 1000;
                        }else{
                            jumptime =last_progress;
                        }
                        demo.seekTo({
                            totime : jumptime
                        }, function() {
                        });
                    }
                } else if(ret.btnType == '-1' || ret.btnType== -1 || ret.btnType=='play') {
                    //暂停视频
                    var ctime=ret.ctime;
                    if (api.systemType == 'android') {
                        var tmp_progress = parseInt(ctime / 1000);
                    } else {
                        var tmp_progress = parseInt(ctime);
                    }
                    var total = videoTimes;
                    if (total * 0.9 <= tmp_progress) {
                        var state = 'complate';
                    } else {
                        var state = 'init';
                    }
                    saveTaskProgress(tmp_progress, total, state);
                }
            });
        }
    });
}

//播放下一集
//function nextVideo(index_arr,chapdeep) {
function nextVideo() {
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


//播放上一集
//function prevVideo(index_arr,chapdeep,isTrue) {
function prevVideo() {
    var tmp_data;
    var tmp_detail;
    var is_find = false;
    for(var i in task_arr){
        if(i==task_info.taskId){
            if(!isEmpty(tmp_data) && !isEmpty(tmp_detail)){
                task_info = tmp_data;
                task_info_detail = tmp_detail;
                exeNewTask();//执行新任务
                is_find = true;
            }
            break;
        }else{
            tmp_data = task_arr[i].taskInfo;
            tmp_detail = task_arr[i];
        }
    }
    if(!is_find){
        api.toast({
            msg : '没有上一个任务啦',
            location : 'middle'
        });
    }
}
//执行新任务
function exeNewTask() {
	//如果任务类型为视频，则直接播放
	if (task_info.taskType == 'video') {
		videoid = task_info.videoCcid;
		videoTimes = task_info.videoTime;
        
		if (api.systemType == 'android') {
			demo.close();
		}

		play_video();
        
	} else {
		//要传递到下个页面的参数
		var page_param = {
			courseId : courseId, //课程id
			course_detail : course_detail, //课程详情
			//study_progress : study_progress,
            last_progress : 0,
			task_info : task_info, //任务信息
			type : 'task'
		};
		api.openWin({
			name : 'course-test',
			url : 'course-test.html',
			reload : true,
			pageParam : page_param,
			delay : 200
		});
		api.closeWin({
			animation : {
				type : 'flip',
				subType : 'from_left',
				duration : 500
			}
		});
	}
}



//关闭当前页面，返回课程页面
function closeThisWin(playtime) {
	//保存进度,关闭页面
    if(api.systemType == 'android'){
        api.setFullScreen({
            fullScreen:false
        });
    }
    var total = videoTimes;
	if (!isEmpty(playtime)) {

		if (total * 0.9 <= playtime) {
			var state = 'complate';
		} else {
			var state = 'init';
		}
		saveTaskProgress(playtime, total, state);
	} else {
        saveTaskProgress(0, total, state);
		if (api.systemType == 'android') {
			demo.close();
		}else{
            demo.close();
        }
	}


        //横屏切换到竖屏
        api.setScreenOrientation({
            orientation : 'portrait_up'
        });
        //设置ios状态栏
        if ($api.getStorage('ios_style')) {
            api.setStatusBarStyle({
                style : 'dark'
            });
        } else {
            api.setStatusBarStyle({
                style : 'light'
            });
        }
        $api.rmStorage('ios_style');
        //关闭横屏的窗口页面
        api.closeWin({
            name : 'course-test'
        });
        api.closeWin();
}

function saveTaskProgress(now_progress, total, state){
    var data={
        now_progress:now_progress,
        total:total,
        state:state,
        task_info:task_info,
        task_info_detail:task_info_detail,
        course_detail:course_detail
    };
    saveVideoProgress(videoid,now_progress);
    $api.setStorage('saveTaskProgress',data);
    var jsfun = "DosaveTaskProgress();";
    api.execScript({
        name: 'root',
        script: jsfun
    });
}
function saveVideoProgress(videoid,progress){
        var memberId= getstor('memberId');
        var key = memberId+"progress"+videoid;
        $api.setStorage(key,progress);
}
function getVideoProgress(videoid){
        var memberId= getstor('memberId');
        var key = memberId+"progress"+videoid;
        var progress = $api.getStorage(key);
        if(progress){
                progress = parseInt(progress)
                if(progress>10){
                        progress -=10;
                }else{
                        progress =0;
                }
                return progress;
        }
        return 0;
}