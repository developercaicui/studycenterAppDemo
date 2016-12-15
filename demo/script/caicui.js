/**
 * Created by H5-dev on 2015/9/8.
 */
var myFunction = function () {
    //键盘弹出后输入框缩小
    this.adjustHeight = function (num) {
        var docHeight = document.documentElement.clientHeight;
        document.body.style.height = docHeight + 'px';
        var adjustHeight = document.querySelectorAll('.adjust-height');
        var adjustLength = adjustHeight.length;
        if (adjustLength !== 0) {
            for (var j = 0; j < adjustLength; j++) {
                adjustHeight[j].style.height = docHeight * num + 'px';
            }
        }
    };
};
var commonFun = new myFunction();
//控制页面字体
document.documentElement.style.fontSize = 100 * (document.documentElement.clientWidth / 720) + 'px';
//控制图片宽度
var imgArr = document.querySelectorAll('.js-WEqualH');
var imgArrLength = imgArr.length;
if (imgArrLength !== 0) {
    for (var j = 0; j < imgArrLength; j++) {
        var imgHeight = window.getComputedStyle(imgArr[j]).height;
        imgArr[j].style.width = imgHeight;
    }
}
var $get = function (dom) {
    return document.querySelector(dom);
};
var $getAll = function (dom) {
    return document.querySelectorAll(dom);
};
var $getSib = function (dom) {
    var a = [];
    var b = dom.parentNode.children;
    var length = b.length;
    for (var i = 0; i < length; i++) {
        if (b[i] !== dom) {
            a.push(b[i]);
        }
    }
    return a;
};

/*
 var svgDown,svgAudio;
 $(function(){
 if(!window.localStorage.caicui_svgDown){
 window.localStorage.caicui_svgDown = svgDown = $('#svgDown').width();
 window.localStorage.caicui_svgAudio = svgAudio = $('#svgAudio').width();
 }else{
 svgDown = parseInt(window.localStorage.caicui_svgDown);
 svgAudio = parseInt(window.localStorage.caicui_svgAudio);
 }
 });
 */

if (window.localStorage.systemType) {
    $('html').addClass(window.localStorage.systemType);
    //alert(window.localStorage.systemType);
}

//alert(window.localStorage.caicui_svgDown);

//讨论等页面底下编辑区

/*function openEditor(e){
 if(e=='audio2'||e=='img2'){
 api.sendEvent({
 name: 'opena',
 extra: {sethomepage: 1}
 });
 }else if(e=='picture2'||e=='recording'){
 api.sendEvent({
 name: 'opena',
 extra: {sethomepage: 2}
 });
 }
 var parm=api.pageParam;
 parm.name=e;
 api.openFrame({
 name: 'footer-editor',
 url: 'footer-editor.html',
 bgColor:'rgba(0,0,0,0)',
 bounces: false,
 reload: true,
 vScrollBarEnabled: false,
 rect: {
 x: 0,
 y: 0,
 w: api.winWidth,
 h: api.winHeight
 },
 pageParam:parm
 });
 }*/
// 圆环进度条

function circleProgress() {
    var cirDonW = $('#svgDown').width();
    $('.circle-progress,.audio-progress').each(function () {
        var _ts = $(this);
        var dt = new Date();
        var cirI = dt.getTime();
        var cirVal = parseInt(_ts.find('.val').text());
        var cirW;
        if (parseInt(_ts.width()) > 0) {
            cirW = parseInt(_ts.width());
        } else {
            if (_ts.hasClass('down-progress')) {
                cirW = svgDown
            } else if (_ts.hasClass('audio-progress')) {
                cirW = svgAudio
            }
        }

        _ts.find('svg').remove();
        _ts.prepend('<svg width="' + cirW + '" height="' + cirW + '" viewbox="0 0 ' + cirW + ' ' + cirW + '"><circle cx="' + cirW / 2 + '" cy="' + cirW / 2 + '" r="' + cirW * 0.45 + '"></circle><circle id="circle' + cirI + '" cx="' + cirW / 2 + '" cy="' + cirW / 2 + '" r="' + cirW * 0.45 + '"></circle></svg>');
        //console.log("#circle" + cirI, cirW, cirVal);
        circleTrans("#circle" + cirI, cirW, cirVal);
    });
    $('.down-progress').each(function () {
        var _ts = $(this);
        var dt = new Date();
        var cirI = dt.getTime();
        var cirO = _ts.hasClass('svg-existing');
        if (!cirO) {
            _ts.addClass('svg-existing');
            _ts.prepend('<svg width="' + cirDonW + '" height="' + cirDonW + '" viewbox="0 0 ' + cirDonW + ' ' + cirDonW + '"><circle cx="' + cirDonW / 2 + '" cy="' + cirDonW / 2 + '" r="' + cirDonW * 0.45 + '"></circle><circle id="circle' + cirI + '" cx="' + cirDonW / 2 + '" cy="' + cirDonW / 2 + '" r="' + cirDonW * 0.45 + '"></circle></svg>');
        }
    });
}
function circleTrans(e, s, v) {
    var percent = v / 100, perimeter = Math.PI * 0.9 * s;
    setTimeout(function () {
        $(e).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
    }, 100);
}

