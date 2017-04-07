
var course_detail;
var pageName = 'catalog';
var total = 0;

var getStatusTime = null;
var videoDownInfo =new Object(); //缓存每个节点的下载状态，一个节点一个id
var videochangelist = $api.getStorage("videochangelist") ? $api.getStorage("videochangelist") : ""; //记录每次定时器和数据库同步数据后发生改变的dom节点id
var couselist = ""; //记录缓存包括的课程id
var lastgettime = 1388509261;//记录每次获取数据库的时间点，下次获取就只获取该时间点之后变化的记录(第一次获取可以获取2014年1月1日1时1分1秒//)

function getData() {
    /*
如果有删除操作需要重新刷新页面
如果界面有开始下载，下载暂停操作，可直接临时改变界面dom节点状态，是否成功由定时器后续统一更新界面
*/


/*
videoDownInfo["a1"] = {};
videoDownInfo["a1"].progress =12;
videoDownInfo["a1"].tasknum =2; 
videoDownInfo["b3"] = {};
videoDownInfo["b3"].progress =12;
videoDownInfo["b3"].tasknum =2; 
videoDownInfo["c4"] = {};
videoDownInfo["c4"].progress =40;
videoDownInfo["c4"].tasknum =1; 
*/


function getdownrecord(){
    //读取数据库下载记录，注意读取时间,返回的记录按照时间进行正排序,进度和state为数字，path用／分隔
    //state:0:停止  1:等待  2:下载中  3: 下载完成
    //------------------获取lastgettime-2时间点之后变化的记录 sqllite时间戳转时间: datetime(1377168853, 'unixepoch', 'localtime');--------------------------
    // var saverecord ="{\"readTime\":1483203661,\"data\":[";
    // saverecord += "{\"state\":2,\"progress\":10,\"path\":\"a/b/c/d/ed/f\"}";
    // saverecord += ",{\"state\":1,\"progress\":20,\"path\":\"a/b/c1\"}";
    // saverecord += ",{\"state\":2,\"progress\":50,\"path\":\"a3/b1/c2\"}";
    // saverecord += ",{\"state\":1,\"progress\":30,\"path\":\"a/b2/c3\"}";
    // saverecord += ",{\"state\":3,\"progress\":100,\"path\":\"a1/b3/c4\"}";
    // saverecord += ",{\"state\":3,\"progress\":100,\"path\":\"a/b2/c3\"}";
    // saverecord += "]}";
    
    cache_model = api.require('lbbVideo');
    var param = {
        "userId" : getstor('memberId'),
        "readTime" : lastgettime
    }
    cache_model.getTaskData(param,function(ret,err){
        //------------------结束获取--------------------------
        var saverecordObj = JSON.parse(ret.data);
        // alert(JSON.stringify(ret))
        ///设置下一次读取下载的某个时间之后变化的所有记录
        lastgettime = saverecordObj.readTime;
        //循环处理每一条返回的下载记录，并统计分析最后变化值
        for(i=0;i< saverecordObj.data.length;i++){
            procRecord(saverecordObj.data[i]);
        }
    })
    
}

function procRecord(videorecord){
    var strs=videorecord.path.split("//"); //字符分割
    var pathlen = strs.length;
    if( pathlen < 2 ) return "";
    //判断是否是新课程
    if(couselist.indexOf(strs[0]) < 0){
        couselist = couselist + "," + strs[0];
    }

    //判断是否新任务
    if(videoDownInfo[strs[pathlen-1]]){
        //判断任务状态是否有变化
        if(videoDownInfo[strs[pathlen-1]].progress != videorecord.progress || videoDownInfo[strs[pathlen-1]].status != videorecord.state){
            //有变化
            for (j=0; j<pathlen;j++ ){
                //节点id放入已变化id集合
                if(videochangelist.indexOf(strs[j]) < 0){
                    videochangelist = videochangelist + "," + strs[j];
                }
                //更新进度，已有任务变更: (当前进度*任务数量+(当前任务新进度-当前任务老进度)/(任务数量)
                videoDownInfo[strs[j]].progress =(videoDownInfo[strs[j]].progress*videoDownInfo[strs[j]].tasknum+(videorecord.progress-videoDownInfo[strs[pathlen-1]].progress))/videoDownInfo[strs[j]].tasknum;
                //如果子节点有一个处于下载，则为下载，如果没有，如果有一个在队列，则为队列，如果没有，则为停止，如果全部下载完成，则为下载完成
                //0:停止  1:等待  2:下载中  3: 下载完成
                //以下节点下载状态叶子节点是准的,父节点不准,没考虑其它子节点的下载状态
                if(videoDownInfo[strs[j]].progress == 100 || videoDownInfo[strs[j]].status == 4){
                    videoDownInfo[strs[j]].status = 4;
                }else{
                    videoDownInfo[strs[j]].status = videorecord.state;
                }
            }
        }

    }else{
        //新任务处理
        for (j=0; j<pathlen;j++ ){
            //判断path各个节点是否存在
            if(!videoDownInfo[strs[j]]){
                videoDownInfo[strs[j]] = {};
                videoDownInfo[strs[j]].progress =0;
                videoDownInfo[strs[j]].tasknum =0;
                videoDownInfo[strs[j]].status = 0;
            }
            //节点id放入已变化id集合
            if(videochangelist.indexOf(strs[j]) < 0){
                videochangelist = videochangelist + "," + strs[j];
            }
            //更新进度，新下载任务: (当前进度*任务数量+新任务进度)/(任务数量+1)
            videoDownInfo[strs[j]].progress =(videoDownInfo[strs[j]].progress*videoDownInfo[strs[j]].tasknum+videorecord.progress)/(videoDownInfo[strs[j]].tasknum+1);
            videoDownInfo[strs[j]].tasknum ++;
            //如果子节点有一个处于下载，则为下载，如果没有，如果有一个在队列，则为队列，如果没有，则为停止，如果全部下载完成，则为下载完成
            //0:停止  1:等待  2:下载中  3: 下载完成
            //以下节点下载状态叶子节点是准的,父节点不准,没考虑其它子节点的下载状态
            if(videoDownInfo[strs[j]].progress == 100 || videoDownInfo[strs[j]].status == 4){
                videoDownInfo[strs[j]].status = 4;
            }else{
                videoDownInfo[strs[j]].status = videorecord.state;
            }
        }

    }
    $api.setStorage("videochangelist",videochangelist);
    initDomDownStatus();
}

//更新界面下载状态有变化的下载节点
function initDomDownStatus(){
    if(isEmpty($api.getStorage("videochangelist"))){
        return false;
    }

    var strs = $api.getStorage("videochangelist").split(","); //字符分割
    var pathlen = strs.length;
    //从1开始，因为拼接videochangelist的时候用,开始的
    // alert(strs+"====="+JSON.stringify(videoDownInfo))
    for (j=1; j<pathlen;j++ ){
        var domInfo = videoDownInfo[strs[j]];
        var domid = strs[j];
        // alert(JSON.stringify(domInfo))
    
        if(!isEmpty(domInfo)){
            var domprogress = videoDownInfo[strs[j]].progress;
            var domstatus = videoDownInfo[strs[j]].status;
            var domtasknum = videoDownInfo[strs[j]].tasknum;
            // ------------------设置界面对应id节点dom下载状态，并设置为可见--------------------------
            $(".task"+domid).attr("type",domstatus);
            $(".task"+domid).find(".val").html(domprogress);
            // alert($(".task"+domid).html())
        }    
    }
    //处理圈圈
    isSolidcircle('circle', '', '');
    init_process();
    //------------------设置结束--------------------------
    // console.log(strs[j]);
    // console.log(domInfo);
}

//初始化下载界面，但是所有节点hidden
function initDom(){
    if(api.connectionType == 'none' || api.connectionType == 'unknown'){
        // api.toast({
        //     msg : '网络已断开，请检查网络状态',
        //     location : 'middle'
        // });
        cache_model.getCourseTaskWithCourseId({"userId":getstor('memberId'),"courseId":api.pageParam.course_id},function(ret,err){
                var ret_data = JSON.parse(ret.data.courseJson);
                course_detail = ret_data[0];
                if (isEmpty(ret_data)) {
                    $('body').addClass('null');
                    return false;
                }
                var tpl = $('#tpl').html();
                var content = doT.template(tpl);
                //课程状态
                getVersionId(ret_data[0])

                api.getFreeDiskSpace(function(ret, err) {
                    var size = (ret.size / 1000 / 1000).toFixed(2);
                    var htm = "<div class='avaiace'  onclick='to_cache()'><span class='manage'>课程缓存管理</span><p class='space'>可用空间" + size + "MB<span></span></p></div>";
                    htm = htm + content(ret_data[0]);
                    $('#content').html(htm);
                    initDomDownStatus();
                    // setTask();
                    //处理圈圈
                    isSolidcircle('circle', '', '');
                    init_process();
                });
                
            })
    }else{
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

             //课程状态
             getVersionId(ret_data[0]);

             api.getFreeDiskSpace(function(ret, err) {
                 var size = (ret.size / 1000 / 1000).toFixed(2);
                 var htm = "<div class='avaiace'  onclick='to_cache()'><span class='manage'>课程缓存管理</span><p class='space'>可用空间" + size + "MB<span></span></p></div>";
                 htm = htm + content(ret_data[0]);
                 $('#content').html(htm);
                 initDomDownStatus();
                 //处理圈圈
                 isSolidcircle('circle', '', '');
                 init_process();
             });
         } else {
             api.toast({
                 msg : ret.msg,
                 location : 'middle'
             });
         }
     });
    }
    

    // var strs=couselist.split(","); //字符分割
    // var pathlen = strs.length;
    // //从1开始，因为拼接videochangelist的时候用,开始的
    // for (j=1; j<pathlen;j++ ){
    //     var courseId = strs[j];
    //     //------------------根据课程id获取对应缓存课程的章节详情，如果在线，从服务器获取，否则本地数据库获取--------------------------
    //     var cid = api.pageParam.course_id;

    //     //
    //     //------------------设置结束--------------------------
    //     console.log(courseId);
    //     //------------------获取完毕后拼接html并置入界面，拼接时需要设置每个id对于dom元素都不可见--------------------------
    //     //
    //     //------------------设置结束--------------------------
    // } 
}

