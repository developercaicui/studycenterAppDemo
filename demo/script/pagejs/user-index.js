var is_debug = false;

function get_line_process() {
    $('ul.porB').each(function() {
        var _s = $(this).find('.progressPro');
        var _v = parseInt($(this).find('.progressBcount').text());
        setTimeout(function() {
            _s.width(_v + '%')
        }, 300);
        if (_v == 0) {
            $(this).find('.progressBcount').css('background', '#999')
        }
    })
}

function get_circle(color) {
    //一个圆环进度
    var poverLef = document.querySelector('.user-index-pover-lef');
    var povCanvas = document.createElement('canvas');
    poverLef.appendChild(povCanvas);
    var clientWidth = document.documentElement.clientWidth;
    var povCanvasW = Math.floor(clientWidth * 242 / 720);
    povCanvas.width = povCanvasW;
    povCanvas.height = povCanvasW;

    function drawBg(x, y, radius, startPoint, endPoint, lineWidth, lineColor, lineStyle) {
        if (povCanvas.getContext) {
            var ctx = povCanvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(x, y, radius, startPoint, endPoint);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.lineCap = lineStyle;
            ctx.stroke();
            ctx.closePath();
        }
    }
    drawBg(povCanvasW / 2, povCanvasW / 2, povCanvasW / 2.1, 0, Math.PI * 2, 5, '#e5e5e5');
    var ringBcount = document.querySelector('.ringBcount');
    var ringBcountEnd = Number(ringBcount.innerHTML);
    var ringStartBcont = 0;

    function ringStart() {
        ringStartBcont += 1;
        drawBg(povCanvasW / 2, povCanvasW / 2, povCanvasW / 2.1, Math.PI * 2 * ((ringStartBcont - 1) / 100), Math.PI * 2 * (ringStartBcont / 100), 5, color, 'round');
        var t = setTimeout(ringStart, 30);
        if (ringStartBcont == ringBcountEnd || ringBcountEnd == 0) {
            clearTimeout(t);
        }
        if (ringBcountEnd == 0) {
            ringStartBcont = 0;
        }
        document.querySelector('.ringBcount').innerHTML = ringStartBcont;
    }
    ringStart();
}

function get_used_circle(res, n, m) {
    if (isEmpty(m)) {
        is_loaded = true;
    }
    //多个圆环进度
    Morris.Donut({
        element: 'graph',
        data: res,
        backgroundColor: '#fff',
        labelColor: '#717171',
        colors: ['#d9534f', '#00a185', '#4fc4d9', '#f7c232', '#80be1d'],
        formatter: function(x) {
            var str = (x / n).toFixed(2);
            return str * 100 + "%";
        }
    });
}

var lineChartData, randomScalingFactor;

function get_count(labels, y1, y2) {
    //曲线图统计
    Highcharts.setOptions({
        colors: ['#00a085', '#4374e0'] //曲线的颜色
    });
    var categories = labels;
    //x轴数据
    $('#container').highcharts({
        credits: {
            enabled: false //不显示highCharts版权信息
        },
        chart: {
            type: 'spline' //线条类型
        },
        title: '',
        xAxis: {
            reversed: false,
            tickWidth: 0,
            gridLineColor: '#efefef', //y方向网格颜色
            gridLineWidth: 1, //方向网格宽度
            labels: {
                formatter: function() {
                    return categories[this.value];
                }
            },
            tickInterval: 1
        },
        yAxis: {
            reversed: false,
            minPadding: 0,
            tickWidth: 0, //标志线头
            tickInterval: 2,
            gridLineColor: '#efefef', //x方向网格颜色
            lineWidth: 0,
            lineColor: '#a0a0a0',
            minorTickInterval: null,
            min: 0,
            max: 12,
            title: ''
        },
        tooltip: {
            valueSuffix: '°C'
        },
        plotOptions: {
            spline: {
                allowPointSelect: false, //是否允许选中点
                animation: true, //是否在显示图表的时候使用动画
                dataLabels: {
                    enabled: false, //是否在点的旁边显示数据
                    rotation: 0
                },
                enableMouseTracking: false, //鼠标移到图表上时是否显示提示框
                marker: {
                    enabled: true, //是否显示点
                    radius: 3, //点的半径
                    fillColor: "#f0f",

                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: false //鼠标放上去点是否放大
                        }
                    }
                },
                states: {
                    hover: {
                        enabled: false //鼠标放上去线的状态控制
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Tokyo',
            data: y1, //绿色数据
            marker: {
                fillColor: '#00a085'
            }
        }, {
            name: 'New York',
            data: y2, //蓝色数据
            marker: {
                fillColor: '#4374e0'
            }
        }]
    });
    var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
}
//能力切换
function change_able(num, obj) {
    var child = $(obj).find('.povPgm');
    var color = window.getComputedStyle(child[0]).backgroundColor;
    set_circle(num, color);
}

