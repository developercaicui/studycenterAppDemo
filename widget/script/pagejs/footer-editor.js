if (window.localStorage.editorType == 'bar2') {
	$('.editor-bar').addClass('bar2');
} else if (window.localStorage.editorType == 'bar3') {
	$('.editor-bar').addClass('bar3');
	document.documentElement.style.fontSize = 100 * (document.documentElement.clientWidth / 1280) + 'px';
} else if (window.localStorage.editorType == 'bar4') {
	$('.editor-bar').addClass('bar4');
} else if (window.localStorage.editorType == 'bar5') {
	$('.editor-bar').addClass('bar5');
	document.documentElement.style.fontSize = 100 * (document.documentElement.clientWidth / 1280) + 'px';
}
var setAudio;
var audiosrc;
var lx_path = '', lx_duration = 0, soundPath = '';
var _t = $('#audio');
$('body').delegate('#audio', 'touchstart', function(event) {
	event.preventDefault();
	var cirVal = parseInt(_t.find('.val').text());
	var cirW = parseInt(_t.width());
	var cirI = _t.find('circle').eq(1);
	if (!_t.hasClass('wait')) {
		_t.addClass('ing wait');
		setAudio = setInterval(function() {
			if (cirVal > 1799) {
				recordEnd();
			} else {
				cirVal += 1;
				var percent = cirVal / 1800, perimeter = Math.PI * 0.9 * cirW;
				$(cirI).css('stroke-dasharray', perimeter * percent + " " + perimeter * (1 - percent));
				_t.find('.val').text(cirVal);
				$('.newtip').text((cirVal * .1).toFixed(1));
			}
		}, 100);
		audiosrc = Date.parse(new Date());
		api.startRecord({
			path : 'fs://mp3/' + audiosrc + '.amr'
		});
	}
});
$('body').delegate('#audio', 'touchend', function(event) {
	event.preventDefault();
	var cirVal = parseInt(_t.find('.val').text());
	if (cirVal < 30) {
		api.toast({
			msg : '录音时间太短',
			lcoation : 'middle'
		});
		window.clearInterval(setAudio);
		resetAudio();
		return false;
	} else {
		recordEnd();
	}
});
function clear_data() {
	lx_path = '';
	lx_duration = 0;
	soundPath = '';
	$('textarea').val('');
}

function recordEnd() {
	_t.removeClass('ing').addClass('end');
	window.clearInterval(setAudio);
	api.stopRecord(function(ret, err) {
		if (ret) {
			lx_path = 'fs://mp3/' + audiosrc + '.amr';
			lx_duration = ret.duration;
			$('.icon-play').attr('url', lx_path);
			var headers = {
				'X-Requested-With' : 'XMLHttpRequest'
			};
			api.ajax({
				url : common_url + '/' + 'api/v2.1/commons/fileUpload',
				method : 'post',
				headers : headers,
				timeout : 120,
				cache : false,
				data : {
					values : {
						'token' : $api.getStorage('token'),
						'mediatime' : lx_duration
					},
					files : {
						'file' : lx_path
					}
				}
			}, function(ret, err) {
				api.hideProgress();
				if (err) {
					api.toast({
						msg : err.msg,
						location : 'middle'
					});
					return false;
				}
				if (ret && ret.state == 'success') {
					soundPath = ret.data.path;
				}
			});
		}
	})
}

function resetAudio() {
	$('.newtip,.val').text('0.0');
	_t.find('circle').eq(1).css('stroke-dasharray', "1 9999999");
	_t.removeClass('ing wait end');
}

function playAudioMe(item) {
	var _url = $(item).attr('url');
	$(item).addClass('play');

	if (isEmpty($(item).attr('bg'))) {
		api.startPlay({
			path : _url
		}, function() {
			$(item).removeClass('play');
		});

		$(item).attr('bg', '1');
	} else {
		$(item).removeClass('play');
		api.stopPlay();
		$(item).attr('bg', '');
	}
}

var bar_h = $('.editor-tool').height();
function toggleEditor(e) {
    var param=api.pageParam;
	var _y,_v;
    if (window.localStorage.editorType == 'bar3' || window.localStorage.editorType == 'bar5'){
        _v = winW
    }else{
        _v = winH
    }
	if (e == 'full') {
		_y = 0;
	} else if (e == 'mini') {
		_y = _v - bar_h;
		$('.newaudio,.newimg').hide();
		$('textarea').blur();
	}
	api.openFrame({
		name : 'footer-editor',
		url : 'footer-editor.html',
		rect : {
			x : 0,
			y : _y,
			w : api.winWidth,
			h : _v - _y
		},
        pageParam: param,
        bgColor : 'rgba(0,0,0,0)',
		scaleEnabled : false,
		softInputMode : 'resize',
		delay : 200
	});
}

function open_img() {
    $('.backdrop1,.set-photo').show();
    return false;
}


$('.backdrop1').on('touchend', function() {
    $('.backdrop1,.set-photo').hide();
});
function open_edit(obj) {
    toggleEditor('full');

    if ($(obj).hasClass('icon-recording-o')) {
        $('.newaudio').show();
        $('.newimg').hide();
        circleProgress();
    } else if ($(obj).hasClass('icon-picture') || $(obj).hasClass('icon-picture2')) {
        $('.newimg').show();
        $('.newaudio').hide();
    } else if ($(obj).hasClass('textarea')) {
        $('.newaudio,.newimg').hide();
    }
}


function my_focus() {
	toggleEditor('full');
	$('.newaudio,.newimg').hide();
}


