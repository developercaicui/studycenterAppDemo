/*video-menu视频右侧章节列表页面js*/
document.documentElement.style.fontSize = (document.documentElement.clientWidth / 1280) * 100 + 'px';

//定义页面需要的变量
var now_nav_type = 1; //章节列表(type:1)、本章任务(type:2)、本章附件(type:3)、扩展阅读(type:4)
var course_detail; //课程详情
var courseId; //课程id
var study_progress; //当前的进度
var task_info = ''; //当前任务信息
var task_arr = ''; //所有任务信息
var task_info_detail;
var from_page = ''; //从哪个win打开的这个章节列表
var chapter_data = ''; //最后一级章节信息
var memberId;
var is_over_list = false; //章节列表是否已加载过，false未加载过，true已加载
var is_over_task = false; //本章任务是否已加载过，false未加载过，true已加载
var is_over_file = false; //本章附件是否已加载过，false未加载过，true已加载
var is_over_extend = false; //扩展阅读是否已加载过，false未加载过，true已加载

var tmpOne = 0; //临时一级章节索引
var tmpTwo = 0; //临时二级章节索引
var tmpThree = 0; //临时三级章节索引
var taskNum = 0; //临时任务索引
var tmpDeep = 0; //章节层级
function set_down_status(str) {
    //var data=JSON.parse(str);
    var data = str;
    var type = data.type,
        chapterIdA = isEmpty(data.chapterIdA) ? '' : data.chapterIdA,
        chapterIdB = isEmpty(data.chapterIdB) ? '' : data.chapterIdB,
        chapterIdC = isEmpty(data.chapterIdC) ? '' : data.chapterIdC;
    var id = '';
    if (type == 'wait') {
        setTimeout(function() {
            api.hideProgress();
        }, 1000);
    } else {
        api.hideProgress();
    }
    //一级章节下载记录
    if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) id = chapterIdA;
    //二级章节下载记录
    if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) id = chapterIdB;
    //三级章节下载记录
    if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) id = chapterIdC;
    var obj = $('#' + id);
    switch (type) {
        case 'error':
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '下载失败！',
                location: 'middle'
            });
            break;
        case 'redown':
            $('.down-progress[type="1"]').attr({
                type: 3
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '下载失败！',
                location: 'middle'
            });
            break;
        case 'filedel':
            $(obj).attr({
                type: 2
            });
            var _w = $('#svgDown').width();
            var percent = data.progress / 100,
                perimeter = Math.PI * _w * 0.9;
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            $(obj).find('.val').text(data.progress);
            api.alert({
                msg: '缓存文件被清理,请重新下载',
                location: 'middle'
            });
            break;
        case 'no_video':
            api.toast({
                msg: '无视频任务',
                location: 'middle'
            });
            break;
        case 'less_space':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 2
            });
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '可用空间不足,下载已暂停',
                location: 'middle'
            });
            break;
        case 'not_wifi':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 2
            });
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '脱离WiFi环境自动暂停下载',
                location: 'middle'
            });
            break;
        case 'deny_down':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 2
            });
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '当前正在移动网络，请在WIFI环境中下载',
                location: 'middle'
            });
            break;
        case 'shut_network':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 2
            });
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '网络已断开，请检查网络状态',
                location: 'middle'
            });
            break;
        case 'wait':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                'type': 2
            }).siblings('.down_speed').html('').addClass('none');
            break;
        case '1':
        case 1:
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            //下载中->暂停
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            $(obj).attr({
                'type': 2
            });
            break;
        case '2':
        case 2:
            //暂停->下载中
            $('.down-progress[type="1"]').attr({
                type: 2
            });
            $('.down_speed').html('').addClass('none');
            $(obj).attr({
                type: 1
            });
            break;
        case '3':
        case 3:
            $('.down-progress[type="1"]').attr({
                type: 2
            });
            break;
        case 'ing':
            $('.down-progress[type="1"]').attr({
                type: 2
            });
            $(obj).attr({
                type: 1
            });
            break;
        case 'progress':
            $.each($('.down_speed'), function(k, v) {
                if ($(v).siblings('.down-progress').attr('id') != id) {
                    $(v).html('').addClass('none');
                }
            });
            $(obj).attr({
                type: 1
            });
            var _w = $('#svgDown').width();
            var percent = data.progress / 100,
                perimeter = Math.PI * _w * 0.9;
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            if (data.progress >= 100) {
                $(obj).attr({
                    type: 4
                }).siblings('.down_speed').html('').addClass('none');
            }
            $(obj).find('.val').text(data.progress);
            break;
        case 'end':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 4
            }).siblings('.down_speed').html('').addClass('none');
            break;
    }
}
var pageName = 'video-menu';
apiready = function() {
    api.addEventListener({
        name: 'flush_cache'
    }, function(ret, err) {
        getChapterTask();
    });
    api.addEventListener({
        name: 'down_speed'
    }, function(ret) {
        if (ret) {
            var speed = ret.value.speed;
            //初始化下载状态
            var downed = $api.getStorage(memberId + 'downed');
            var chapterIdA = get_loc_val(memberId + 'downed', 'chapterIdA'),
                chapterIdB = get_loc_val(memberId + 'downed', 'chapterIdB'),
                chapterIdC = get_loc_val(memberId + 'downed', 'chapterIdC'),
                progress = get_loc_val(memberId + 'downed', 'progress');
            var id = '';
            //一级章节下载记录
            if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                id = chapterIdA;
            }
            //二级章节下载记录
            if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                id = chapterIdB;
            }
            //三级章节下载记录
            if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                id = chapterIdC;
            }
            //$('.down-progress').siblings('.down_speed').html('').addClass('none');
            $('#' + id).siblings('.down_speed').html(speed).removeClass('none');
        }
    });
    //获取参数
    course_detail = api.pageParam.course_detail; //课程详情
    courseId = course_detail.courseId; //课程id
    //study_progress = api.pageParam.study_progress;//当前的进度
    task_info = api.pageParam.task_info; //任务信息
    from_page = api.pageParam.from_page; //来自哪个win
    /*
    //取出章节层级
    if (isEmpty(study_progress.chapterDeep)) {
        study_progress.chapterDeep = 0;
    }
    if (study_progress.chapterDeep >= 0) {
        var res = course_detail.chapters[study_progress.oneChapterIndex];
        tmpOne = study_progress.oneChapterIndex;
    }
    if (study_progress.chapterDeep >= 1) {
        var res = res.children[study_progress.twoChapterIndex];
        tmpTwo = study_progress.twoChapterIndex;
    }
    if (study_progress.chapterDeep >= 2) {
        var res = res.children[study_progress.threeChapterIndex];
        tmpThree = study_progress.threeChapterIndex;
    }

    taskNum = study_progress.taskIndex;//临时任务索引
    tmpDeep = study_progress.chapterDeep;//章节层级

    chapter_data = res;
    */
    task_arr = save_tasks(course_detail);

    task_info_detail = task_arr[task_info.taskId];
    //展示本章任务信息
    getChapterTask();


};


