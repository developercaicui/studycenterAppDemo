var course_detail;
var pageName = 'catalog';
var total = 0;
var task_arr;
var courseId; //课程id

var is_debug = false;
    var getStatusTime = null;
    var videoDownInfo =new Object(); //缓存每个节点的下载状态，一个节点一个id
    var videochangelist = $api.getStorage("videochangelist") ? $api.getStorage("videochangelist") : ""; //记录每次定时器和数据库同步数据后发生改变的dom节点id
    var couselist = ""; //记录缓存包括的课程id
    var lastgettime = 1388509261;//记录每次获取数据库的时间点，下次获取就只获取该时间点之后变化的记录(第一次获取可以获取2014年1月1日1时1分1秒//)


    function tasksCache(){
        if(is_debug){
          var arr = {"createTime":1476694332,"effectiveDay":280,"taskTotal":"35","chapters":[{"chapterId":"8a22ecb557d16e020157d1e4beb11e02","isFree":"false","knowledgePointId":"402890814d6f6abb014d6fe6d3340020","chapterTitle":"CMA Part1 财务规划 绩效与控制","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"chapterId":"8a22ecb557d16e020157d1e5ba0c1e04","isFree":"false","knowledgePointId":"402890814d6f6abb014d6fe6d3340020","chapterTitle":"第一章：规划、预算编制与预测","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"chapterId":"8a22ecb557d16e020157d1e625771e06","isFree":"false","knowledgePointId":"402890814d6f6abb014d6fe6d33c0022","chapterTitle":"知识点1 战略规划概述","isLeaf":"true","tasks":[{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"DE3A00C3A7FF861F9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":787,"attachmentPath":"","express":null,"taskLevel":null,"title":"战略规划概述-a ","taskId":"8a22ecb557d16e020157d1f31cfd1e2a","taskType":"video","id":"8a22ecb557c831f00157d0a032a80025"},{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"C0120B91BFC60E0E9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":242,"attachmentPath":"","express":null,"taskLevel":null,"title":"战略规划概述-c-测评练习","taskId":"8a22ecb557d16e020157d1f34c391e2b","taskType":"video","id":"8a22ecb557c831f00157d09d9e0c0016"},{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"0A7E6A7E2F0BA1149C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":642,"attachmentPath":"","express":null,"taskLevel":null,"title":"战略规划概述-b","taskId":"8a22ecb557d16e020157d1f787a81e2c","taskType":"video","id":"8a22ecb557c831f00157d0a05dca0029"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb557d16e020157d1e64ade1e07","isFree":"false","knowledgePointId":null,"chapterTitle":"知识点2 波特五因素分析","isLeaf":"true","tasks":[{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"0220492CC48596859C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":397,"attachmentPath":"","express":null,"taskLevel":null,"title":"第二章 课程介绍 ","taskId":"8a22ecb557d16e020157d1f0e1341e24","taskType":"video","id":"8a22ecb557c831f00157d0b040750034"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb557d16e020157d1eae03e1e15","isFree":"false","knowledgePointId":null,"chapterTitle":"知识点1 中期资本来源（上）","isLeaf":"true","tasks":[{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"CFC5106735F2F3389C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":585,"attachmentPath":"","express":null,"taskLevel":null,"title":"中期资本来源（上） ","taskId":"8a22ecb557d16e020157d1f00c7e1e22","taskType":"video","id":"8a22ecb557c831f00157d0b1b836003e"},{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"D668F1964D5A6BAB9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":176,"attachmentPath":"","express":null,"taskLevel":null,"title":"中期资本来源（上）-测评题","taskId":"8a22ecb557d16e020157d1f03f9c1e23","taskType":"video","id":"8a22ecb557c831f00157d0b1946b003d"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb557d16e020157d1eb09a11e16","isFree":"false","knowledgePointId":null,"chapterTitle":"知识点2 中期资本来源（下）","isLeaf":"true","tasks":[{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"598F755DD2833A279C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":1468,"attachmentPath":"","express":null,"taskLevel":null,"title":"中期资本来源（下）","taskId":"8a22ecb557d16e020157d1ef9d261e20","taskType":"video","id":"8a22ecb557c831f00157d0b170f2003c"},{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"3CA6D172C3C24B7D9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":537,"attachmentPath":"","express":null,"taskLevel":null,"title":"中期资本来源（下）-测评题","taskId":"8a22ecb557d16e020157d1efce4e1e21","taskType":"video","id":"8a22ecb557c831f00157d0b14332003b"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb557d16e020157d1eb38de1e17","isFree":"false","knowledgePointId":null,"chapterTitle":"知识点3 其它长期资本来源","isLeaf":"true","tasks":[{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"179B3B26723230369C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":325,"attachmentPath":"","express":null,"taskLevel":null,"title":"其它长期资本来源","taskId":"8a22ecb557d16e020157d1ee0bd11e1e","taskType":"video","id":"8a22ecb557c831f00157d0b11b6a003a"},{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"F51F67EAD64454829C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":270,"attachmentPath":"","express":null,"taskLevel":null,"title":"其它长期资本来源-测评题","taskId":"8a22ecb557d16e020157d1ee3c341e1f","taskType":"video","id":"8a22ecb557c831f00157d0b0f8200039"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb557d16e020157d1eb5c941e18","isFree":"false","knowledgePointId":null,"chapterTitle":"知识点4 资本筹集中需要考虑的其他问题（上）","isLeaf":"true","tasks":[{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"00E32C45278A31769C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":673,"attachmentPath":"","express":null,"taskLevel":null,"title":"资本筹集中需要考虑的其他问题（上）","taskId":"8a22ecb557d16e020157d1ed5f381e1c","taskType":"video","id":"8a22ecb557c831f00157d0b0d0c00038"},{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"97EEE0B1E5641AC09C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":291,"attachmentPath":"","express":null,"taskLevel":null,"title":"资本筹集中需要考虑的其他问题（上）-测评题 ","taskId":"8a22ecb557d16e020157d1ed8f8f1e1d","taskType":"video","id":"8a22ecb557c831f00157d0b0ab850037"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb557d16e020157d1eb93571e19","isFree":"false","knowledgePointId":null,"chapterTitle":"知识点5 资本筹集中需要考虑的其他问题（下）","isLeaf":"true","tasks":[{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"4ED3EADD1827E0BD9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":1017,"attachmentPath":"","express":null,"taskLevel":null,"title":"资本筹集中需要考虑的其他问题（下） ","taskId":"8a22ecb557d16e020157d1ec6dc91e1a","taskType":"video","id":"8a22ecb557c831f00157d0b08a9e0036"},{"apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"0583C9FC0E64DA2B9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":288,"attachmentPath":"","express":null,"taskLevel":null,"title":"资本筹集中需要考虑的其他问题（下）-测评题 ","taskId":"8a22ecb557d16e020157d1ec9f121e1b","taskType":"video","id":"8a22ecb557c831f00157d0b064f00035"}],"chapterFiles":null,"chapterExtends":null,"children":null}]}]}],"coverPath":"/upload/201610/a53af9b49e8144c1a4400128b09b65de.jpg","courseId":"8a22ecb557d16e020157d1d7526f1dff","outline":"","teacherName":"CMA 明星讲师团","taskNum":"35","subjectName":"CMA中文","courseIndex":1,"teacherHonor":"吴奇奇 张秀军","availability":"","bigCoverPath":"","chapterNum":"40","knowledgePointId":"ff8080814d6642aa014d69f812880246","courseModuleType":"KNOWLEDGE_MODULE","aim":"<p>\r\n\t内容涵盖：\r\n</p>\r\n<p>\r\n\tCMA新版前导课、基础课精彩节选,微课化、利用碎片时间学习,内容转化精彩纷呈,配合大量生动案例,课后测评巩固知识。\r\n</p>\r\n<span>适合人群：</span><span><br />\r\n</span><span>零基础、非财务专业</span><span><br />\r\n</span><span>在校大学生</span><span><br />\r\n</span><span>财务初级从业人员</span>","teacherImage":"/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png","subjectId":"ff808081486933e601489c4662f60851","versionId":"8a22ecb557d16e020157d1d7526f1dff","courseBackgroundImage":"/upload/201610/a53af9b49e8144c1a4400128b09b65de.jpg","subjectIndex":10,"courseName":"CMA 中文 （体验课）","lastModifyTime":1476694,"state":"success","msg":""}
          var task_tpl = $('#task_tpl').html();
          var content = doT.template(task_tpl);
          $('#chaTask').html(content(arr)).show();
          init_check()
          return false;
        }
        
    }
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

        if(!isEmpty(domInfo)){
            var domprogress = videoDownInfo[strs[j]].progress;
            var domstatus = videoDownInfo[strs[j]].status;
            var domtasknum = videoDownInfo[strs[j]].tasknum;
            // ------------------设置界面对应id节点dom下载状态，并设置为可见--------------------------
            if($(".task"+domid).attr("id") == api.pageParam.chapterId){
                $(".task"+domid).parents("li").show();
            }
            $(".task"+domid).attr("type",domstatus);
            $(".task"+domid).find(".val").html(domprogress);
            $(".task"+domid).parent().prev().find(".v-progress").find("span").css("width",domprogress+"%");
            $(".task"+domid).parent().prev().find(".v-name").find("span").eq(1).text(domprogress+"%");
        } 
    }
    //处理进度条

}
    // tasksCache();
    function initDom(){
      course_detail = JSON.parse(api.pageParam.data.replace(/\n|\r|\t|\\|<[^<]*>/g,''));
      var task_tpl = $('#task_tpl').html();
      var content = doT.template(task_tpl);
      $('#chaTask').html(content(course_detail)).show();
      initDomDownStatus();
    }
    
    apiready = function(){
      
      //1:获取所有下载记录并解析
      getdownrecord();
      //2:根据couselist获取所有缓存课程的章节详情，如果在线，从服务器获取，否则本地数据库获取
      initDom();
      clearInterval(getStatusTime);
      getStatusTime = setInterval(function(){
          getdownrecord();
      },2000)
      init_check();
      api.addEventListener({
          name: 'opena'
      }, function(ret) {
          if (ret.value.sethomepage == 1) { //删除
              $('body').addClass('checking');
              
              // api.showProgress({
              //     title: '删除中',
              //     modal: true
              // });
             
          } else if (ret.value.sethomepage == 2) { //取消
              $('body').removeClass('checking');
              $('.icon-check').removeClass('active');
          } else if (ret.value.sethomepage == 3) { //全选
              $('.icon-check').addClass('active');
          }
      });

      task_arr = save_tasks(course_detail);
      courseId = course_detail.courseId; //课程id
    }
      
function init_check() {
$('.chapter-task').on("click",".icon-check",function() {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active')
    } else {
        $(this).addClass('active');
    }
});
}  

function next(obj, num1 , courseId) {
      var courseId = courseId;
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
                  // $api.setStorage(courseId, course_detail);
                  // var task_arr2 = save_tasks(course_detail);
                  // var task_info_detail2;
                  // for (var i in task_arr2) {
                  //     if (task_arr2[i].chapterId == cid) {
                  //         task_info_detail2 = task_arr2[i];
                  //         break;
                  //     }
                  // }
                  var tasks = $.trim($(obj).next().find(".down_data").html());

                  if (isEmpty(tasks)) {
                      api.toast({
                          msg: '暂无任务',
                          location: 'middle'
                      });
                      return false;
                  }
                  judge_task(JSON.parse(tasks), 0);
              }
          });
      } else {
          course_detail = tmp_course_detail;

          // var task_arr2 = save_tasks(course_detail);
          // var task_info_detail2 = [];
          // for (var i in task_arr2) {
          //     if (task_arr2[i].chapterId == cid) {
          //         task_info_detail2 = task_arr2[i];
          //         break;
          //     }
          // }
          var tasks = $.trim($(obj).next().find(".down_data").html());
          if (isEmpty(tasks)) {
              api.toast({
                  msg: '暂无任务',
                  location: 'middle'
              });
              return false;
          }
          judge_task(JSON.parse(tasks), 0);
      }

}
//判断任务类型，跳转相应的页面
//function judge_task(res_process) {
function judge_task(task_info, lastProgress) {

  if (isEmpty(course_detail) || isEmpty(course_detail.chapters) || isEmpty(task_info)) {
      api.toast({
          msg: '获取课程信息失败',
          location: 'middle'
      });
      return false;
  }
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
      //study_progress: res_process,//学习进度
      last_progress: lastProgress,//学习进度
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

//点击本章任务
function task_event(obj, num, task_id) {
    task_info = task_arr[task_id].taskInfo; //任务信息
    // 如果要打开新的窗口，则关闭旧窗口
    
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
        
}