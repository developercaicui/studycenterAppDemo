var Time = {
	/*初始化*/
	init : function() {
		var t = this;
		t.docHeight = document.documentElement.clientHeight;
		t.docWidth = document.documentElement.clientWidth;
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
		this.setRem();
	},
	/*对应不同页面加载不同模块*/
	load : {
		that : this,
		loadTimer : function() {
			Time.addTime.addTimeDom();
			Time.addTime.touchTime();
		}
	},
	//设置页面的rem值
	setRem : function() {
		document.documentElement.style.fontSize = (this.docHeight / 1232) * 100 + 'px';
	},
	//获取dom节点
	getDom : function(dom) {
		var domObj = document.querySelector(dom);
		if (domObj.nodeType && domObj.nodeType === 1) {
			return domObj;
		} else {
			throw new Error('请确定dom节点的名字拼写正确');
		}
	},
	//获取兄弟节点
	returnSib : function(elem) {
		var a = [];
		var b = elem.parentNode.parentNode.children;
		var length = b.length;
		for (var i = 0; i < length; i++) {
			//遍历的节点和当前节点比较，推入数组
			if (b[i] !== elem.parentNode) {
				a.push(b[i]);
			}
		}
		return a;
	},
	/*
	 加载时间选择器
	 * */
	addTime : {
		addTimeDom : function() {
			var ulHour = document.createElement('ul');
			var ulMinute = document.createElement('ul');
			var hourWrap = Time.getDom('.time-hours');
			var minuteWrap = Time.getDom('.time-minute');
			var strHour = '';
			var strMinute = '';
			ulHour.className = 'hours-list  time-list';
			ulMinute.className = 'minute-list  time-list';
			for (var i = 0; i < 24; i++) {
				if (i < 10) {
					i = 0 + '' + i;
				}
				strHour += '<li>' + i + '</li>';
			}
			for (var j = 0; j < 60; j++) {
				if (j < 10) {
					j = 0 + '' + j;
				}
				strMinute += '<li>' + j + '</li>';
			}
			ulHour.innerHTML = strHour;
			ulMinute.innerHTML = strMinute;
			hourWrap.appendChild(ulHour);
			minuteWrap.appendChild(ulMinute);
		},
		touchTime : function() {
			//定义开始滑动的x,y,滑动结束的x,y,滑动开始时间和结束时间，用于做加速度优化
			var startX, startY, endX, endY, startTime, endTime;
			var clientWidth = document.documentElement.clientWidth;
			var timeWrap = document.querySelector('.page-wrap');
			var hourList = document.querySelector('.hours-list');
			var hourListLi = document.querySelectorAll('.hours-list li');
			var minuteList = document.querySelector('.minute-list');
			var minuteListLi = document.querySelectorAll('.minute-list li');
			//获取所有的li
			var liArray = document.querySelectorAll('.timer-content li');
			//容器层高度,相当于三个li的高度
			var ulWrapHeight = document.querySelector('.time-hours').offsetHeight;
			//297
			//滑动开始时的ul的top值
			var minuteStartTop = "";
			var hourStartTop = "";
			var endHourListTop = "", endMinuteListTop = "";
			//控制中间位置的变量
			var hourOffsetTop, hourLeave, hourTimes, minuteOffsetTop, minuteLeave, minuteTimes;
			hourList.style.top = 0 + 'px';
			minuteList.style.top = 0 + 'px';
			//设置每个li的高度
			for (var i = 0; i < liArray.length; i++) {
				liArray[i].style.height = ulWrapHeight / 3 + 'px';
				liArray[i].style.lineHeight = ulWrapHeight / 3 + 'px';
			}
			timeWrap.addEventListener('touchstart', function(e) {
				startX = e.touches[0].pageX;
				startY = e.touches[0].pageY;
				minuteStartTop = parseInt(minuteList.style.top);
				hourStartTop = parseInt(hourList.style.top);
			}, false);
			timeWrap.addEventListener('touchmove', function(e) {
				var x = e.touches[0].pageX;
				var y = e.touches[0].pageY;
				endHourListTop = parseInt(hourList.style.top);
				endMinuteListTop = parseInt(minuteList.style.top);
				//左边区域滑动
				if (startX < clientWidth / 2) {
					//下滑
					if (y > startY) {
						if (hourStartTop == 0) {
							hourList.style.top = (y - startY) + 'px';
						} else {
							hourList.style.top = hourStartTop + (y - startY) + 'px';
						}
						//上滑
					} else {
						if (hourStartTop == 0) {
							hourList.style.top = (y - startY) + 'px';
						} else {
							hourList.style.top = hourStartTop + (y - startY) + 'px';
						}
					}
					//右边区域滑动
				} else {
					//下滑
					if (y > startY) {
						if (minuteStartTop == 0) {
							minuteList.style.top = (y - startY) + 'px';
						} else {
							minuteList.style.top = minuteStartTop + (y - startY) + 'px';
						}
						//上滑
					} else {
						if (minuteStartTop == 0) {
							minuteList.style.top = (y - startY) + 'px';
						} else {
							minuteList.style.top = minuteStartTop + (y - startY) + 'px';
						}
					}
				}
			}, false);
			timeWrap.addEventListener('touchend', function(e) {
				endX = e.changedTouches[0].pageX;
				endY = e.changedTouches[0].pageY;
				//滑动结束时的ul top

				//当没有具体滑动的时候，直接退出
				if (endX === startX && endY === startY) {
					return false;
				}
				//最终输出的时间逻辑,根据滑动的offsetTop值除以每个li的高度值的整除次数，得出最终时间
				var currentHour, currentMinute;
				//下滑过程中当top值大于ulWrapHeight的范围时，折回
				if (endHourListTop >= (ulWrapHeight / 3)) {
					hourList.style.top = ulWrapHeight / 3 + 'px';
				}
				if (Math.abs(endHourListTop) >= ulWrapHeight / 3 * 22) {
					hourList.style.top = -ulWrapHeight / 3 * 22 + 'px';
				}
				if (endMinuteListTop >= (ulWrapHeight / 3)) {
					minuteList.style.top = ulWrapHeight / 3 + 'px';
				}
				if (Math.abs(endMinuteListTop) >= ulWrapHeight / 3 * 57) {
					minuteList.style.top = -ulWrapHeight / 3 * 58 + 'px';
				}
				//判断区域,中间区域，顶部，底部，以及临界点的位置控制
				if (startX < clientWidth / 2) {
					//控制中间某个li居中显示
					hourOffsetTop = hourList.offsetTop;
					//计算余数
					hourLeave = hourOffsetTop % (ulWrapHeight / 3);
					//计算整除次数
					hourTimes = Math.floor(Math.abs(hourOffsetTop / (ulWrapHeight / 3)));
					//小时控制
					if (hourTimes == 1) {
						hourList.style.top = (ulWrapHeight / 3) + 'px';
					} else if (hourTimes == 22) {
						hourList.style.top = -(ulWrapHeight / 3) * 22 + 'px';
					} else {
						if (endHourListTop >= -ulWrapHeight / 6) {
							hourList.style.top = (endHourListTop - hourLeave) + 'px';
						} else {
							hourList.style.top = -(hourTimes) * (ulWrapHeight / 3) + 'px';
						}
					}
				} else {
					//控制中间某个li居中显示
					minuteOffsetTop = minuteList.offsetTop;
					//计算余数
					minuteLeave = minuteOffsetTop % (ulWrapHeight / 3);
					//计算整除次数
					minuteTimes = Math.floor(Math.abs(minuteOffsetTop / (ulWrapHeight / 3)));
					//分钟控制
					if (minuteTimes == 1) {
						minuteList.style.top = (ulWrapHeight / 3) + 'px';
					} else if (minuteTimes == 58) {
						minuteList.style.top = -(ulWrapHeight / 3) * 58 + 'px';
					} else {
						if (endMinuteListTop >= -ulWrapHeight / 6) {
							minuteList.style.top = (endMinuteListTop - minuteLeave) + 'px';
						} else {
							minuteList.style.top = -(minuteTimes) * (ulWrapHeight / 3) + 'px';
						}
					}
				}
				//输出最终时间的逻辑
				if (hourTimes && !minuteTimes) {
					if (endHourListTop >= (ulWrapHeight / 3)) {
						currentHour = '00';
					} else {
						if (hourTimes < 9) {
							currentHour = '0' + (hourTimes + 1);
						} else {
							currentHour = hourTimes + 1;
						}
					}
					currentMinute = '01';
				} else if (!hourTimes && minuteTimes) {
					if (endMinuteListTop >= (ulWrapHeight / 3)) {
						currentMinute = '00';
					} else {
						if (minuteTimes < 9) {
							currentMinute = '0' + (minuteTimes + 1);
						} else {
							currentMinute = minuteTimes + 1 + '';
						}
					}
					currentHour = '01';
				} else if (hourTimes && minuteTimes) {
					if (hourTimes == 1) {
						currentHour = '00';
					} else {
						if (hourTimes < 9) {
							currentHour = '0' + (hourTimes + 1);
						} else {
							currentHour = hourTimes + 1;
						}
					}
					if (minuteTimes == 1) {
						currentMinute = '00';
					} else {
						if (minuteTimes < 9) {
							currentMinute = '0' + (minuteTimes + 1);
						} else {
							currentMinute = minuteTimes + 1 + '';
						}
					}
				} else {
					currentHour = '01';
					currentMinute = '01';
				}
				//调用最终时间
				alert(currentHour + ":" + currentMinute);
			}, false);
		}
	}
};
Time.init();
/**
 * Created by H5-dev on 2015/9/22.
 */