//获取章节列表
function getChapterList() {
    if (is_over_list == false) {
        memberId = getstor('memberId');
        var tpl = $('#tpl').html();
        var content = doT.template(tpl);
        $('#chaList').html(content(course_detail));
        circleProgress();
        //圆形进度条绘制
        var _w = $('#svgDown').width();
        $.each($('.down-progress'), function(k, v) {
            var num = parseInt($(v).find('.val').html());
            if (!isEmpty(num)) {
                var percent = num / 100,
                    perimeter = Math.PI * _w * 0.9;
                $(v).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            }
        });
        //初始化下载状态
        var downed = $api.getStorage(memberId + 'downed');
        if (downed) {
            var chapterIdA = get_loc_val(memberId + 'downed', 'chapterIdA'),
                chapterIdB = get_loc_val(memberId + 'downed', 'chapterIdB'),
                chapterIdC = get_loc_val(memberId + 'downed', 'chapterIdC'),
                progress = get_loc_val(memberId + 'downed', 'progress');
            var id = '';
            //一级章节下载记录
            if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) id = chapterIdA;
            //二级章节下载记录
            if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) id = chapterIdB;
            //三级章节下载记录
            if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) id = chapterIdC;
            if (progress == 100) {
                $("#" + id).attr({
                    'type': 4
                });
            } else {
                $("#" + id).attr({
                    'type': 1
                });
            }
        } else {
            $('.down-progress[type="1"]').attr({
                type: 2
            });
        }
        api.parseTapmode();
        //下载的圈圈样式
        $('.is_noing').css('display', 'none');
        //不是当前章节就隐藏掉
        is_over_list = true;
        //已加载完毕
    }
    $('#chaList').show().siblings().hide();
    //处理圈圈
    isSolidcircle('circle', '', '', courseId, 'video-menu');
}

//获取本章任务
function getChapterTask() {
    if (is_over_task == false) {
        var arr = [];
        for (var i in task_arr) {
            if (task_arr[i].chapterId == task_info_detail.chapterId) {
                arr.push(task_arr[i]['taskInfo']);
            }
        }
        var task_tpl = $('#task_tpl').html();
        var content = doT.template(task_tpl);
        //$('#chaTask').html(content(chapter_data)).show().siblings().hide();
        $('#chaTask').html(content(arr)).show().siblings().hide();
        is_over_task = true;
        isSolidcircle('progress', task_info_detail.chapterId, '', courseId, 'video-menu');
        //已加载完毕
        //})
    } else {
        $('#chaTask').show().siblings().hide();
    }
}

