//录音
$('.needaideo').on('tap', function() {
	$('.newimg').css({
		zIndex : '0'
	});
	$('.newaudio').css({
		zIndex : '1000'
	});
});
$('.needimg').on('tap', function() {
	$('.newaudio').css({
		zIndex : '0'
	});
	$('.newimg').css({
		zIndex : '1000'
	});
});
////获取屏幕的宽度
var clientWidth = document.documentElement.clientWidth;
//根据设计图中的canvas画布的占比进行设置
var canvas = document.querySelectorAll('.mycanvas1');
var cliW = clientWidth * 275 / 720;
var canvasWidth = Math.floor(cliW);
for (var i = 0; i < $('.mycanvas1').length; i++) {
	canvas[i].width = canvasWidth;
	canvas[i].height = canvasWidth;
}
//画有透明度的圆环
function drawTou(canvas) {
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(canvasWidth / 2, canvasWidth / 2, canvasWidth / 2.1, 0, Math.PI * 2, false);
	ctx.lineWidth = 5;
	ctx.strokeStyle = "rgba(234,234,234,1)";
	ctx.stroke();
	//画空心圆
	ctx.closePath();
}

for (var i = 0; i < $('.mycanvas1').length; i++) {
	drawTou(canvas[i]);
}

var bfb = 1;
var newtime = 0;
//画实心圆环
function draw(canvas) {
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(canvasWidth / 2, canvasWidth / 2, canvasWidth / 2.1, Math.PI * 1 * ((bfb - 500) / 1000)/*起始角度*/, Math.PI * 1 * ((bfb - 499) / 1000), false);
	ctx.lineWidth = 6;
	ctx.strokeStyle = "#22a891";
	ctx.stroke();
	//画空心圆
	ctx.closePath();
}

function start() {
	for (var i = 0; i < $('.mycanvas1').length; i++) {
		draw(canvas[i]);
	}
	bfb += 0.5;
	if (bfb > 2000) {
		clearTimeout(t);
		$('.newtime').html('60');
		bfb = 1;

	}
}


$('.newtime').html('0');
var t = null;
var t1 = null;
var audiosrc = 0;
var stratend = 1;

var hh = function() {
	stratend = 2;
	audiosrc += 1;
	$(this).children('div').addClass('aucrt2');
	t = setInterval(start, 15);
	t1 = setInterval(function() {
		newtime++;
		//        bfb = (newtime*1000/15)/2;
		//        for(var i = 0; i<$('.mycanvas1').length;i++){
		//            draw(canvas[i]);
		//        }
		if (newtime >= 60) {
			clearInterval(t);
			clearInterval(t1);
			$('.audio').unbind('touchstart', hh);
			$('.newtime').html(60);
		}
		$('.newtime').html(newtime);
	}, 1000);
	api.startRecord({
		path : 'fs://mp3/' + audiosrc + '.mp3'
	});
};
//$('body *').on('touchmove', function (event) {
//		api.refreshHeaderLoadDone();
//    	event.preventDefault();
//    	event.stopPropagation();
//       // return false;
//});

if (stratend == 1) {
	$('.audio').bind('touchstart', hh);
}
var lx_path = '';
var lx_duration = '';
$('.audio').on('touchend', function() {
	stratend = 1;
	$(this).children('div').removeClass('aucrt2');
	clearInterval(t);
	clearInterval(t1);
	$(this).unbind('touchstart', hh);
	api.stopRecord(function(ret, err) {
		if (ret) {
			lx_path = 'mp3/' + audiosrc + '.mp3';
			lx_duration = ret.duration;
			$('.second').text(lx_duration + '"');
			//$api.setStorage('lx_duration',ret.duration);
			//$api.setStorage('lx_puth','mp3/' + audiosrc + '.mp3');
			//api.alert({msg: ('文件路径--' + ret.path + ';录音时长:' + ret.duration + 's')});
			$('.music').attr('src', 'mp3/' + audiosrc + '.mp3');
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
						'file' : 'fs://mp3/' + audiosrc + '.mp3'
					}
				}
			}, function(ret, err) {
				api.hideProgress();
				if (err) {
					return false;
				}
			});
		}
	});
	$('.delete').on('tap', function() {
		var textnull = $('.newentry textarea').val();
		if (textnull == '') {
			$(".second").html(newtime);
		} else {
			alert('不能同时发送语音和文字');
		}
	})
});

$('.newaudio button').on('tap', function() {
	$('.audio').bind('touchstart', hh);
	bfb = 1;
	newtime = 0;
	$('.newtime').html('0');
	for (var i = 0; i < $('.mycanvas1').length; i++) {
		var ctx = canvas[i].getContext("2d");
	}
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, 300, 150);
	ctx.clearRect(0, 0, 300, 150);
	ctx.beginPath();
	ctx.arc(canvasWidth / 2, canvasWidth / 2, canvasWidth / 2.1, 0, Math.PI * 2, false);
	ctx.lineWidth = 5;
	ctx.strokeStyle = "rgba(234,234,234,1)";
	ctx.stroke();
	//画空心圆
	ctx.closePath();
	clearInterval(t);
	$(this).children('div').addClass('aucrt2');
});
$('.switch').on('touchend', function() {
	if ($('.switch').attr('class') == 'switch switch2') {
		$('.switch').removeClass('switch2');
		$('.switch p').removeClass('switchp1');
		$('.switch span').removeClass('switchpsp');
		$('.switch span').html('私人');
	} else {
		$('.switch').addClass('switch2');
		$('.switch p').addClass('switchp1');
		$('.switch span').addClass('switchpsp');
		$('.switch span').html('公开');
	}
});