clearInterval(getStatusTime);
//1:获取所有下载记录并解析
getdownrecord();
//2:根据couselist获取所有缓存课程的章节详情，如果在线，从服务器获取，否则本地数据库获取
initDom();

getStatusTime = setInterval(function(){
    getdownrecord();
},2000)
//3:定时器调用获取变化的数据，并调整界面下载状态
// getdownrecord();
//
//根据分析统计结果更新界面dom节点的显示状态
// initDomDownStatus();


// var data={"categoryIndex":5,"createTime":1433472737,"effectiveDay":180,"taskTotal":"61","chapters":[{"chapterTitle":"INTRODUCTION","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"chapterId":"ff8080814db86d41014dc1a2201604d1","isFree":"false","knowledgePointId":null,"children":[{"chapterTitle":"F3-课程介绍","isLeaf":"true","tasks":[{"attachmentPath":"","videoCcid":"97B707513FA2E2BF9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":351,"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","title":"F3-课程介绍","taskId":"ff8080814db86d41014dc1a2202004d3","taskType":"video","taskLevel":null,"id":"ff808081482a031501482a1a7d0a0007"}],"chapterFiles":null,"chapterExtends":null,"chapterId":"ff8080814db86d41014dc1a2201a04d2","isFree":"true","knowledgePointId":null,"children":null}]},{"chapterTitle":"正式课程","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"chapterId":"ff8080814db86d41014dc1a2202304d4","isFree":"false","knowledgePointId":null,"children":[{"chapterTitle":"Chapter1 Introduction of Accounting","isLeaf":"true","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter1 Introduction of Accounting-1.pdf","videoCcid":"C4B7B80330064C859C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":2224,"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","title":"Chapter1 Introduction of Accounting-1","taskId":"ff8080814db86d41014dc1a2202d04d6","taskType":"video","taskLevel":null,"id":"ff808081473905e701477c5ae3fe00eb"},{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter1 Introduction of Accounting-2.pdf","videoCcid":"8E9A8B616E045DF59C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":1492,"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","title":"Chapter1 Introduction of Accounting-2","taskId":"ff8080814db86d41014dc1a2203504d8","taskType":"video","taskLevel":null,"id":"ff80808147c904170147d21f65600079"},{"examUrl":"/exam/examination/examinationTask/8a22ecb555af683b0155b50afb2f0085","totalCount":4,"difficulty":"简单","examenType":"chapter","title":"ACCA F3 Financial Accounting-CH1章节测评","taskId":"8a22ecb555af683b0155b50cb060008a","taskType":"exam","taskLevel":null,"id":"8a22ecb555af683b0155b50afb2f0085"}],"chapterFiles":null,"chapterExtends":null,"chapterId":"ff8080814db86d41014dc1a2202704d5","isFree":"true","knowledgePointId":null,"children":null},{"chapterTitle":"Chapter2 The Regulatory and Concept Framework","isLeaf":"true","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter2 The Regulatory and Concept Framework-1.pdf","videoCcid":"3E3959948BF8677E9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":2185,"apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","title":"Chapter2 The Regulatory and Concept Framework-1","taskId":"ff8080814db86d41014dc1a2203e04db","taskType":"video","taskLevel":null,"id":"ff808081473905e701477c5b401000ec"},{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter10 Control Accounts-2.pdf","videoCcid":"B43B1DD7B8F597629C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":1564,"apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","title":"Chapter2 The Regulatory and Concept Framework-2","taskId":"ff8080814db86d41014dc1a2204604dd","taskType":"video","taskLevel":null,"id":"ff80808147c904170147d2256b03007a"},{"examUrl":"/exam/examination/examinationTask/8a22ecb555af683b0155b50a9576007b","totalCount":9,"difficulty":"简单","examenType":"chapter","title":"ACCA F3 Financial Accounting-CH2章节测评","taskId":"8a22ecb555af683b0155b50cfdd2008b","taskType":"exam","taskLevel":null,"id":"8a22ecb555af683b0155b50a9576007b"}],"chapterFiles":null,"chapterExtends":null,"chapterId":"ff8080814db86d41014dc1a2203804da","isFree":"false","knowledgePointId":null,"children":null},{"chapterTitle":"Chapter3 The Financial Statements","isLeaf":"true","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter16 Consolidated Financial Statements - 1.pdf","videoCcid":"AEC37E349BA8E3479C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":1931,"apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","title":"Chapter16 Consolidated Financial Statements - 1","taskId":"ff8080814db86d41014dc1a221a0052e","taskType":"video","taskLevel":null,"id":"ff808081473905e701477c5f682400fa"},{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter16 Consolidated Financial Statements - 2.pdf","videoCcid":"2BE1ADC6A344C3829C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":3302,"apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","title":"Chapter16 Consolidated Financial Statements - 2","taskId":"ff8080814db86d41014dc1a221a90530","taskType":"video","taskLevel":null,"id":"ff808081482a031501482b1001e4007d"},{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter16 Consolidated Financial Statements - 3.pdf","videoCcid":"98C54DE226AEF2829C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":3562,"apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","title":"Chapter16 Consolidated Financial Statements - 3","taskId":"ff8080814db86d41014dc1a221b20532","taskType":"video","taskLevel":null,"id":"ff808081482a031501482b11069a007e"},{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter16 Consolidated Financial Statements - 4.pdf","videoCcid":"F6671BBED1854FE59C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":1789,"apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","title":"Chapter16 Consolidated Financial Statements - 4","taskId":"ff8080814db86d41014dc1a221ba0534","taskType":"video","taskLevel":null,"id":"ff808081482a031501482b127833007f"},{"examUrl":"/exam/examination/examinationTask/8a22ecb555af683b0155b9d60d4d0112","totalCount":6,"difficulty":"中等","examenType":"chapter","title":"ACCA F3 Financial Accounting-CH16章节测评","taskId":"8a22ecb555af683b0155b9f2f34b0122","taskType":"exam","taskLevel":null,"id":"8a22ecb555af683b0155b9d60d4d0112"}],"chapterFiles":null,"chapterExtends":null,"chapterId":"ff8080814db86d41014dc1a2219a052d","isFree":"false","knowledgePointId":null,"children":null},{"chapterTitle":"Chapter17 Interpretation of Financial Statements","isLeaf":"true","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F3/ACCA F3 Financial Accounting/02-ACCA-F3-讲义-基础--Chapter17 Interpretation of Financial Statements.pdf","videoCcid":"7CA23C487567C0A49C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":2631,"apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","title":"Chapter17 Interpretation of Financial Statements","taskId":"ff8080814db86d41014dc1a221c30536","taskType":"video","taskLevel":null,"id":"ff808081473905e701477c5fc17200fb"},{"examUrl":"/exam/examination/examinationTask/8a22ecb555af683b0155b9dfb5de0119","totalCount":6,"difficulty":"中等","examenType":"chapter","title":"ACCA F3 Financial Accounting-CH17章节测评","taskId":"8a22ecb555af683b0155b9f352fa0123","taskType":"exam","taskLevel":null,"id":"8a22ecb555af683b0155b9dfb5de0119"}],"chapterFiles":null,"chapterExtends":null,"chapterId":"ff8080814db86d41014dc1a221bd0535","isFree":"false","knowledgePointId":null,"children":null}]}],"coverPath":"/upload/201502/fb9f1cfc2911499da1666e8aa5383d47.jpg","courseId":"ff8080814db86d41014dc1a2200f04d0","outline":"","teacherName":"Cindy Deng","taskNum":"61","categoryName":"ACCA","subjectName":"F3","courseIndex":5,"teacherHonor":"ACCA资深会员,金牌讲师","availability":"","categoryId":"ff808081473905e701475cd3c2080001","bigCoverPath":"/upload/201607/e00d91d12a1d451fbc59adf11c17b0af.png","chapterNum":"36","knowledgePointId":"","courseModuleType":"KNOWLEDGE_MODULE","aim":"<p>\r\n\t<span>作为初级阶段的课程，F3可能对有些同学而言会感觉比其它两门稍难，特别是对于一些毫无会计基础的同学来说，或许有些知识点存在一个所谓入门的过程。根据以往接触到的大量学员的情况来看，好多学生反而是在经历了一段茫然困惑之后豁然开朗，并且自此爱上了财务会计。只要你想弄通，没有想不通的问题。关键是，坚持不放弃！</span> \r\n</p>\r\n<p>\r\n\t<br />\r\n</p>","teacherImage":"/upload/201606/448ebf46b76e43158d1431d94c90836a.png","subjectId":"ff808081473905e701476252b4390073","versionId":"ff808081473905e7014762700dfa0081","courseBackgroundImage":"/upload/201502/fb9f1cfc2911499da1666e8aa5383d47.jpg","subjectIndex":4,"courseName":"ACCA F3 Financial Accounting","lastModifyTime":1433472}
//             var tpl = $('#tpl').html();
//     var content = doT.template(tpl);
//     $('#content').html(content(data));
//     setTask();
//     isSolidcircle('circle', '', '');
//     init_process();
    
 
    
    $('.bewrite .bewtitl').parent().siblings().css({
		height : '0px'
	});
}
function setTask(){
    //console.log( $(".down_data"))
    $(".down_data").each(function(){
        var videoId = JSON.parse($(this).html()).videoCcid;
        get_dowm2(videoId);
        init_process();
    })
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
    // var downed = $api.getStorage(memberId+'downed');
    // if (downed) {
    //     var chapterIdA = get_loc_val(memberId + 'downed', 'chapterIdA'),
    //         chapterIdB = get_loc_val(memberId + 'downed', 'chapterIdB'),
    //         chapterIdC = get_loc_val(memberId + 'downed', 'chapterIdC'), 
    //         progress = get_loc_val(memberId + 'downed', 'progress');
    //     var id='';
    //     //一级章节下载记录
    //     if(!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)){
    //         id=chapterIdA;
    //     }
    //     //二级章节下载记录
    //     if(!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)){
    //         id=chapterIdB;
    //     }
    //     //三级章节下载记录
    //     if(!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)){
    //         id=chapterIdC;
    //     }

    //     if (progress == 100) {
    //         $("#" + id).attr({
    //             'type' : 4
    //         });
    //     } else {
    //         $("#" + id).attr({
    //             'type' : 1
    //         });
    //     }
    // }else{
    //     $('.down-progress[type="1"]').attr({
    //         type : 2
    //     });
    // }
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
    var type = data.type, 
        chapterIdA = isEmpty(data.chapterIdA) ? '' : data.chapterIdA,
        chapterIdB = isEmpty(data.chapterIdB) ? '' : data.chapterIdB,
        chapterIdC = isEmpty(data.chapterIdC) ? '' : data.chapterIdC,
        item = data.item;
    var id='';
    //一级章节下载记录
    if(!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) id=chapterIdA;
    //二级章节下载记录
    if(!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) id=chapterIdB;
    //三级章节下载记录
    if(!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) id=chapterIdC;
    // var obj = $('#' + id);
    var obj = $('.task' + item);
    // alert(type)
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
        case '5':
        case 5:
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
            $(obj).attr({
                type : 1
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
            // $(obj).attr({
            //     type : 1
            // });
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

function getVersionId(data){
    var versionId = data.versionId;
    var coursestatus ={};
    ajaxRequest('api/v2.1/study/coursestatus', 'get',{"token":$api.getStorage('token'),"versionId":versionId}, function(ret, err) {
        if(ret.state == "success"){
            var lockStatusNum = 0;
            for(var i=0;i<ret.data.length;i++){
                if(ret.data[i].lockStatus == 0){
                    lockStatusNum = i;
                }   
            }
            coursestatus.islock = ret.data[lockStatusNum].lockStatus;
            coursestatus.activestate = ret.data[lockStatusNum].activeState;
            coursestatus.expirationTime = ret.data[lockStatusNum].expirationTime;
            if(ret.data[lockStatusNum].activeState == "acitve"){
                coursestatus.isbuy = 1;
            }                   
            $api.setStorage("coursestatus"+versionId,coursestatus)
        }
    })
} 

//getData();
apiready = function() {
//     var memberId= getstor('memberId');
//         var key = memberId+"progressE5A74B901F5675EF9C33DC5901307461";
//         var progress = $api.getStorage(key);
// alert(progress)

    // api.addEventListener({
    //     name : 'DOWN'
    // }, function(ret) {
    //    api.toast({
    //        msg:JSON.stringify(ret.value),
    //        location:'middle'
    //    })
    // });
    // api.pageParam : {"course_id":"ff8080814dad5062014db32051b801a2","categoryId":"ff808081473905e701475cd3c2080001"}
    // updateTasksProgress(api.pageParam.course_id,function(data){

    // });
    saveTasksProgress.getCourseTaskProgress([api.pageParam.course_id]);
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
            var chapterIdA = get_loc_val(memberId + 'downed', 'chapterIdA'),
                chapterIdB = get_loc_val(memberId + 'downed', 'chapterIdB'),
                chapterIdC = get_loc_val(memberId + 'downed', 'chapterIdC'), 
                progress = get_loc_val(memberId + 'downed', 'progress');
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