function set_circle(num, color) {
    var style = 'color:' + color + ';';
    var str = '<div class="povBcount"><span class="ringBcount" style="' + style + '">' + num + '</span>%</div>';
    $('.user-index-pover-lef').html(str);
    get_circle(color);
}

//能力评估
function get_ability(flag) {
    if (is_debug) {
        //TODO:
        var able = {
            "ranking": 3249, //排名
            "total": 10009, //做过的试题总数
            "error": 1, //曾经做错的试题总数
            "chapter": 0, //章节错题百分比10%
            "intelligent": 10, //智能组卷错题百分比8%
            "knowledgePoint": 20, //考点联系错题百分比10%
            "real": 40, //历年真题错题百分比10%
            "simulated": 20 //模拟错题百分比10%
        };
        var tpl = $('#tpl_able').html();
        var content = doT.template(tpl);
        $('#content_able').html(content(able));
        $('.ranking').html(able.ranking);
        set_circle(able.chapter, 'rgb(0, 161, 133)');
        get_line_process();

        $('.user-index-pover').removeClass('none');
        $('.user-index-tit').removeClass('none');
        return false;
    }
    var tpl = $('#tpl_able').html();
    var content = doT.template(tpl);
    var data = isEmpty($api.getStorage(memberId + 'capabilityAssessment')) ? '' : $api.getStorage(memberId + 'capabilityAssessment');
    if ((data && (api.connectionType == 'none' || api.connectionType == 'unknown')) || (data && flag == 2)) {
        $('#content_able').html(content(data));
        $('.ranking').html(data.ranking);
        set_circle(data.chapter, 'rgb(0, 161, 133)');
        get_line_process();
        $('.user-index-pover').removeClass('none');
        $('.user-index-tit').removeClass('none');
        return false;
    }
    ajaxRequest('api/v2/capabilityAssessment', 'get', { //008.017  能力评估
        token: $api.getStorage('token'),
        id: memberId
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success') {
            if (isEmpty(ret.data) || isEmpty(ret.data[0])) {
                return false;
            }
            $('#content_able').html(content(ret.data[0]));
            $('.ranking').html(ret.data[0].ranking);
            $api.setStorage(memberId + 'capabilityAssessment', ret.data[0]);
            set_circle(ret.data[0].chapter, 'rgb(0, 161, 133)');
            get_line_process();
            $('.user-index-pover').removeClass('none');
            $('.user-index-tit').removeClass('none');
        }
    });
}

function get_used(flag) {
    if (is_debug) {
        var used = [{
            "type": "看课",
            "value": 20
        }, {
            "type": "笔记",
            "value": 10
        }, {
            "type": "问答",
            "value": 10
        }, {
            "type": "做题",
            "value": 30
        }, {
            "type": "讨论",
            "value": 30
        }];
        var obj = [];
        var n = 0;
        for (var p in used) {
            obj[p] = {};
            obj[p].label = used[p].type;
            n += used[p].value;
            obj[p].value = used[p].value;
        }
        if (!is_loaded) {
            get_used_circle(obj, n);
        }
        var tpl = $('#tpl_used').html();
        var content = doT.template(tpl);
        $('#content-used').html(content({
            data: obj,
            n: n
        }));
        return false;

    }
    var tpl = $('#tpl_used').html();
    var content = doT.template(tpl);
    var data = isEmpty($api.getStorage(memberId + 'scale/browsers')) ? '' : $api.getStorage(memberId + 'scale/browsers');
    if ((data && (api.connectionType == 'none' || api.connectionType == 'unknown'))) {
        get_used_circle(data['obj'], data['n'], 1);
        $('#content-used').html(content(data));
        return false;
    }
    ajaxRequest('api/v2.1/scale/browsers', 'get', { //018.1  学习用时占比（new）
        token: $api.getStorage('token'),
        id: memberId
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success') {
            var obj = [];
            var n = 0;
            for (var p in ret.data) {
                obj[p] = {};
                obj[p].label = ret.data[p].type;
                n += ret.data[p].value;
                obj[p].value = ret.data[p].value;
            }
            if (!is_loaded) {
                get_used_circle(obj, n);
            }
            var res = {
                data: obj,
                n: n
            };
            $('#content-used').html(content(res));
            $api.setStorage(memberId + 'scale/browsers', res);
        } else {
            //api.toast({
            //	msg : ret.msg,
            //	location : 'middle'
            //});
            //return false;
        }
    });
}