//获取本章附件
function getChapteFile() {
    if (is_over_file == false) {
        var file_tpl = $('#file_tpl').html();
        var content = doT.template(file_tpl);
        var files = find_extend_file(course_detail, 1);

        //$('#file_ul').html(content(chapter_data.chapterFiles));
        $('#file_ul').html(content(files));
        is_over_file = true; //已加载完毕
    }
    $('#chaAppendix').show().siblings().hide();
}

//获取扩展阅读
function getExtendRead() {
    if (is_over_extend == false) {
        var extend_tpl = $('#extend_tpl').html();
        var content = doT.template(extend_tpl);
        //$('#extend_ul').html(content(course_detail.chapters[chapters_num]));
        var files = find_extend_file(course_detail, 2);

        //$('#extend_ul').html(content(chapter_data.chapterExtends));
        $('#extend_ul').html(content(files));
        is_over_extend = true;
        //已加载完毕
    }
    $('#chaRead').show().siblings().hide();
}

/**
 * 获取课程里所有的任务
 * @param courseDetail
 * @returns {{}}
 */
function find_extend_file(courseDetail, type) {
    var data_arr = courseDetail.chapters;
    for (var i in data_arr) {
        if (data_arr[i].isLeaf == 'false') {
            var child = data_arr[i].children;
            for (var j in child) {
                if (child[j].isLeaf == 'false') {
                    var child2 = child[j].children;
                    for (var k in child2) {
                        var cId = child2[k].chapterId;
                        if (cId == task_info_detail.chapterId) {
                            if (type == 1) {
                                return child2[k].chapterFiles;
                            } else if (type == 2) {
                                return child2[k].chapterExtends;
                            }
                        }
                    }
                } else {
                    var cId = child[j].chapterId;
                    if (cId == task_info_detail.chapterId) {
                        if (type == 1) {
                            return child[j].chapterFiles;
                        } else if (type == 2) {
                            return child[j].chapterExtends;
                        }
                    }
                }
            }
        } else {
            var cId = data_arr[i].chapterId;
            if (cId == task_info_detail.chapterId) {
                if (type == 1) {
                    return data_arr[i].chapterFiles;
                } else if (type == 2) {
                    return data_arr[i].chapterExtends;
                }
            }
        }
    }
}


//点击章节列表(type:1)、本章任务(type:2)、本章附件(type:3)、扩展阅读(type:4)，进行切换
function changeNav(obj, type) {
    if (now_nav_type != type) {
        /*api.showProgress({
         title : '加载中',
         modal : false
         });*/
        //添加、移除样式
        $(obj).addClass('vList-selected');
        $(obj).siblings().removeClass('vList-selected');
        now_nav_type = type;
        //获取内容相应的内容
        if (type == 1) {
            //获取章节任务
            getChapterTask();
        } else if (type == 2) {
            //显示章节列表
            getChapterList();
        } else if (type == 3) {
            //获取本章附件
            getChapteFile();
        } else if (type == 4) {
            //获取扩展阅读
            getExtendRead();
        } else {
            return false;
        }
        api.hideProgress();
    }
}

