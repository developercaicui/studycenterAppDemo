function init_check(){
    $('.cache-list .icon-check').click(function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active').parents('.cache-course').find('.courseid').removeClass('active');
            $(this).parents('.mycaptA').find('.chaptera').removeClass('active');
            $(this).parents('.mycaptB').find('.chapterb').removeClass('active');
            if($(this).hasClass('courseid')){//如果是顶级
                $(this).parents('.cache-course').find('.icon-check').removeClass('active');
            }else if($(this).hasClass('chaptera')){//如果是二级
                $(this).parents('.mycaptA').find('.icon-check').removeClass('active');
            }else if($(this).hasClass('chapterb')){//如果是三级
                $(this).parents('.mycaptB').find('.icon-check').removeClass('active');
            }
        }else{
            $(this).addClass('active');
            if($(this).hasClass('courseid')) {//如果是顶级
                $(this).parents('.cache-course').find('.icon-check').addClass('active');
            }else if($(this).hasClass('chaptera')){//如果是二级
                $(this).parents('.mycaptA').find('.icon-check').addClass('active');
                var _s = $(this).parents('.cache-course').find('.mycaptA').not('.none');
                var _a = _s.length;
                var _b = _s.children('dl').find('.active').length;
                //console.log(_a + ' ====== ' + _b);
                if(_a == _b){
                    $(this).parents('.cache-course').find('.courseid').addClass('active');
                }
            }else if($(this).hasClass('chapterb')){//如果是三级
                $(this).parents('.mycaptB').find('.icon-check').addClass('active');
                var _s = $(this).parents('.mycaptA').find('.mycaptB').not('.none');
                var _a = _s.length;
                var _b = _s.children('dl').find('.active').length;
                //console.log(_a + ' ====== ' + _b);
                if(_a == _b){
                    $(this).parents('.mycaptA').find('.chaptera').addClass('active');
                }
                var _x = $(this).parents('.cache-course').find('.mycaptA').not('.none');
                var _y = _x.length;
                var _z = _x.children('dl').find('.active').length;
                //console.log(_y + ' ++++++ ' + _z);
                if(_y == _z){
                    $(this).parents('.cache-course').find('.courseid').addClass('active');
                }
            }else if($(this).hasClass('chapterc')){//如果是四级
                var _s = $(this).parents('.mycaptB').find('.mycaptC').not('.none');
                var _a = _s.length;
                var _b = _s.children('dl').find('.active').length;
                //console.log(_a + ' ====== ' + _b);
                if(_a == _b){
                    $(this).parents('.mycaptB').find('.icon-check').addClass('active');
                }
                var _l = $(this).parents('.mycaptA').find('.mycaptB').not('.none');
                var _m = _l.length;
                var _n = _l.children('dl').find('.active').length;
                //console.log(_m + ' ------ ' + _n);
                if(_m == _n){
                    $(this).parents('.mycaptA').find('.chaptera').addClass('active');
                }
                var _x = $(this).parents('.cache-course').find('.mycaptA').not('.none');
                var _y = _x.length;
                var _z = _x.children('dl').find('.active').length;
                //console.log(_y + ' ++++++ ' + _z);
                if(_y == _z){
                    $(this).parents('.cache-course').find('.courseid').addClass('active');
                }
            }
        }
    });
}
function get_percent() {
    //总进度计算
    $.each($('.cache-course'), function(k, v) {
        var total = $(v).find('.val').not('.none');
        var len = total.size();
        var num = 0;
        $.each(total, function(key, val) {
            var n = Number($.trim($(val).html()));
            if (!isEmpty(n)) {
                num = accAdd(num, n);
            }
        });
        var percent = num/len;
        percent = parseInt(percent.toFixed(2)) == 'NaN' || parseInt(percent.toFixed(2)) == NaN ? 0 : parseInt(percent.toFixed(2));
        if(percent > 0){
            if(percent>=100){
                percent=100;
            }
            $(v).find('.progress-val2').text(percent + '%');
            $(v).find('.progress-bar2').width(percent + '%');
            $('.progress-box2').show();
        }
    });
}
function init_data() {
    var tpl = $('#tpl').html();
    var content = doT.template(tpl)(mydata);
    $('#content').html(content);
    init_check();
    get_percent();
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
    api.hideProgress();
}
function get_data() {
    setTimeout(function(){
        api.hideProgress();
        api.refreshHeaderLoadDone();
    },100);
    
    $('body').removeClass('checking');
    /*后台代码*/
    memberId = getstor('memberId');
    var data = $api.getStorage(memberId + 'video-buffer');
    if (isEmpty(data) || data.length == 0) {//没有下载列表
        $('#content').html('');
        $('body').addClass('null');
        return false;
    }
    mydata = [];
    set_data(0);
    var len =  Object.keys(data).length;//  2
    function set_data(num){
        if (isEmpty(api.pageParam.courseId)) {//全部缓存列表
            read_file(memberId + data[num] + '.db', function(ret, err) {
                if (ret) {
                    var ret_data = JSON.parse(ret.data);
                    var res = {
                        data : ret_data
                    };
                    mydata.push(res);
                    if (num <len-1) {
                        num++;
                        set_data(num);
                    } else {
                        init_data();
                    }
                }
            });
        } else {//某个课程缓存列表
            if(!isEmpty(data) && !in_array(api.pageParam.courseId,data)){
                $('#content').html('');
                $('body').addClass('null');
                return false;
            }
            read_file(memberId + api.pageParam.courseId + '.db', function(ret, err) {
                if (ret) {
                    var ret_data = JSON.parse(ret.data);
                    var res = {
                        data : ret_data
                    };
                    mydata.push(res);
                    init_data();
                }
            });
        }
    }
}
function get_input(name) {
    var data = [];
    $.each($("." + name), function(k, v) {
        if($(v).hasClass('active')){
            switch(name){
                case 'courseid':
                    data.push($.trim($(v).attr('dataid')));
                    break;
                case 'chaptera':
                    if($(v).parents('.mycaptA').not('.none')){
                        data.push($.trim($(v).attr('dataid')));
                    }
                    break;
                case 'chapterb':
                    if($(v).parents('.mycaptB').not('.none')){
                        data.push($.trim($(v).attr('dataid')));
                    }
                    break;
                case 'chapterc':
                    if($(v).parents('.mycaptC').not('.none')){
                        data.push($.trim($(v).attr('dataid')));
                    }
                    break;
            }
        }
    });
    return data;
}
function set_down_status(str){
    //var data=JSON.parse(str);
    var data=str;
    var type = data.type, chapterIdA = isEmpty(data.chapterIdA) ? '' : data.chapterIdA ,chapterIdB = isEmpty(data.chapterIdB) ? '' : data.chapterIdB,chapterIdC = isEmpty(data.chapterIdC) ? '' : data.chapterIdC;
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
            var percent = num / 100, perimeter = Math.PI * 0.9 * $('#svgDown').width();
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            get_percent();
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
            get_percent();
            var percent = data.progress / 100, perimeter = Math.PI * 0.9 * $('#svgDown').width();
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            if (data.progress >= 100) {
                $(obj).attr({
                    type : 4
                }).siblings('.down_speed').html('').addClass('none');
            }
            $(obj).find('.val').text(data.progress);
            break;
        case 'end':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            get_percent();
            $(obj).attr({
                type : 4
            }).siblings('.down_speed').html('').addClass('none');
            break;
    }
}
var mydata = [];
var memberId;
var is_del_downed=false;
apiready = function() {
    //api.addEventListener({
    //    name : 'DOWN'
    //}, function(ret) {
    //    api.toast({
    //        msg:JSON.stringify(ret)
    //    })
    //});
    api.showProgress({
        title: '加载中',
        modal: false
    });
    memberId=getstor('memberId');
    mydata = [];
    get_data();
    api.addEventListener({
        name : 'flush_cache'
    }, function(ret, err) {
        mydata = [];
        get_data();
    });
    api.addEventListener({
        name : 'down_speed'
    }, function(ret) {
        if(ret){
            var speed=ret.value.speed;
            //初始化下载状态
            var downed = $api.getStorage(memberId+'downed');
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
    api.setRefreshHeaderInfo({
        visible : true,
        loadingImg : 'widget://image/arrow-down-o.png',
        bgColor : '#f3f3f3',
        textColor : '#787b7c',
        textDown : '下拉更多',
        textUp : '松开刷新',
        showTime : false
    }, function(ret, err) {
        mydata = [];
        get_data();
    });
    api.addEventListener({
        name : 'opena'
    }, function(ret) {
        if (ret.value.sethomepage == 1) {//删除
            $('body').addClass('checking');
            var courseid = get_input('courseid');
            var chaptera = get_input('chaptera');
            var chapterb = get_input('chapterb');
            var chapterc = get_input('chapterc');
            var downed = isEmpty($api.getStorage(memberId + 'downed')) ? '' : $api.getStorage(memberId + 'downed');
            if ((isEmpty(courseid) && isEmpty(chaptera) && isEmpty(chapterb) && isEmpty(chapterc)) || isEmpty(mydata)) {
                return false;
            }
            api.showProgress({
                title : '删除中',
                modal :true
            });
            var Queue;
            read_file(memberId + 'Queue.db', function(res, err) {
                if (res.status && res.data) {
                    Queue = JSON.parse(res.data);
                    for (var p in mydata) {
                        if (!isEmpty(mydata[p]['data'][0]['courseId']) && in_array(mydata[p]['data'][0]['courseId'], courseid)) {//删除整个课程对应的记录
                            var obj_data = $api.getStorage(memberId + 'video-buffer');
                            for (var x in obj_data) {
                                if (obj_data[x] == mydata[p]['data'][0]['courseId']) {
                                    obj_data.splice(x, 1);
                                    break;
                                }
                            }
                            if (downed) {
                                if (!isEmpty(api.pageParam.courseId) && api.pageParam.courseId == mydata[p]['data'][0]['courseId']) {//单课程进入
                                    is_del_downed = true;
                                    var jsfun = 'down_stop(function(){});';
                                    api.execScript({
                                        name: 'root',
                                        script: jsfun
                                    });
                                }
                                if( in_array(downed['courseId'], courseid)){//全部课程删除某一课程
                                    is_del_downed = true;
                                    var jsfun = 'down_stop(function(){});';
                                    api.execScript({
                                        name: 'root',
                                        script: jsfun
                                    });
                                }
                            }
                            $api.setStorage(memberId + 'video-buffer', obj_data);
                        }
                        if (!isEmpty(mydata[p]['data'][0]['chapters'])) {
                            for (var n in mydata[p]['data'][0]['chapters']) {
                                if (!isEmpty(mydata[p]['data'][0]['chapters'][n]['chapterId']) && in_array(mydata[p]['data'][0]['chapters'][n]['chapterId'], chaptera)) {//删除一级章节对应记录
                                    for (var v in Queue) {
                                        if ((!isEmpty(Queue[v]['chapterIdA']) && Queue[v]['chapterIdA'] == mydata[p]['data'][0]['chapters'][n]['chapterId']) || (!isEmpty(Queue[v]['chapterida']) && Queue[v]['chapterida'] == mydata[p]['data'][0]['chapters'][n]['chapterId']) ) {
                                            Queue.splice(v, 1);
                                            break;
                                        }
                                    }
                                    if (downed) {
                                        var chapterA = downed['chapterIdA'];
                                        if ((!isEmpty(mydata[p]['data'][0]['chapters'][n]) && !isEmpty(mydata[p]['data'][0]['chapters'][n]['chapterId'])&&mydata[p]['data'][0]['chapters'][n]['chapterId'] == chapterA)) {
                                            is_del_downed=true;
                                            var jsfun = 'down_stop(function(){});';
                                            api.execScript({
                                                name: 'root',
                                                script: jsfun
                                            });
                                        }
                                    }
                                    $api.rmStorage(memberId + mydata[p]['data'][0]['chapters'][n]['chapterId'] + 'progress');//一级章节删除
                                }
                                //二级章节存在
                                if (!isEmpty(mydata[p]['data'][0]['chapters'][n]['children'])) {
                                        for (var q in mydata[p]['data'][0]['chapters'][n]['children']) {
                                            if (!isEmpty(mydata[p]['data'][0]['chapters'][n]['children'][q]['chapterId']) && in_array(mydata[p]['data'][0]['chapters'][n]['children'][q]['chapterId'], chapterb)) {//删除二级章节下载记录
                                                for (var s in Queue) {
                                                    if ((!isEmpty(Queue[s]['chapterIdB']) && Queue[s]['chapterIdB'] == mydata[p]['data'][0]['chapters'][n]['children'][q]['chapterId']) || (!isEmpty(Queue[s]['chapteridb']) && Queue[s]['chapteridb'] == mydata[p]['data'][0]['chapters'][n]['children'][q]['chapterId'])) {
                                                        Queue.splice(s, 1);
                                                        break;
                                                    }
                                                }
                                                if (downed) {
                                                    var chapterB = downed['chapterIdB'];
                                                    if (!isEmpty(mydata[p]['data'][0]['chapters'][n]['children'][q]['chapterId']) && mydata[p]['data'][0]['chapters'][n]['children'][q]['chapterId'] == chapterB) {
                                                        is_del_downed=true;
                                                        var jsfun = 'down_stop(function(){});';
                                                        api.execScript({
                                                            name: 'root',
                                                            script: jsfun
                                                        });
                                                    }
                                                }
                                                $api.rmStorage(memberId + mydata[p]['data'][0]['chapters'][n]['children'][q]['chapterId'] + 'progress');//B
                                            }
                                            //三级章节存在
                                            if(!isEmpty(mydata[p]['data'][0]['chapters'][n]['children'][q]['children'])){
                                                for(var u in mydata[p]['data'][0]['chapters'][n]['children'][q]['children']){
                                                    if(!isEmpty(mydata[p]['data'][0]['chapters'][n]['children'][q]['children'][u]['chapterId']) && in_array(mydata[p]['data'][0]['chapters'][n]['children'][q]['children'][u]['chapterId'],chapterc)){
                                                        for (var y in Queue) {
                                                            if ((!isEmpty(Queue[y]['chapterIdC']) && Queue[y]['chapterIdC'] == mydata[p]['data'][0]['chapters'][n]['children'][q]['children'][u]['chapterId']) || (!isEmpty(Queue[y]['chapteridc']) && Queue[y]['chapteridc'] == mydata[p]['data'][0]['chapters'][n]['children'][q]['children'][u]['chapterId'])) {
                                                                Queue.splice(y, 1);
                                                                break;
                                                            }
                                                        }
                                                        if (downed) {
                                                            var chapterC = downed['chapterIdC'];
                                                            if (!isEmpty(mydata[p]['data'][0]['chapters'][n]['children'][q]['children'][u]['chapterId']) && mydata[p]['data'][0]['chapters'][n]['children'][q]['children'][u]['chapterId'] == chapterC) {
                                                                is_del_downed=true;
                                                                var jsfun = 'down_stop(function(){});';
                                                                api.execScript({
                                                                    name: 'root',
                                                                    script: jsfun
                                                                });
                                                            }
                                                        }
                                                        $api.rmStorage(memberId + mydata[p]['data'][0]['chapters'][n]['children'][q]['children'][u]['chapterId'] + 'progress');//C
                                                    }
                                                }
                                            }
                                        }
                                }
                            }
                        }
                    }
                }
                write_file(memberId + 'Queue.db', JSON.stringify(Queue), function(ret, err) {
                    //队列内容删除完毕删除下载视频内容
                    var ccids = [];
                    $.each($('.down_data'), function(k, v) {
                        if ($(v).siblings('.icon-check').hasClass('active')) {
                            var down_data = JSON.parse($.trim($(v).html()));
                            var course_obj = $(v).siblings('.down-progress');
                            var CourseId = course_obj.attr('courseid');
                            var chapterIdA = course_obj.attr('chapterida');
                            var chapterIdB = course_obj.attr('chapteridb');
                            var chapterIdC = course_obj.attr('chapteridc');
                            var data = isEmpty($api.getStorage('cahce_data'+memberId + CourseId)) ? '' : $api.getStorage('cahce_data'+memberId + CourseId);


                            for (var p in down_data) {

                                if (down_data[p]['taskType'] == 'video') {

                                    if (data && typeof data[chapterIdA] != "undefined" &&
                                        typeof data[chapterIdA][down_data[p]['videoCcid']] != "undefined" )
                                    {
                                        delete data[chapterIdA][down_data[p]['videoCcid']];
                                    }

                                    if (data && typeof data[chapterIdA] != "undefined" &&
                                        typeof data[chapterIdA][chapterIdB] != "undefined" &&
                                        typeof data[chapterIdA][chapterIdB][down_data[p]['videoCcid']] != "undefined")
                                    {
                                        delete data[chapterIdA][chapterIdB][down_data[p]['videoCcid']];
                                    }



                                    if (data && typeof data[chapterIdA] != "undefined" &&
                                        typeof data[chapterIdA][chapterIdB] != "undefined" &&
                                        typeof data[chapterIdA][chapterIdB][chapterIdC] != "undefined"&&
                                        typeof data[chapterIdA][chapterIdB][chapterIdC][down_data[p]['videoCcid']] != "undefined"
                                    )
                                    {
                                        delete data[chapterIdA][chapterIdB][chapterIdC][down_data[p]['videoCcid']];
                                    }



                                    $api.setStorage('cahce_data'+memberId + CourseId, data);
                                    ccids.push(down_data[p]['videoCcid']);

                                }
                            }
                        }
                    });
                    var jsfun = "rmVideo('"+JSON.stringify(ccids)+"');";
                    api.execScript({
                        name: 'root',
                        script: jsfun
                    });
                    setTimeout(function(){
                        var mydowned = isEmpty($api.getStorage(memberId + 'downed')) ? '' : $api.getStorage(memberId + 'downed');
                        if(is_del_downed && mydowned){
                            var chapterIdA = isEmpty(mydowned['chapterIdA']) ? '': mydowned['chapterIdA'];
                            var chapterIdB = isEmpty(mydowned['chapterIdB']) ? '': mydowned['chapterIdB'];
                            var chapterIdC = isEmpty(mydowned['chapterIdC']) ? '': mydowned['chapterIdC'];
                            if (cache_model == null) {
                                cache_model = api.require('lbbVideo');
                            }
                            cache_model.downloadStop(function(ret, err) {
                                //一级章节下载记录
                                if(!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)){
                                    $api.rmStorage(memberId + chapterIdA+'progress');
                                }
                                //二级章节下载记录
                                if(!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)){
                                    $api.rmStorage(memberId + chapterIdB+'progress');
                                }
                                //三级章节下载记录
                                if(!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)){
                                    api.rmStorage(memberId + chapterIdC+'progress');
                                }
                                $api.rmStorage(memberId + 'downed')
                            });
                        }
                        api.sendEvent({
                            name : "flush_catalog"
                        });
                        api.sendEvent({
                            name : "cancle_del"
                        });
                        //获取新内容
                        mydata = [];
                        get_data();
                    },1000);
                });
            });
        } else if (ret.value.sethomepage == 2) {//取消
            $('body').removeClass('checking');
            $('.icon-check').removeClass('active');
        } else if (ret.value.sethomepage == 3) {//全选
            $('.icon-check').addClass('active');
        }
    });
};
var course_detail;
function next(leave, num1, num2, num3,courseId,obj) {
        //如果没有缓存信息，就从接口获取
        var tmp_course_detail = $api.getStorage(courseId);
        if (isEmpty(tmp_course_detail)) {
            //获取课程的详细信息
            //api/v2.1/course/courseDetail，接口编号：004-006
            ajaxRequest('api/v2.1/course/courseDetail', 'get', {
                courseId: courseId
            }, function (ret, err) {//004.006获取课程的详细信息
                if (err) {
                    api.hideProgress();
                    api.toast({
                        msg: err.msg,
                        location: 'middle'
                    });
                    return false;
                }
                if (ret && ret.state == 'success') {
                    if (!ret.data) {
                        api.toast({
                            msg: '暂无任务',
                            location: 'middle'
                        });
                        return false;
                    }
                    course_detail = ret.data[0];
                    //课程详情数据
                    $api.setStorage(courseId, course_detail);
                    var res_process = {
                        'oneChapterIndex': num1,//一级章节索引
                        'twoChapterIndex': (num2 == -1) ? 0 : num2,//二级章节索引
                        'threeChapterIndex': (num3 == -1) ? 0 : num3,//三级章节索引
                        'taskIndex': 0,//任务索引
                        'chapterDeep': leave - 1,//章节层级
                        'progress': 0//任务学习进度
                    };
                    judge_task(res_process);
                }
            });
        } else {
            course_detail = tmp_course_detail;
            //存储课程详细信息
            var res_process = {
                'oneChapterIndex': num1,//一级章节索引
                'twoChapterIndex': (num2 == -1) ? 0 : num2,//二级章节索引
                'threeChapterIndex': (num3 == -1) ? 0 : num3,//三级章节索引
                'taskIndex': 0,//任务索引
                'chapterDeep': leave - 1,//章节层级
                'progress': 0//任务学习进度
            };
            judge_task(res_process);
            //用户上次学习进度数据
        }
}
//判断任务类型，跳转相应的页面
function judge_task(res_process) {
    if (isEmpty(course_detail) || isEmpty(course_detail.chapters) || isEmpty(res_process)) {
        api.toast({
            msg: '暂无任务',
            location: 'middle'
        });
        return false;
    }

    //获取章节信息
    if (res_process.chapterDeep >= 0) {
        var chapters_info = course_detail.chapters[res_process.oneChapterIndex];//一级章节信息
    }
    if (res_process.chapterDeep >= 1) {
        var chapters_info = chapters_info.children[res_process.twoChapterIndex];//二级章节信息
    }
    if (res_process.chapterDeep >= 2) {
        var chapters_info = chapters_info.children[res_process.threeChapterIndex];//三级章节信息
    }

    if (isEmpty(chapters_info) || isEmpty(chapters_info.tasks)) {
        api.toast({
            msg: '暂无任务',
            location: 'middle'
        });
        return false;
    }
    var task_info = chapters_info.tasks[res_process.taskIndex];//当前任务信息
    if (isEmpty(task_info)) {
        api.toast({
            msg: '暂无任务',
            location: 'middle'
        });
        return false;
    }
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
            msg: '暂无任务，请稍后再试或联系客服',
            location: 'middle'
        });
        return false;
    }
    //需要传递的参数
    var pageParams = {
        from: 'course-studying',
        courseId: course_detail.courseId,//课程id
        study_progress: res_process,//学习进度
        course_detail: course_detail,//课程详情
        task_info: task_info,//当前要学习的任务信息,
        type:'task'
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