function get_used_avg(flag) {
    if (is_debug) {
        var res = [{
            "self": [ //个人最近15天每天的学习用时
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
            ],
            "average": [ //所有人最近15天每天的学习用时
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
            ],
            "date": ["2015-09-01", "2015-09-02", "2015-09-03", "2015-09-04", "2015-09-05", "2015-09-06", "2015-09-07", "2015-09-08", "2015-09-09", "2015-09-10", "2015-09-11", "2015-09-12", "2015-09-13", "2015-09-13", "2015-09-13"]
        }];
        var date = res[0]['date'];
        var self = [];
        var average = [];
        var mydate = [];
        for (var p in date) {
            if (p < 7) {
                mydate.push(date[p].split('-')[1] + '.' + date[p].split('-')[2]);
                self.push(res[0]['self'][p]);
                average.push(res[0]['average'][p]);
            }
        }
        get_count(mydate, self, average);
        return false;
    }
    var data = isEmpty($api.getStorage(memberId + 'learning/lines')) ? '' : $api.getStorage(memberId + 'learning/lines');
    if ((data && (api.connectionType == 'none' || api.connectionType == 'unknown')) || (data && flag == 2)) {
        get_count(data['mydate'], data['self'], data['average']);
        return false;
    }
    ajaxRequest('api/v2/learning/lines', 'get', { //008.019  个人与所有人用时对比（old）
        token: $api.getStorage('token'),
        id: memberId
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success') {
            var res = ret.data;
            var date = res[0]['date'];
            var self = [];
            var average = [];
            var mydate = [];
            for (var p in date) {
                if (p < 7) {
                    mydate.push(date[p].split('-')[1] + '.' + date[p].split('-')[2]);
                    self.push(res[0]['self'][p]);
                    average.push(res[0]['average'][p]);
                }
            }
            get_count(mydate, self, average);
            var arr = {};
            arr['mydate'] = mydate;
            arr['self'] = self;
            arr['average'] = average;
            $api.setStorage(memberId + 'learning/lines', arr);
        } else {
            //api.toast({
            //	msg : ret.msg,
            //	location : 'middle'
            //});
            //return false;
        }
    });
}