//查看扩展阅读
function lookExtend(id, url, title) {
    if (isEmpty(url) || isEmpty(title)) {
        api.toast({
            msg: '扩展已失效'
        });
    } else {
        api.openWin({
            name: 'course-url',
            url: 'course-url.html',
            pageParam: { title: title, url: url }, //外链},
            slidBackEnabled: false,
            delay: 200
        });
        return false;
        if (from_page == 'course-test') {
            //如果当前页面是从course-test页面打开的frame，头部不用变，发送监听，打开新frame
            api.sendEvent({
                name: 'change_course_test',
                extra: {
                    type: 'link',
                    title: title,
                    url: url //外链
                }
            });
            api.setFrameAttr({
                name: 'video-menu',
                hidden: true
            });
        } else {
            //如果当前页面是从video页面打开的frame，需要打开一个新的窗口
            var page_param = {
                courseId: courseId, //课程id
                course_detail: course_detail, //课程详情
                chapters_num: chapters_num, //一级章节
                chapters_child_num: chapters_child_num, //二级章节
                child_task_num: child_task_num, //任务
                task_info: task_info, //任务信息
                type: 'link',
                link_title: title,
                link_url: url, //外链
                hasFrame: false
            };
            api.openWin({
                name: 'course-test',
                url: 'course-test.html',
                pageParam: page_param,
                slidBackEnabled: false,
                delay: 200
            });
        }
    }
}
//点击本章任务
function task_event(obj, num, task_id) {
    task_info = task_arr[task_id].taskInfo; //任务信息

    // 如果要打开新的窗口，则关闭旧窗口
    if ((from_page == 'course-test' && task_info.taskType == 'video') || (from_page == 'video' && task_info.taskType != 'video')) {
        //传递的页面参数
        var page_param = {
            courseId: courseId, //课程id
            course_detail: course_detail, //课程详情
            //study_progress : study_progress,
            task_info: task_info, //任务信息
            type: 'task'
        };
        //判断当前任务类型
        if (task_info.taskType == 'video') {
            var winName = 'video';
            var winUrl = 'video.html';
        } else {
            var winName = 'course-test';
            var winUrl = 'course-test.html';
            api.sendEvent({
                name: 'close_video_demo'
            });
        }
        api.openWin({
            name: winName,
            url: winUrl,
            reload: true,
            pageParam: page_param,
            slidBackEnabled: false, //iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
            delay: 200
        });
        api.closeWin({
            animation: {
                type: 'flip',
                subType: 'from_left',
                duration: 500
            }
        });
    } else {
        //要传递的数据
        var extraData = {
            //study_progress : study_progress,
            taskId: task_id, //任务信息
            type: 'task'
        };

        if (from_page == 'course-test') {
            api.sendEvent({
                name: 'change_course_test',
                extra: extraData
            });
            api.closeFrame();
        } else if (from_page == 'video' && task_info.taskType == 'video') {
            api.sendEvent({
                name: 'change_video',
                extra: extraData
            });
            api.closeFrame();
        }
    }
}



//判断初始化时章节是否折叠或展开
function isShow(type, leave, chapId, chapId2) {
    var oneChapter_info = course_detail.chapters[study_progress.oneChapterIndex];
    if (leave == 2) {
        if (chapId == oneChapter_info.chapterId) {
            if (type == 'title') {
                return 'open';
            } else {
                return 'is_oking';
            }
        } else {
            if (type == 'title') {
                return '';
            } else {
                return 'is_noing';
            }
        }
    } else if (leave == 3) {
        var twoChapter_info = oneChapter_info.children[study_progress.twoChapterIndex];
        if (chapId2 == twoChapter_info.chapterId) {
            if (type == 'title') {
                return 'open';
            } else {
                return 'is_oking';
            }
        } else {
            if (type == 'title') {
                return '';
            } else {
                return 'is_noing';
            }
        }
    }
}



//点击本章附件，下载文件
function downloadFile(url, type) {
    if (isEmpty(url)) {
        api.toast({
            msg: '文件已过期'
        });
    } else {
        api.showProgress({
            title: "加载中",
            modal: false
        });
        //下载文件
        var file_url = static_url + url;
        var url_arr = file_url.split("/");
        for (var i in url_arr) {
            url_arr[i] = encodeURI(url_arr[i]);
        }
        var new_url = url_arr.join("/");
        api.download({
            url: new_url,
            //savePath: 'fs://caicui/pdf/',//（可选项）存储路径，不传时使用自动创建的路径
            report: true, //（可选项）下载过程是否上报
            cache: false, //（可选项）是否使用本地缓存
            allowResume: true //（可选项）是否允许断点续传
        }, function(ret, err) {
            if (err) {
                api.toast({
                    msg: err.msg
                });
                api.hideProgress();
            } else if (ret) {
                //var value = ('文件大小：' + ret.fileSize + '；下载进度：' + ret.percent + '；下载状态' + ret.state + '存储路径: ' + ret.savePath);
                if (ret.percent == 100) {
                    api.hideProgress();
                    if (type == 'zip') {
                        /*
                         var obj = api.require('zip');
                         obj.unarchive({
                         file:ret.savePath,
                         password:''
                         },function(ret,err){
                         if(ret.status) {
                         api.alert({msg:'解压成功'});
                         }else{
                         api.alert(err.msg);
                         }
                         });
                         */
                    } else {
                        var obj = api.require('docReader');
                        obj.open({
                            path: ret.savePath
                        });
                    }
                }
            }
        });
    }
}


//关闭当前的页面
function closeThis() {
    if (api.pageParam.from_page == 'video') {
        api.sendEvent({
            name: 'continue_video',
            extra: {
                'times': api.pageParam.times
            }
        });
    }
    //api.setFrameAttr({name:'video-menu',hidden:true});
    api.closeFrame({
        name: 'video-menu'
    });
}