//select-phone
function upload(img) {
    $('.set-photo').hide();
    api.showProgress({
        title : '上传中',
        modal : true
    });
    var headers = {
        'X-Requested-With' : 'XMLHttpRequest'
    };
    api.ajax({
        url : common_url + '/' + 'api/v2.1/commons/fileUpload',
        method : 'post',
        headers : headers,
        timeout : 120,
        cache : false,
        data : {
            values : {
                'token' : $api.getStorage('token')
            },
            files : {
                'file' : img
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        if (err) {
            api.toast({
                msg : err.msg,
                location : 'middle'
            });
            return false;
        }
        if (ret && ret.state == 'success') {
            var imgs = ret.data;
            var url = static_url + imgs.path;
            var url1 = imgs.path;
            var str = '<div class="checkimg" data-id="' + url1 + '" style="background-image:url(' + url + ')" ><i class="icon-close"></i></div>';
            if ($api.getStorage('img')) {
                ids = $api.getStorage('img');
                ids += ',' + url1;
            } else {
                ids = url1;
            }
            $api.setStorage('img', ids);
            var tupian = [];
            $('.checkimg').each(function(i) {
                tupian.push($('.checkimg').eq(i).attr('data-id'));
            });
            if (tupian.length == 4) {
                //api.toast({msg: '图片最多可以上传5张'});
                $('.addimg').hide();
                //return;
            }
            $('.addimg').after(str);
            $('.editor-bar').attr('hasimg',1);
            //api.sendEvent({
            //    name: 'select_photo_change',
            //    extra: ret.data
            //});
            //api.closeFrame();
            $('.backdrop1').hide();
        } else {
            api.toast({
                msg: ret.msg,
                location: 'middle'
            });
            $('.backdrop1').hide();
        }
    });
}

function getPic(type, w, h) {
    $('.backdrop').unbind();
    if (api && api.systemType == '131231312') {
        var imageCrop = api.require('imageCrop');
        switch (type) {
            case 'camera':
                imageCrop.takePhoto(function(ret, err) {
                    $('.backdrop').click(function() {
                        $api.setStorage('sign-photo', 1);
                        //api.closeFrame();
                    });
                    if (err) {
                        $api.setStorage('sign-photo', 1);
                        //api.closeFrame();
                        return false;
                    }
                    if (ret && ret.imgPath) {
                        if (!in_array(getFixName(ret.imgPath), allowPicTtype)) {
                            api.toast({
                                msg: '无法上传此种格式的图片',
                                location: 'middle'
                            });
                            return false;
                        }
                        imageCrop.clipPhoto({
                            "imgPath" : ret.imgPath,
                            "height" : h,
                            "width" : w
                        }, function(ret1, err1) {
                            if (err1) {
                                api.toast({
                                    msg : err1.msg,
                                    location : 'middle'
                                });
                                $api.setStorage('sign-photo', 1);
                                //api.closeFrame();
                                return false;
                            }
                            $('body').bind('click', function() {
                                $api.setStorage('sign-photo', 1);
                                //api.closeFrame();
                            });
                            if (ret1 && ret1.imgPath) {
                                upload(ret1.imgPath);
                            }
                        });
                    }
                });
                break;
            case 'album':
                imageCrop.getPhoto(function(ret, err) {
                    $('.backdrop').click(function() {
                        $api.setStorage('sign-photo', 1);
                        //api.closeFrame();
                    });
                    if (err) {
                        //api.closeFrame();
                        return false;
                    }
                    if (ret && ret.imgPath) {
                        if (!in_array(getFixName(ret.imgPath), allowPicTtype)) {
                            api.toast({
                                msg: '无法上传此种格式的图片',
                                location: 'middle'
                            });
                            return false;
                        }
                        imageCrop.clipPhoto({
                            "imgPath" : ret.imgPath,
                            "height" : h,
                            "width" : w
                        }, function(ret1, err1) {
                            if (err1) {
                                api.toast({
                                    msg : err1.msg,
                                    location : 'middle'
                                });
                                return false;
                            }
                            if (ret1 && ret1.imgPath) {
                                upload(ret1.imgPath);
                            }
                        });
                    }
                });
                break;
            default:
                break;
        }
    } else {
        api.getPicture({
            sourceType : type,
            encodingType : 'jpg',
            destinationType : 'url',
            targetWidth : w,
            targetHeight : h,
            allowEdit : false
        }, function(ret, err) {
            $('.backdrop').click(function() {
                $api.setStorage('sign-photo', 1);
                //api.closeFrame();
            });
            if (err) {
                $api.setStorage('sign-photo', 1);
                //api.closeFrame();
                return false;
            }
            if (ret && ret.data) {
                if (!in_array(getFixName(ret.data), allowPicTtype)) {
                    api.toast({
                        msg: '无法上传此种格式的图片',
                        location: 'middle'
                    });
                    return false;
                }
                upload(ret.data);
            }
        });
    }
}

function  create_bottom(){//横屏创建笔记
    var chang = '';
    $('.checkimg').each(function(i) {
        chang += $('.checkimg').eq(i).attr('data-id') + ',';
    });
    var aa = chang.substring(0, chang.length - 1);
    var isPublic = $('.switch').attr('num');
    var param=JSON.stringify({
        img : aa,
        lx_duration : lx_duration,
        soundPath : soundPath,
        isPublic : isPublic
    });
    var jsfun = "create_notes('"+param+"');";
    api.execScript({
        name: 'create-notes',
        //frameName: 'create-notes-f',
        script: jsfun
    });
}
//横屏新建问题
function create_bottom_question(){
    var chang = '';
    $('.checkimg').each(function(i) {
        chang += $('.checkimg').eq(i).attr('data-id') + ',';
    });
    var aa = chang.substring(0, chang.length - 1);
    var isPublic = $('.switch').attr('num');
    var param=JSON.stringify({
        img : aa,
        lx_duration : lx_duration,
        soundPath : soundPath,
        isPublic : isPublic
    });
    var jsfun = "create_question('"+param+"');";
    api.execScript({
        name: 'create-question',
        //frameName: 'create-question-f',
        script: jsfun
    });
}
var lx_soundPath = '';
var lx_lens = 0;
var num = '';
var pageParam;
var is_define = true;
apiready = function(){
    pageParam=api.pageParam;
	api.addEventListener({
		name : 'notes_bj_lx'
	}, function(ret) {
		if (ret && ret.value) {
			if (!isEmpty(ret.value.key1)) {
				imgPath = ret.value.key1.split(',');
				var str = '';
				$.each(imgPath, function(i, item) {
					var url = static_url + item;
					str += '<div class="checkimg" data-id="' + item + '" style="background-image:url(' + url + ')" ><i class="icon-close"></i></div>';
				});
				$('.addimg').after(str);
			}
            //设置1是私有，0是公开
            if(ret.value.isPublic == 0){
                $('.switch').attr('num', '0');
                $('.switch').addClass('switch2');
                $('.switch p').addClass('switchp1');
                $('.switch span').addClass('switchpsp');
                $('.switch span').html('公开');
            }else if(ret.value.isPublic == 1){
                $('.switch').attr('num','1');
            }
            lx_lens = ret.value.soundlen;
			lx_soundPath = ret.value.soundPath;
			if (!isEmpty(ret.value.content)) {
				$('textarea').val($.trim(ret.value.content));
			}
			if (lx_lens == 0 || lx_lens == '' || lx_soundPath == '') {

			} else {
				$('.newaudio').append('<div class="voice-player" tapmode, url="' + static_url + ret.value.soundPath + '", onclick="playAudio(this)", bg, time="' + ret.value.soundlen + '" style="display: block;"></div>');
			}
			audioDom();
		}
	});
	//新建讨论
	api.addEventListener({
		name : 'new-talk'
	}, function(ret, err) {
        var chang = '';
		$('.checkimg').each(function(i) {
			chang += $('.checkimg').eq(i).attr('data-id') + ',';
		});
		var aa = chang.substring(0, chang.length - 1);
		var isPublic = $('.switch').attr('num');
		api.sendEvent({
			name : 'new-talk-hq',
			extra : {
				img : aa,
				lx_duration : lx_duration,
				soundPath : soundPath,
				isPublic : isPublic
			}
		});
	});

	//修改讨论
	api.addEventListener({
		name : 'editor-talk-f'
	}, function(ret) {

	});
	//问题补充
	api.addEventListener({
		name : 'addAnswer'
	}, function(ret) {
		if(ret.value.isadd == 'yes'){
			add_answer();
		}else{
			cancel_answer();
		}
	});
	//问题补充样式传参用
	api.addEventListener({
		name : 'numchange'
	}, function(ret) {
		num = ret.value.key1;
	});

	//新建笔记
	/*api.addEventListener({
		name : 'new-no'
	}, function(ret) {
		//new_notes();
        var chang = '';
        $('.checkimg').each(function(i) {
            chang += $('.checkimg').eq(i).attr('data-id') + ',';
        });
        var aa = chang.substring(0, chang.length - 1);
        var isPublic = $('.switch').attr('num');
        api.sendEvent({
            name : 'new-notes-hq',
            extra : {
                img : aa,
                lx_duration : lx_duration,
                soundPath : soundPath,
                isPublic : isPublic
            }
        });
	});*/
	//编辑笔记
	api.addEventListener({
		name : 'editor-notes'
	}, function(ret) {
		editor_notes();
	});
	//新建问题
	api.addEventListener({
		name : 'new-question'
	}, function(ret) {
		new_question();
	});
	//图片回调
	api.addEventListener({
		name : 'select_photo_change'
	}, function(ret, err) {
		var imgs = ret.value;
		var url = static_url + imgs.path;
		var url1 = imgs.path;
		var str = '<div class="checkimg" data-id="' + url1 + '" style="background-image:url(' + url + ')" ><i class="icon-close"></i></div>';
		var ids = [];
		$('.checkimg').each(function(i) {
			ids.push($('.checkimg').eq(i).attr('data-id'));
		});
		if (ids.length == 4) {
			$('.addimg').hide();
		}
		$('.addimg').after(str);
	});
};
//新建讨论
function new_talk(){
    var chang = '';
    $('.checkimg').each(function(i) {
        chang += $('.checkimg').eq(i).attr('data-id') + ',';
    });
    var aa = chang.substring(0, chang.length - 1);
    var systype = api.systemType;
    var appType;
    if (systype == 'ios') {
        appType = 'iphone';
    } else if (systype == 'android') {
        appType = 'aphone';
    }
    if($.trim($api.getStorage('title')) == ''){
        api.toast({msg:'标题不能为空',location: 'middle'});
        return false;
    }
    if($.trim($api.getStorage('content')) == ''){
        api.toast({msg:'内容不能为空',location: 'middle'});
        return false;
    }
    if($api.getStorage('content').length < 10){
        is_define = true;
        api.toast({msg:'内容不能少于10个字',location: 'middle'});
        return false;
    }
    if(api.pageParam.id == ''){
        api.toast({msg: '章节id不能为空',location: 'middle'});
        return false;
    }
    var param = {};
    param.token = $api.getStorage('token');
    param.title = $.trim($api.getStorage('title'));
    param.content = $.trim($api.getStorage('content'));
    param.imgPath = isEmpty(aa) ? '' : aa;
    param.soundPath = isEmpty(soundPath) ? '' : soundPath;
    param.subjectId = api.pageParam.subjectId;//(yes)
    param.clientType = appType;
    param.courseId = api.pageParam.course_id; //(yes)
    param.id = '';
    param.categoryId = api.pageParam.categoryId; //(yes)
    param.soundLen = isEmpty(lx_duration) ? '' : lx_duration;
    param.chapterId = api.pageParam.chapterId; //(yes)
    param.taskId = '';
    param.taskProgress = 0;
    param.taskType = '';
    param.chapterName=api.pageParam.chapterName;
    param.courseName=api.pageParam.courseName;
    param.subjectName=api.pageParam.subjectName;
    param.categoryName=api.pageParam.categoryName;
    api.showProgress({
        title : '处理中',
        modal : true
    });
    is_define = false;
    ajaxRequest('api/studytools/discusssave/v2.1', 'post', param, function (ret, err) {//003.303.1  发布讨论
        api.hideProgress();
        if (err) {
            is_define = true;
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret && ret.state == 'success') {
            is_define = true;
            //api.sendEvent({
            //    name: 'talk_detail_lx'
            //});
            var jsfun = 'getData(1);';
            api.execScript({
                name: 'course-studying-top',
                frameName: 'course-talk-f',
                script: jsfun
            });
            $api.rmStorage('content');
            $api.rmStorage('title');
            setTimeout(function(){
                api.closeWin({name:'new-talk'});
            },800);
        }else{
            is_define = true;
            /* api.toast({
             msg: '接口异常',
             location: 'middle'
             });*/
        }
    });
}
//编辑讨论
function editor_talk_f(){
    if(is_define == true){
        var chang = '';
        $('.checkimg').each(function(i) {
            chang += $('.checkimg').eq(i).attr('data-id') + ',';
        });
        var aa = chang.substring(0, chang.length - 1);
        if (lx_duration == '' || lx_duration == 0 || lx_duration == undefined) {
            lx_duration = lx_lens;
        }
        if (soundPath == '' || soundPath == 0 || soundPath == undefined) {
            soundPath = lx_soundPath;
        }
        var systype = api.systemType;
        var appType;
        if (systype == 'ios') {
            appType = 'iphone';
        } else if (systype == 'android') {
            appType = 'aphone';
        }
        if(isEmpty($api.getStorage('title'))){
            api.toast({msg:'标题不能为空',location:'moddle'});
            is_define = true;
            return false;
        }
        if(isEmpty($.trim($api.getStorage('content')))){
            api.toast({msg:'内容不能为空',location:'middle'});
            is_define = true;
            return false;
        }
        if($api.getStorage('content').length < 10){
            api.toast({msg:'内容不能小于10个字',location:'middle'});
            is_define = true;
            return false;
        }
        if(pageParam.id == ''){
            api.toast({msg:'id不能为空',location:'middle'});
            is_define = true;
            return false;
        }
        if(pageParam.subjectId == ''){
            is_define = true;
            api.toast({msg:'科目id不能为空',location:'middle'});
            return false;
        }
        if(pageParam.categoryId == ''){
            is_define = true;
            api.toast({msg:'证书id不能为空',location:'middle'});
            return false;
        }
        if(pageParam.chapterId == ''){
            is_define = true;
            api.toast({msg:'章节id不能为空',location:'middle'});
            return false;
        }
        var param = {
            token: $api.getStorage('token'),
            content: $.trim($api.getStorage('content')),//(必)
            title : $.trim($api.getStorage('title')),
            imgPath: isEmpty(aa) ? '' : aa,//(必)
            subjectId: pageParam.subjectId, //科目id(必)
            clientType: appType,// 客户端类型(必)
            id: pageParam.id,//笔记id，如果为空，则为添加，否则为修改
            categoryId: pageParam.categoryId,//讨论证书(必)
            soundLen: isEmpty(lx_duration) ? '' : lx_duration,//(必)
            chapterId: pageParam.chapterId,//章节id
            taskId:pageParam.taskId,
            taskProgress:pageParam.taskProgress,
            taskType:pageParam.taskType,
            soundPath:isEmpty(soundPath) ? '' : soundPath
        };
        api.showProgress({
            title : '处理中',
            modal : true
        });
        is_define = false;
        ajaxRequest('api/studytools/discusssave/v2.1', 'post', param, function (ret, err) {//003.303.1  修改讨论
            api.hideProgress();
            if (err) {
                is_define = true;
                api.toast({
                    msg: err.msg,
                    location: 'middle'
                });
                return false;
            }
            if (ret && ret.state == 'success') {
                is_define = true;
                api.sendEvent({
                    name: 'talk_detail_f_lx'
                });
                $api.rmStorage('content');
                $api.rmStorage('title');
                $('.checkimg').hide();
                $('.newaudio').hide();
                api.closeWin({name:'editor-talk'});
                //api.closeWin();
            }else{
                is_define = true;
            }
        });
    }
}

//新建笔记
function new_note(){
  if(is_define == true){
      var chang = '';
      $('.checkimg').each(function(i) {
          chang += $('.checkimg').eq(i).attr('data-id') + ',';
      });
      var aa = chang.substring(0, chang.length - 1);
      var isPublic = $('.switch').attr('num');
      var systype = api.systemType;
      var appType;
      if (systype == 'ios') {
          appType = 'iphone';
      } else if (systype == 'android') {
          appType = 'aphone';
      }
      if(isEmpty(api.pageParam.courseId)){
          api.toast({msg:'请选择课程',location: 'middle'});
          return false;
      }
      if(isEmpty(api.pageParam.id)){
          api.toast({msg:'请选择章节',location: 'middle'});
          return false;
      }
      if(isEmpty($.trim($api.getStorage('content')))){
          api.toast({msg:'内容不能为空',location: 'middle'});
          return false;
      }
      var param = {
          token: $api.getStorage('token'),
          content: $api.getStorage('content'),
          title: 'title',
          imgPath: isEmpty(aa) ? '' : aa,
          courseId: isEmpty(api.pageParam.courseId) ? '': api.pageParam.courseId, // 课程id
          clientType:appType, //客户端类型：iphone
          id: '', //笔记id，如果为空，则为添加，否则为修改
          isPublic : isPublic, // 笔记是否公开
          subjectId : isEmpty(api.pageParam.subjectId)? 'subjectId' :api.pageParam.subjectId, //科目id(暂无)
          categoryId : isEmpty(api.pageParam.categoryId)? 'categoryId' : api.pageParam.categoryId, // 证书（暂无）
          chapterId : isEmpty(api.pageParam.id) ? '': api.pageParam.id, //章节id
          subjectName : isEmpty(api.pageParam.subjectName)? 'subjectName' :api.pageParam.subjectName,// 科目名称
          categoryName : isEmpty(api.pageParam.categoryName) ? 'categoryName' : api.pageParam.categoryName , //证书名称
          courseName : isEmpty(api.pageParam.courseName) ? 'courseName' : api.pageParam.courseName,//课程名称
          chapterName : isEmpty(api.pageParam.chapterName) ? 'chapterName' : api.pageParam.chapterName,//章节名称
          taskName : 'taskName', //任务名称
          soundLen : isEmpty(lx_duration) ? '' : lx_duration,
          taskId:'',//任务id
          taskProgress:0,//任务进度
          taskType:'',//任务类型
          soundPath:soundPath
      };
      if(param.content.length < 10){
          api.toast({msg:'内容不能少于10个字'});
          return false;
      }
      api.showProgress({
          title : '处理中',
          modal : true
      });
      is_define = false;
      ajaxRequest('api/studytools/nodesave/v2.1', 'post', param, function (ret, err) {//003.116.1 发布或修改笔记（new）
          api.hideProgress();
          if (err) {
              is_define=true;
              api.toast({
                  msg: err.msg,
                  location: 'middle'
              });
              return false;
          }
          if (ret && ret.state == 'success') {
              is_define=true;
              if(api.pageParam.type && api.pageParam.type == 'notes'){
                  var jsfun = 'getData(1);';
                  api.execScript({
                      name: 'class-notes',
                      frameName: 'mine-notes-f',
                      script: jsfun
                  });
                  api.execScript({
                      name: 'mine-notes',
                      frameName: 'mine-notes-f',
                      script: jsfun
                  });
                  api.execScript({
                      name: 'class-notes',
                      frameName: 'class-notes-f',
                      script: jsfun
                  });
                  var par = api.pageParam;
                  par.typ = 'self';
                  api.openWin({
                      name: 'chapter-notes',
                      url: 'chapter-notes.html',
                      pageParam : par,
                      reload:true
                  });
                  $api.rmStorage('content');
                  return false;
              }else {
                  var jsfun = 'getData(1);';
                  api.execScript({
                      name: 'class-notes',
                      frameName: 'mine-notes-f',
                      script: jsfun
                  });
                  api.execScript({
                      name: 'mine-notes',
                      frameName: 'mine-notes-f',
                      script: jsfun
                  });
                  api.execScript({
                      name: 'class-notes',
                      frameName: 'class-notes-f',
                      script: jsfun
                  });
                  var par = api.pageParam;
                  par.typ = 'self';
                  api.openWin({
                      name: 'chapter-notes',
                      url: 'chapter-notes.html',
                      pageParam : par,
                      reload:true
                  });
                  $api.rmStorage('content');
                  api.closeWin({name: 'new-notes'});
              }
          }
          else {
              is_define = true;
              //api.toast({
              //    msg: ret.msg,
              //    location: 'middle'
              //});
          }
      });
  }
}
$('.newimg').delegate('.icon-close', 'click', function() {
	$(this).parent().remove();
	$('.addimg').show();
});
function new_notes() {
	var chang = '';
	$('.checkimg').each(function(i) {
		chang += $('.checkimg').eq(i).attr('data-id') + ',';
	});
	var aa = chang.substring(0, chang.length - 1);
	var isPublic = $('.switch').attr('num');
	api.sendEvent({
		name : 'new-notes-hq',
		extra : {
			img : aa,
			lx_duration : lx_duration,
			soundPath : soundPath,
			isPublic : isPublic
		}
	});
}

function editor_notes() {
	var chang = '';
	$('.checkimg').each(function(i) {
		chang += $('.checkimg').eq(i).attr('data-id') + ',';
	});
	var aa = chang.substring(0, chang.length - 1);
	var isPublic = $('.switch').attr('num');
	if (lx_duration == '' || lx_duration == 0 || lx_duration == undefined) {
		lx_duration = lx_lens;
	}
	if (soundPath == '' || soundPath == 0 || soundPath == undefined) {
		soundPath = lx_soundPath;
	}
    var systype = api.systemType;
    var appType;
    if (systype == 'ios') {
        appType = 'iphone';
    } else if (systype == 'android') {
        appType = 'aphone';
    }
    if ($.trim($api.getStorage('content')) == '') {
        api.toast({
            msg: '内容不能为空',
            location: 'middle'
        });
        return false;
    }
    if($api.getStorage('content').length < 10){
        is_define = true;
        api.toast({msg:'内容不能少于10个字'});
        return false;
    }
    if (api.pageParam.courseId == '') {
        api.toast({msg: '章节id不能为空', location: 'middle'});
        return false;
    }
    if (api.pageParam.bj_id == '') {
        api.toast({msg: '笔记id不能为空', location: 'middle'});
        return false;
    }
    var param = {
        token: $api.getStorage('token'),
        content: $api.getStorage('content'),
        imgPath: isEmpty(aa) ? '' : aa,
        soundPath: isEmpty(soundPath) ? '' : soundPath,
        courseId: api.pageParam.courseId, //课程id
        taskId: api.pageParam.taskId,//(no)
        taskProgress: api.pageParam.taskProgress,//(no)
        taskType: api.pageParam.taskType,//(no)
        clientType: appType,//客户端类型：iphone
        id: api.pageParam.bj_id, //笔记id，如果为空，则为添加，否则为修改
        title: 'title',//笔记标题
        isPublic: isPublic, //0:公开 1：不公开
        subjectId: 'subjectId',//科目id
        categoryId: isEmpty(api.pageParam.categoryId) ? 'categoryId' : api.pageParam.categoryId,//证书id
        chapterId: api.pageParam.charpterId,//章节id
        soundLen: isEmpty(lx_duration) ? '' : lx_duration,
        subjectName: 'subjectName',//科目名称
        categoryName: 'categoryName',//证书名称
        courseName: api.pageParam.courseName,//课程名称
        chapterName: api.pageParam.chapterName,//章节名称
        taskName: 'taskName'//任务名称
    };
    api.showProgress({
        title : '处理中',
        modal : true
    });
    is_define = false;
    ajaxRequest('api/studytools/nodesave/v2.1', 'post', param, function (ret, err) {//003.116  修改笔记
        api.hideProgress();
        if (err) {
            is_define = true;
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret && ret.state == 'success') {
            is_define = true;
            api.sendEvent({
                name: 'bjxq',
                extra: {id: api.pageParam.bj_id}
            });
            $api.rmStorage('content');
            api.closeWin({name:'editor-notes'});
        }else{
            is_define = true;
        }
    });
    /*
	api.sendEvent({
		name : 'editor-notes-hq',
		extra : {
			img : aa,
			lx_duration : lx_duration,
			soundPath : soundPath,
			isPublic : isPublic
		}
	});*/

}
//新建问答
function new_question(param) {
    if(is_define == true){
        var chang = '';
        $('.checkimg').each(function(i) {
            chang += $('.checkimg').eq(i).attr('data-id') + ',';
        });
        var aa = chang.substring(0, chang.length - 1);
        var systype = api.systemType;
        var appType;
        if (systype == 'ios') {
            appType = 'iphone';
        } else if (systype == 'android') {
            appType = 'aphone';
        }
        if (isEmpty(api.pageParam.courseId)) {
            api.toast({msg: '课程不能为空',location: 'middle'});
            is_define = true;
            return false;
        }
        if (isEmpty($api.getStorage('title'))) {
            api.toast({msg: '标题不能为空',location: 'middle'});
            is_define = true;
            return false;
        }
        if (isEmpty($.trim($api.getStorage('content')))) {
            api.toast({msg: '内容不能为空',location: 'middle'});
            is_define = true;
            return false;
        }
        if($api.getStorage('content').length < 10){
            is_define = true;
            api.toast({msg:'内容不能少于10个字'});
            return false;
        }
        
        var param = {
            token: $api.getStorage('token'),
            title: $.trim($api.getStorage('title')), //提问标题
            content: $.trim($api.getStorage('content')), //提问内容
            imgPath: isEmpty(aa) ? '' : aa, //图片数组，图片路径（以’，’分隔）
            courseId: isEmpty(api.pageParam.courseId) ?  'courseId' : api.pageParam.courseId, // 课程id
            clientType: appType, //客户端类型：iphone
            id: '', //笔记id，如果为空，则为添加，否则为修改
            subjectId: isEmpty(api.pageParam.subjectId) ? 'subjectid1' : api.pageParam.subjectId, //科目id(暂无)
            categoryId: isEmpty(api.pageParam.categoryId) ? 'categoryId1' : api.pageParam.categoryId, // 证书（暂无）
            chapterId: isEmpty(api.pageParam.chapterId) ?  'chapterId1' :  api.pageParam.chapterId, //章节id
            soundLen: isEmpty(lx_duration) ? '' : lx_duration, //声音文件的长度
            subjectName: isEmpty(api.pageParam.subjectName) ? '科目名称' : api.pageParam.subjectName, //科目名称
            categoryName: isEmpty(api.pageParam.categoryName) ? '证书名称' : api.pageParam.categoryName,
            courseName: isEmpty(api.pageParam.courseName)? '课程名称' : api.pageParam.courseName,
            chapterName: isEmpty(api.pageParam.chapterName) ? '章节名称' : api.pageParam.chapterName,
            task: '任务名称',
            taskId : '',//(no)
            taskProgress : 0,//(no)
            taskType : '', //(no)
            soundPath: soundPath
        };

        api.showProgress({
            title : '处理中',
            modal : true
        });
        is_define = false;
        ajaxRequest('api/studytools/questionsave/v2.1', 'post', param, function (ret, err) {//003.209.1 发布或修改问题（new）
            api.hideProgress();
            if (err) {
                is_define = true;
                api.toast({
                    msg: err.msg,
                    location: 'middle'
                });
                return false;
            }
            if (ret && ret.state == 'success') {
                is_define = true;
                var jsfun = 'getData(1);';
                api.execScript({
                    name: 'my-question',
                    frameName: 'my-question-f',
                    script: jsfun
                });
                $api.rmStorage('content');
                $api.rmStorage('title');
                api.closeWin({name:'question-mine'});
                api.closeWin({name:'new-question'});
            } else {
                is_define = true;
                /*api.toast({
                 msg: ret.msg,
                 location: 'middle'
                 });*/
            }
        });
    }

    /*
	api.sendEvent({
		name : 'new-question-hq',
		extra : {
			img : aa,
			lx_duration : lx_duration,
			soundPath : soundPath,
			isPublic : isPublic
		}
	});
	*/
}

//志朋有时间把开关滑块这块代码优化一下- --杨澍15-12-05
$('.switch').attr('num', '1');
$('.switch').on('touchend', function() {
	if ($(this).attr('class') == 'switch switch2') {
		$(this).removeClass('switch2').attr('num', '1').find('p').removeClass('switchp1');
		$(this).find('span').removeClass('switchpsp').html('私人');
	} else {
		$(this).addClass('switch2').attr('num', '0').find('p').addClass('switchp1');
		$(this).find('span').addClass('switchpsp').html('公开');
	}
});
//问答补充
function add_answer() {
	$('textarea').attr('placeholder', '问题补充：');

}

//取消问答补充
function cancel_answer() {
	num = 0;
	$('textarea').attr('placeholder', '评论...');
}

function question_mine(){
    var chang = '';
    $('.checkimg').each(function(i) {
        chang += $('.checkimg').eq(i).attr('data-id') + ',';
    });
    var aa = chang.substring(0, chang.length - 1);
    var param = {};
    param.title = $api.getStorage('title');
    param.content = $api.getStorage('content');
    param.img = aa;
    param.soundlen = lx_duration;
    param.soundPath = soundPath;
    api.closeWin({name:'question-mine'});
    api.openWin({
        name: 'question-mine',
        url: 'question-mine.html',
        pageParam: param,
        delay:200
    });
}

function sub() {//回复，评论，问题补充
	if (is_define) {
		var param;
		var memberId = get_loc_val('mine', 'memberId');
		var lj = pageParam.qf;
		var systype = api.systemType;
		var appType;
		if (systype == 'ios') {
			appType = 'iphone';
		} else if (systype == 'android') {
			appType = 'aphone';
		}
		//处理图片
		var chang = '';
		$('.checkimg').each(function(i) {
			chang += $('.checkimg').eq(i).attr('data-id') + ',';
		});
		var aa = chang.substring(0, chang.length - 1);
		if (lj == 'question-detail') {//问题详情页
            if ($.trim($('.textarea').val()) == '') {
                api.toast({
                    msg : '内容不能为空',
                    location : 'middle'
                });
                return false;
            }
            if (pageParam.id == '') {
                api.toast({
                    msg : 'id不合法',
                    location : 'middle'
                });
                return false;
            }
            if (pageParam.courseId == '') {
                api.toast({
                    msg : '课程id不能不为空',
                    location : 'middle'
                });
                return false;
            }
			if (num == 1) {//问题补充
				param = {
					token : $api.getStorage('token'),
					id : pageParam.id, //笔记id，如果为空，则为添加，否则为修改
					content : $('.textarea').val(), //提问内容
					imgPath : isEmpty(aa) ? '' : aa, //图片数组，图片路径（以’，’分隔）
					replaytype : 1, //0:回答问题 1:补充问题
					courseId:pageParam.courseId, //回答/补充问题时候的课程id
					taskId : pageParam.taskId, //回答/补充问题时候的任务id
					soundlen : isEmpty(lx_duration) ? '' : lx_duration, //声音文件的长度
					soundPath : isEmpty(soundPath) ? '' : soundPath
				};
				api.showProgress({
					title : '处理中',
					modal : true
				});
                is_define = false;
                ajaxRequest('api/studytools/questionreply/v2.1', 'post', param, function(ret, err) {//003.212  问题补充
					api.hideProgress();
					if (err) {
                        is_define = true;
						api.toast({
							msg : err.msg,
							location : 'middle'
						});
						return false;
					}
					if (ret && ret.state == 'success') {
                        is_define = true;
						lx_duration = 0;
						soundPath = '';
                        $('.textarea').val('');
						$('.textarea').attr('placeholder', '评论...');
                         num = 0;
						$('.checkimg').remove();
						/*api.sendEvent({
							name : 'question_detail_lx'
						});*/
                        var jsfun = "getData(1);";
                        api.execScript({
                            name: 'question-detail-head',
                            frameName: 'question-detail-f',
                            script: jsfun
                        });
                        resetAudio();
                        setTimeout(function() {
							is_define = true;
						}, 450);
                        api.sendEvent({
                            name : 'addAnswerStyle' //关闭“问题补充”选中样式
                        });
						toggleEditor('mini');
						//clear_data();
					}else{
                        is_define = true;
                    }
				});
			} else { //问题回复
				param = {
					token : $api.getStorage('token'),
					id : pageParam.id, //笔记id，如果为空，则为添加，否则为修改
					content : $('.textarea').val(), //提问内容
					imgPath : isEmpty(aa) ? '' : aa, //图片数组，图片路径（以’，’分隔）
					replaytype : 0,
					courseId : pageParam.courseId, //回答/补充问题时候的课程id
					taskId : pageParam.taskId, //回答/补充问题时候的任务id
					soundlen : isEmpty(lx_duration) ? '' : lx_duration, //声音文件的长度
					soundPath : isEmpty(soundPath) ? '' : soundPath
				};
				api.showProgress({
					title : '处理中',
					modal : true
				});
                is_define = false;
                ajaxRequest('api/studytools/questionreply/v2.1', 'post', param, function(ret, err) {//003.212  问题回答
					api.hideProgress();
					if (err) {
                        is_define = true;
						api.toast({
							msg : err.msg,
							location : 'middle'
						});
						return false;
					}
					if (ret && ret.state == 'success') {
                        is_define = true;
						//api.toast({msg: '成功'});
						lx_duration = 0;
						soundPath = '';
                        $('.textarea').val('').attr('placeholder', '');
                        $('.checkimg').remove();
						resetAudio();
                        /*
						api.sendEvent({
							name : 'question_detail_lx'
						});
						*/
                        var jsfun = "getData(1);";
                        api.execScript({
                            name: 'question-detail-head',
                            frameName: 'question-detail-f',
                            script: jsfun
                        });
						setTimeout(function() {
							is_define = true;
						}, 500);
                        api.sendEvent({
                            name : 'addAnswerStyle' //关闭“问题补充”选中样式
                        });
						toggleEditor('mini');
						//clear_data();
					}else{
                        is_define = true;
                    }
				});
			}
		} else if (lj == 'talk-detail') {//讨论详情
			/*
			 if (api.pageParam.memberId == memberId) {
			 if($('.textarea').val() == ''){
			 api.toast({msg:'内容不能为空',location:'middle'});
			 return false;
			 }
			 if(api.pageParam.id == ''){
			 api.toast({msg:'id不能为空',location:'middle'});
			 return false;
			 }
			 if(api.pageParam.subjectId == ''){
			 api.toast({msg:'科目id不能为空',location:'middle'});
			 return false;
			 }
			 if(api.pageParam.categoryId == ''){
			 api.toast({msg:'证书id不能为空',location:'middle'});
			 return false;
			 }
			 if(api.pageParam.chapterId == ''){
			 api.toast({msg:'章节id不能为空',location:'middle'});
			 return false;
			 }
			 if(lx_duration == '' || lx_duration == 0 || lx_duration == undefined){
			 lx_duration = lx_lens;
			 }
			 if(soundPath == '' || soundPath == 0 || soundPath == undefined){
			 soundPath = lx_soundPath;
			 }
			 param = {
			 token: $api.getStorage('token'),
			 content: $('.textarea').val(),//(必)
			 imgPath: isEmpty(aa) ? '' : aa,//(必)
			 subjectId: api.pageParam.subjectId, //科目id(必)
			 clientType: appType,// 客户端类型(必)
			 id: api.pageParam.id,//笔记id，如果为空，则为添加，否则为修改
			 categoryId: api.pageParam.categoryId,//讨论证书(必)
			 soundLen: isEmpty(lx_duration) ? '' : lx_duration,//(必)
			 chapterId: api.pageParam.chapterId,//章节id
			 //courseId:'courseId',//(no)
			 //taskId:'taskId',//(no)
			 //taskProgress:'200',//(no)
			 //taskType:'taskType',
			 //title:'title',
			 soundPath:isEmpty(soundPath) ? '' : soundPath
			 };
			 api.showProgress({
			 title : '处理中',
			 modal : false
			 });
			 ajaxRequest('api/studytools/discusssave/v2.1', 'post', param, function (ret, err) {//003.303.1  修改讨论
			 api.hideProgress();
			 if (err) {
			 api.toast({
			 msg: err.msg,
			 location: 'middle'
			 });
			 return false;
			 }
			 if (ret && ret.state == 'success') {
			 //api.toast({msg: '成功'});
			 lx_lens = 0;
			 lx_soundPath = '';
			 lx_duration = 0;
			 soundPath = '';
			 $('.checkimg').remove();
			 resetAudio();
			 api.sendEvent({
			 name: 'talk_detail_lx'
			 });
			 api.closeWin({name:'talk-detail'});
			 }
			 });
			 } else {
			 */
			if (pageParam.id == '') {
				api.toast({
					msg : 'id不能为空',
					location : 'middle'
				});
				return false;
			}
			if ($.trim($('.textarea').val()) == '') {
				api.toast({
					msg : '内容不能为空',
					location : 'middle'
				});
				return false;
			}
			if (pageParam.subjectId == '') {
				api.toast({
					msg : '科目id不能为空',
					location : 'middle'
				});
				return false;
			}
			if (pageParam.categoryId == '') {
				api.toast({
					msg : '证书id不能为空',
					location : 'middle'
				});
				return false;
			}
			if (pageParam.chapterId == '') {
				api.toast({
					msg : '章节id不能为空',
					location : 'middle'
				});
				return false;
			}
			param = {
                token : $api.getStorage('token'),
                id : pageParam.id, //讨论主题id
                content : $('.textarea').val(), //(必)
                imgPath : isEmpty(aa) ? '' : aa,
                soundPath : isEmpty(soundPath) ? '' : soundPath,
                clientType : appType, // 客户端类型(必)
                taskId:pageParam.taskId,
                taskprogress:'',
                soundlen : isEmpty(lx_duration) ? '' : lx_duration,
                subjectId :pageParam.subjectId, //科目id(必)
                courseId:pageParam.courseId,
                taskType:pageParam.taskType,
                title : 'title',
                categoryId :pageParam.categoryId, //讨论证书(必)
                chapterId : pageParam.chapterId //章节id
			};
			is_define = false;
			api.showProgress({
				title : '处理中',
				modal : true
			});
			ajaxRequest('api/studytools/discussreply/v2.1', 'post', param, function(ret, err) {//003.303  参与讨论（回复）
				api.hideProgress();
				if (err) {
                    is_define = true;
                    api.toast({
						msg : err.msg,
						location : 'middle'
					});
					return false;
				}
				if (ret && ret.state == 'success') {
                    is_define = true;
                    var jsfun = 'reload();';
                    api.execScript({
                        name: 'talk-detail',
                        frameName: 'talk-detail-f',
                        script: jsfun
                    });
					lx_lens = 0;
					lx_soundPath = '';
					lx_duration = 0;
					soundPath = '';
					$('.checkimg').remove();
					resetAudio();
					setTimeout(function() {
						is_define = true;
					}, 500);
					toggleEditor('mini');
					clear_data();
				}else{
                    is_define = true;
                }
			});
			//}
		}
	} else {
		api.toast({
			msg : '内容不能重复提交',
			location : 'middle'
		});
		return false;
	}

}