function get_study(flag) {
    if (is_debug) {
        var data = {
            "total": 7,
            "courselist": [{
                "isU": true,
                "categoryId": "ff8080814e44227f014e4797ca600073",
                "categoryName": "CIMA 阶段U+",
                "subjectID": "61160404-1edf-42c9-8b9d-63ee08b40d37",
                "subjectName": "F1 business...",
                "courseId": "ff8080814e44227f014e479bb5a50074",
                "courseName": "CIMA Enterprise Operations（E1）",
                "taskTotal": 20,
                "courseBkImage": "/upload/201507/924f877d5ca942428216a8ddee8b04b9.jpg",
                "teacherName": "Maggie",
                "teacherImage": "/upload/201507/26ec729997fc4aee8438a196577748d9.jpg",
                "teacherHonor": "",
                "lastmodifyTime": 34234,
                "expirationTime": '145555454',
                "chapterId": "ff8080814e48c660014e4c5c22500041",
                "chapterName": "Human resource practices",
                "taskprogress": 19
            }]
        };
        var tpl = $('#tpl_course').html();
        var content = doT.template(tpl);
        $('#course_content').html(content(data));
        return false;
    }
    var tpl = $('#tpl_course').html();
    var content = doT.template(tpl);
    var data = isEmpty($api.getStorage(memberId + 'learningcourse')) ? '' : $api.getStorage(memberId + 'learningcourse');
    // if ((data && (api.connectionType == 'none' || api.connectionType == 'unknown')) || (data && flag == 2)) {
    // 		alert(JSON.stringify($api.getStorage(memberId + 'learningcourse')))
    //     static_url = '';
    //     $('#course_content').html(content(data));
    //     progressBar();
    //     api.parseTapmode();
    //     return false;
    // }
    get_static();
    ajaxRequest('api/v2.1/learning/learningcourse', 'get', { // 008.003.2 在学的课程列表（new）
        token: $api.getStorage('token'),
        pageNo: 0,
        pageSize: 1000
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success' && ret.data.total != 0) {
        	var learningcourseData = ret;
        	var learningcourse = ret.data.courselist;
        	var courseArr = [];
					for(var i=0;i<learningcourse.length;i++){
						courseArr.push(learningcourse[i].courseId);
					}
        	ajaxRequest({ 'origin': 'http://action.caicui.com/', 'pathname': 'api/userAction/course/getCourseProgress/v1.0/' }, 'get', {'token':getstor('token'),'memberId':getstor('memberId'),'courseId':courseArr.toString()}, function(ret, err) {
        			if (err) {
        					api.toast({
        							msg: err.msg,
        							location: 'middle'
        					});
        					return false;
        			}
        			for(var i=0;i<learningcourse.length;i++){
        				for(var j=0;j<ret.data.length;j++){
        					if(learningcourse[i].chapterId == ret.data[j].chapterId){
        						learningcourse[i].showProgress = ret.data[j].courseProgress;
        					}
        				}
        			}
        			var ret = learningcourseData;
        			ret.data['courselist'] = bufferCourese(learningcourse);
        			$('#course_content').html(content(ret.data));
        			for (var p in ret.data.courselist[0]) {
        			    if (p == 'courseBkImage') {
        			        var img = ret.data.courselist[0][p];
        			        api.imageCache({
        			            url: static_url + img,
        			            policy: 'cache_else_network',
        			            thumbnail: 'false'
        			        }, function(res, err) {
        			            if (res && res.url) {
        			                ret.data.courselist[0][p] = res.url;
        			                $api.setStorage(memberId + 'learningcourse', ret.data);
        			            }
        			        });
        			        break;
        			    }
        			}
        			saveExpire(ret.data.courselist);

        			api.parseTapmode();
        	});

            
        }
        progressBar();
    });
}

//历史课程详情
function course_det(_this, xyc, a, b, e, f, subjectName, categoryName) {

    var c = $(_this).data('chaptername');
    var d = $(_this).data('coursename');
    //if(c=='undefined'||!c){
    //    return false;
    //}
    api.openWin({
        name: xyc,
        url: xyc + '.html',
        bgColor: '#fff',
        opaque: true,
        reload: true,
        softInputMode: 'resize',
        pageParam: {
            tag: 1,
            courseId: a,
            chapterId: b,
            chapterName: c,
            courseName: d,
            categoryId: e,
            subjectId: f,
            subjectName: subjectName,
            categoryName: categoryName
        },
        vScrollBarEnabled: false,
        slidBackEnabled: false
    });
}

//在线课程详情
function openCourse() {
    api.sendEvent({
        name: 'to_stuyding'
    });
}
if (is_debug) {
    //在学的课程
    get_study();
    //个人学习与所有人平均用时对比
    get_used_avg();
    //学习用时占比
    get_used();
    //能力评估
    get_ability();
}
var is_loaded = false;
var memberId;
apiready = function() {
    memberId = getstor('memberId');
    //监听下拉刷新
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/arrow-down-o.png',
        bgColor: '#f3f3f3',
        textColor: '#787b7c',
        textDown: '下拉更多',
        textUp: '松开刷新',
        showTime: false
    }, function(ret, err) {
        //在学的课程
        get_study(1);
        //个人学习与所有人平均用时对比
        get_used_avg(1);
        //学习用时占比
        get_used(1);
        //能力评估
        get_ability(1);
        //消息数量
    });
    //在学的课程
    get_study(2);
    //个人学习与所有人平均用时对比
    get_used_avg(2);
    //学习用时占比
    get_used(2);
    //能力评估
    get_ability(2);
    //消息数量
    api.addEventListener({
        name: 'flush_study'
    }, function(ret) {
        //在学的课程
        get_study(1);
    })
};