function audioDom() {
    $('.voice-player').each(function () {
        var _this = $(this);
        _this.html('<b>' + _this.attr("time") + '</b><span class="icon_box"><i class="icon-rss3"></i><i class="icon-rss2"></i><i class="icon-rss1"></i></span><i class="icon-spinner"></i>');
    })
}
var timer = null;
//播放音乐/*音频修改*/
function playAudio(item) {
    clearInterval(timer);
    var _url = $(item).attr('url');
    var _time = parseInt($(item).attr('time'));
    var cc = _time;
    $('.voice-player').removeClass('play');
    $(item).addClass('loading');
    if ($(item).attr('bg') == '') {
        var fixname = getFixName(_url);
        api.download({
            url: _url,
            report: false,
            cache: true,
            savePath: 'fs://audio/' + Date.now() + fixname,
            allowResume: true
        }, function (ret, err) {
            if (ret && ret.state) {
                clearInterval(timer);
                timer = setInterval(function () {
                    cc--;
                    $(item).children('b').text(parseInt(cc));
                    //alert(cc);
                    //if(parseInt(cc)==1){
                    //    clearInterval(timer);
                    //    alert(1);
                    //    $(item).removeClass('play');
                    //    $(item).attr('bg','');
                    //    api.stopPlay();
                    //    $(item).children('b').text(_time);
                    //}
                }, 1000);
                $(item).addClass('play').removeClass('loading');

                api.startPlay({
                    path: ret.savePath
                }, function (res) {
                    clearInterval(timer);
                    if (_time < 0) {
                        _time = 0
                    }
                    $(item).children('b').text(_time);
                    $(item).removeClass('play');
                    api.stopPlay();
                });
            } else {
                api.toast({
                    msg: err.msg,
                    location: 'middle'
                });
            }
        });
        $(item).attr('bg', '1');
    } else {
        $('.voice-player').removeClass('play').removeClass('loading');
        clearInterval(timer);
        api.stopPlay();
        $(item).attr('bg', '');
    }
}


//全屏时屏幕高度处理
var winW, winH;
if (window.localStorage.winW) {
    winW = window.localStorage.winW;
    winH = window.localStorage.winH;
} else {
    winW = window.localStorage.winW = $(window).width();
    winH = window.localStorage.winH = $(window).height();
}
//带编辑器的头部openFrame通用
function editorFrame(p, t) {
    var param = api.pageParam;
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    var hea_h = $('#header').height();
    var bar_h = $('#editor').height();
    //alert(bar_h);
    if (bar_h < 10) {
        bar_h = 65
    }
    var _h;
    if (api.winWidth == api.winHeight) {
        _h = winW - 20;
    } else {
        _h = api.winHeight;
    }
    api.openFrame({
        name: p,
        url: p + '.html',
        bgColor: '#fff',
        bounces: true,
        opaque: true,
        reload: true,
        vScrollBarEnabled: false,
        rect: {
            x: 0,
            y: hea_h,
            w: api.winWidth,
            h: api.winHeight - hea_h - bar_h
        },
        pageParam: param
    });
    api.openFrame({
        name: 'footer-editor',
        url: 'footer-editor.html',
        bgColor: 'rgba(0,0,0,0)',
        bounces: false,
        scaleEnabled: false,
        rect: {
            x: 0,
            y: _h - bar_h,
            w: api.winWidth,
            h: bar_h
        },
        pageParam: param
    });
    window.localStorage.editorType = t;
    api.setWinAttr({
        slidBackEnabled: false
    });
}

function openImageBrower(arr, i) {//图片浏览器
    var str = arr.split(',');
    var data = [];
    for (var p in str) {
        data.push(static_url + str[p]);
    }
    //图片浏览器打开
    var obj = api.require('imageBrowser');
    obj.openImages({
        imageUrls: data,
        activeIndex: i
    });
}

/*信息99+*/
function num_99() {
    $('.prorn').each(function () {
        if ($(this).html() >= 99) {
            $(this).html('99+');
        }
    });
    $('.toptit p').each(function () {
        if ($(this).html() >= 99) {
            $(this).html('99+');
        }
    });
}
// 横向进度条
function progressBar() {
    setTimeout(function () {
        $('.progress-bar2').each(function () {
            var _t = $(this);
            var _num = Math.round(_t.attr('min') / _t.attr('max') * 100);
            if (_num > 90) {
                _num = 100
            }
            var $val = _t.parent().next('.progress-val2');
            if ($val) {
                $val.text(_num + '%');
            }
            if (_t.attr('data') != '1') {
                _t.width(_num + '%');
                _t.attr('data', '1');
            }
        });
    }, 500);
}

//课程折叠、显示章节
function toggleChild(e) {
    $(e).parents('dl').parent().toggleClass('hide-child');
}


/**
 * 获取课程里所有的任务
 * @param courseDetail
 * @returns {{}}
 */
function save_tasks(courseDetail) {
    var arr = {};
    var data_arr = courseDetail.chapters;
    var courseName = courseDetail.courseName;
    var courseId = courseDetail.courseId;
    for (var i in data_arr) {
        if (data_arr[i].isLeaf == 'false') {
            var child = data_arr[i].children;
            for (var j in child) {
                if (child[j].isLeaf == 'false') {
                    var child2 = child[j].children;
                    for (var k in child2) {
                        var cId = child2[k].chapterId;
                        var cName = child2[k].chapterTitle;
                        for (var x in child2[k].tasks) {
                            if (child2[k].isLeaf != 'false') {
                                var taskid = child2[k].tasks[x].taskId;
                                var obj_data = {
                                    courseId: courseId,
                                    courseName: courseName,
                                    chapterId: cId,
                                    chapterName: cName,
                                    taskInfo: child2[k].tasks[x]
                                };

                                arr[taskid] = obj_data;
                            }
                        }
                    }
                } else {
                    var cId = child[j].chapterId;
                    var cName = child[j].chapterTitle;
                    for (var k in child[j].tasks) {
                        var taskid = child[j].tasks[k].taskId;
                        var obj_data = {
                            courseId: courseId,
                            courseName: courseName,
                            chapterId: cId,
                            chapterName: cName,
                            taskInfo: child[j].tasks[k]
                        };
                        arr[taskid] = obj_data;
                    }
                }
            }
        } else {
            var cId = data_arr[i].chapterId;
            var cName = data_arr[i].chapterTitle;
            for (var k in data_arr[i].tasks) {
                var taskid = data_arr[i].tasks[k].taskId;
                var obj_data = {
                    courseId: courseId,
                    courseName: courseName,
                    chapterId: cId,
                    chapterName: cName,
                    taskInfo: data_arr[i].tasks[k]
                };
                arr[taskid] = obj_data;
            }
        }
    }
    return arr;
}
/*
 * 根据时间点跳转到对应界面
 * taskprogress courseId  taskid
 * */
function jump_task(taskprogress, courseId, taskid) {
    var task_arr;
    if (!isEmpty(taskprogress) && !isEmpty(courseId) && !isEmpty(taskid)) {
        var tmp_course_detail = $api.getStorage(courseId);
        if (isEmpty(tmp_course_detail)) {
            api.showProgress({
                title: '处理中',
                modal: false
            });
            //获取课程的详细信息
            //api/v2.1/course/courseDetail，接口编号：004-006
            ajaxRequest('api/v2.1/course/courseDetail', 'get', {courseId: courseId}, function (ret, err) {//004.006获取课程的详细信息
                if (err) {
                    api.hideProgress();
                    api.toast({
                        msg: err.msg,
                        location: 'middle'
                    });
                    return false;
                }
                if (ret && ret.state == 'success') {
                    var course_detail = ret.data[0];//课程详情数据
                    task_arr = save_tasks(course_detail);
                    $api.setStorage(courseId, course_detail);
                    var res_process = {};
                    res_process.task_info = task_arr[taskid];
                    res_process.last_progress = taskprogress;
                    judge_task(res_process, course_detail);
                }
            });
        } else {
            var course_detail = tmp_course_detail;//存储课程详细信息
            task_arr = save_tasks(course_detail);
            var res_process = {};
            res_process.task_info = task_arr[taskid];
            res_process.last_progress = taskprogress;
            judge_task(res_process, course_detail);
        }
        function judge_task(res_process, course_detail) {
            if (isEmpty(course_detail) || isEmpty(course_detail.chapters) || isEmpty(res_process)) {
                api.toast({
                    msg: '暂无任务',
                    location: 'middle'
                });
                return false;
            }
            var task_info = res_process.task_info.taskInfo;//当前任务信息
            if (isEmpty(task_info)) {
                api.toast({
                    msg: '暂无任务',
                    location: 'middle'
                });
                return false;
            }
            //判断当前任务类型
            if (task_info.taskType == 'video') {
                res_process.last_progress = res_process.last_progress > 10 ? res_process.last_progress - 10 : res_process.last_progress;
                //视频类型
                var new_win_name = 'video';
                var new_win_url = 'video.html';
            } else if (task_info.taskType == 'entry' || task_info.taskType == 'pdfread' || task_info.taskType == 'exam') {
                //entry（外链类型）、pdfread（pdf类型）、exam（测试题类型）
                var new_win_name = 'course-test';
                var new_win_url = 'course-test.html';
            } else {
                api.toast({
                    msg: '暂无任务，请稍后再试或联系客服',
                    location: 'middle'
                });
                return false;
            }
            //需要传递的参数
            var pageParams = {
                from: 'course-studying',
                courseId: course_detail.courseId,//课程id
                last_progress: res_process.last_progress,//学习进度
                course_detail: course_detail,//课程详情
                task_info: task_info,//当前要学习的任务信息
                type: 'task'
            };
            api.hideProgress();
            //设置屏幕向右翻转
            api.setScreenOrientation({
                orientation: 'landscape_right'
            });
            //跳转到播放页面
            api.openWin({
                name: new_win_name,
                url: new_win_url,
                delay: 200,
                slidBackEnabled: false,//iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
                pageParam: pageParams
            });
        }
    } else {
        return false;
    }
}
/*
 * 苹果内购处理
 * */
function buys(id, goods_price) {
    var goods_id = 'iphone_' + id;
    var iap = api.require('iap');
    api.showProgress({
        style: 'default',
        title: '处理中',
        modal: true
    });
    iap.getProducts({
        productIds: [goods_id]
    }, function (res, err) {
        if (res) {
            if (res.products) {
                iap.purchase({
                    productId: goods_id        //有效商品id
                }, function (ret, err) {
                    setTimeout(function () {
                        api.hideProgress();
                    }, 1500);
                    if (ret) {
                        var state = ret.state;
                        var msg = '';
                        switch (state) {
                            case 0:
                            {
                                //msg= '交易已加入队列';
                            }
                                break;
                            case 1:
                            {
                                var param = {};
                                param.userId = getstor('memberId');
                                param.token = $api.getStorage('token');
                                param.courseId = id;
                                param.paidAmount = goods_price;
                                ajaxRequest('api/v2.1/mobile/order', 'post', param, function (ret, err) {
                                    api.hideProgress();
                                    if (err) {
                                        api.toast({
                                            msg: err.msg,
                                            location: 'middle'
                                        });
                                        return false;
                                    }
                                    if (ret && ret.isSuccess == true) {
                                        api.sendEvent({
                                            name: 'flush_noactive'
                                        });
                                        api.setStatusBarStyle({
                                            style: 'dark'
                                        });
                                        api.closeWin({
                                            name: 'course-buy'
                                        });
                                    } else {
                                        api.alert({
                                            msg: '订单提交接口异常'
                                        });
                                    }
                                });
                            }
                                break;
                            case 2:
                            {
                                //msg='交易失败';
                            }
                                break;
                            case 3:
                            {
                                msg = '交易恢复';
                            }
                                break;
                            case 4:
                            {
                                msg = '交易等待被确认';
                                //交易等待被确认，待确认后交易状态会变更为其它状态
                            }
                                break;
                            default:
                                break;
                        }
                        if (msg != '') {
                            api.alert({
                                msg: msg
                            });
                        }
                    } else {
                        api.alert({msg: err.msg});
                    }
                });
                return false;
            }
            if (res.invalidProductIds) {
                api.hideProgress();
                api.alert({
                    msg: '无效的商品'
                });
                return false;
            }
        } else {
            api.hideProgress();
            api.alert({
                msg: err.msg
            });
        }
    });
}
function getCCconfig(callback, is_force) {
    var CCconfig = isEmpty($api.getStorage('CCconfig')) ? false : $api.getStorage('CCconfig');
    if ((!CCconfig || is_force) && $api.getStorage('token')) {
        ajaxRequest('api/v2.1/oauth/getConfig', 'post', {
            token: $api.getStorage('token'),
            societyType: 'ccidinfo'
        }, function (ret, err) {//003.303.1  发布讨论
            if (err) {
                callback(false);
            }
            if (ret && ret.state == 'success') {
                $api.setStorage('CCconfig', JSON.parse(ret.data.appsecret));
                callback(ret.data.appsecret);
            } else {
                api.toast({
                    msg: 'cc配置接口异常',
                    location: 'middle'
                });
                callback(false);
            }
        });
    } else {
        callback(CCconfig);
    }
}
function bufferCourese(arrays) {
    var array=[];
    for(var p  in arrays){
        if(!isEmpty(arrays[p]['lastTaskdate'])){
            array.push(arrays[p]);
        }
    }
    var i = 0,
        len = array.length,
        j, d;
    for (; i < len; i++) {
        for (j = 0; j < len; j++) {
            if (array[i].lastTaskdate > array[j].lastTaskdate) {
                d = array[j];
                array[j] = array[i];
                array[i] = d;
            }
        }
    }
    return array;
}
//保存任务进度
function DosaveTaskProgress() {

    var data=$api.getStorage('saveTaskProgress');
    var now_progress=data.now_progress,
        total=data.total,
        state=data.state,
        task_info=data.task_info,
        task_info_detail=data.task_info_detail,
        course_detail=data.course_detail;

    var user_nickname = get_loc_val('mine', 'nickName');
    var user_token = $api.getStorage('token');
    var user_memberId = get_loc_val('mine', 'memberId');
    var post_param = {
	        categoryId : course_detail.categoryId, //必须，证书id    ff808081473905e701475cd3c2080001
	        subjectId : course_detail.subjectId, //必须，科目id  ff808081473905e7014762542d940078
	        categoryName : course_detail.categoryName, // 证书名称
	        subjectName : course_detail.subjectName, // 科目名称
	        courseId : course_detail.courseId, //必须，课程id    ff808081486933e6014889882d9c0590
	        courseName : course_detail.courseName, //必须，课程名称    courseName
	        chapterId : task_info_detail.chapterId, //必须，章节id   chapterId
	        chapterName : task_info_detail.chapterName, //必须，章节名称   chapterName
	        taskId : task_info.taskId, //必须，任务id    1
	        taskName : task_info.title, //任务名称
	        progress : now_progress, //必须，当前进度值，视频为秒，试卷为题数量，文档为页码   5
	        total : total, //必须，任务总长度   48
	        state : state,//必须，进度状态默认init，完成：complate   complate       
	        downLoadProgress :  '',    //下载进度
	        downLoadState :  '',      //下载状态  ing 、stop、end
	        downLoadDate : '', //下载时间
	        expiredDate : '',  //过期日期
	        isSupply : 0  //是否补发  0是实时报文
    };
    ajaxRequest('api/userAction/course/taskProgress/v1.0/', 'post', post_param, function(ret, err) {//008.024保存任务进度日志（new）tested
        if(err){
            api.toast({
                msg : err.msg,
                location : 'middle'
            });
        }
        //if (ret && ret.state == 'success') {
        //$api.setStorage(user_nickname + 'self' + courseId, '');
        //清除整个课程结构的课程进度
        //}
    });
}


/*
*保存课程过期时间
* */
function saveExpire(list){

    if(isEmpty(list)){
        return false;
    }

    var memberId = getstor('memberId');

    var course_expire =  isEmpty($api.getStorage(memberId+'course_expire')) ?  ''  : $api.getStorage(memberId+'course_expire');

    for(var p in list){
        var courseId = list[p]['courseId'];
        var expirationTime = isEmpty(list[p]['expirationTime']) ? 0  : list[p]['expirationTime'];
        if(course_expire){
            var is_same = false;
            for (var q in course_expire) {
                _courseId = course_expire[q]['courseId'];
                //_expirationTime = isEmpty(course_expire[q]['expirationTime']) ? 0 : course_expire[q]['expirationTime'];
                if (courseId == _courseId) {
                    course_expire[q]['expirationTime'] = expirationTime;
                    is_same = true;
                }
            }
            if (!is_same) {
                var data ={};
                data[courseId] = expirationTime;
                course_expire.push(data);
                $api.setStorage(memberId+'course_expire',course_expire);
            }else{
                $api.setStorage(memberId+'course_expire',course_expire);
            }
        }else{
            course_expire = [];
            var data = {};
            data[courseId] = expirationTime;
            course_expire.push(data);
            $api.setStorage(memberId+'course_expire',course_expire)

        }
    }
}
/*
* 判断视频是否过期
* */
function CourseIsexpire(courseId){
    var memberId = getstor('memberId');
    var course_expire =  isEmpty($api.getStorage(memberId+'course_expire')) ?  ''  : $api.getStorage(memberId+'course_expire');
    var is_ok = false;
    if(course_expire){
        for(var p in course_expire){
            if(course_expire[p][courseId]!=undefined && (parseInt(Date.now())<=parseInt((course_expire[p][courseId]=='' ? 0 : course_expire[p][courseId])*1000))){
                is_ok = true;
            }
        }
        if(is_ok){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }

}

//保存进度到本地数据库
function DosaveDataBase() {
     
    //alert("先保存数据库")
    var data=$api.getStorage('saveTaskProgress');
    var now_progress=data.now_progress,
        total=data.total,
        state=data.state,
        task_info=data.task_info,
        task_info_detail=data.task_info_detail,
        course_detail=data.course_detail;
        var post_param = {
                    categoryId : course_detail.categoryId, //必须，证书id    ff808081473905e701475cd3c2080001
                    subjectId : course_detail.subjectId, //必须，科目id  ff808081473905e7014762542d940078
                    categoryName : course_detail.categoryName, // 证书名称
                    subjectName : course_detail.subjectName, // 科目名称
                    courseId : course_detail.courseId, //必须，课程id    ff808081486933e6014889882d9c0590
                    courseName : course_detail.courseName, //必须，课程名称    courseName
                    chapterId : task_info_detail.chapterId, //必须，章节id   chapterId
                    chapterName : task_info_detail.chapterName, //必须，章节名称   chapterName
                    taskId : task_info.taskId, //必须，任务id    1
                    taskName : task_info.title, //任务名称
                    progress : now_progress, //必须，当前进度值，视频为秒，试卷为题数量，文档为页码   5
                    total : total, //必须，任务总长度   48
                    state : state,//必须，进度状态默认init，完成：complate   complate       
                    downloadProgress :  '',    //下载进度
                    downloadState :  '',      //下载状态  ing 、stop、end
                    downloadDate : '', //下载时间
                    expiredDate : '',  //过期日期
                    isSupply : 0  //是否补发  0是实时报文
    };
    DB.saveTasksProgress(post_param,function(ret, err){

        if(ret.status){
          // DB.showTasksProgress();
        }
        
    });
	
//验证本次保存时间和上次保存时间的差值，必须为正数，否则提示用户本地时间异常????
//   DB.getTaskProgress(post_param.taskId,function(data){
//	 	alert(data);
//	 })
// 	var prevSaveDate;
//  if(post_param.modifyDate - ret.data.modifyDate <0){
//     api.alert({
//            title : '温馨提示',
//            msg : '您手机时间异常，请调整当前时间！',
//            buttons : ['返回']
//        }, function(ret, err) {
//            if (ret.buttonIndex == 1) {
//                closeThisWin(0);
//            }
//        });
//        return false;
//     
//  }
    
}
