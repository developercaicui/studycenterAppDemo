//SHA1加密算法
function SHA1(msg) {
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    }

    function lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;

        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    }

    function cvt_hex(val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = [];
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;

        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;

        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14)
        word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

        for (i = 0; i < 16; i++)
            W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++)
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;

    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();
}

//title–消息标题，
//content – 消息内容
//type – 消息类型，1:消息 2:通知
//platform - 0:全部平台，1：ios, 2：android
//groupName - 推送组名，多个组用英文逗号隔开.默认:全部组。eg.group1,group2 .
//userIds - 推送用户id, 多个用户用英文逗号分隔，eg. user1,user2。
var push_url = "https://p.apicloud.com/api/push/message";

function push(bodyParam) {
    bodyParam.platform = 0;
    bodyParam.userIds = api.deviceId;
    var now = Date.now();
    var appKey = SHA1("A6995057458724" + "UZ" + "21499A54-F52F-2847-CD35-3B807317584D" + "UZ" + now) + "." + now;
    var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-APICloud-AppId': 'A6995057458724',
        'X-APICloud-AppKey': appKey,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    api.ajax({
        url: push_url,
        method: 'post',
        cache: false,
        headers: headers,
        data: {
            values: bodyParam
        }
    }, function(ret, err) {
        //api.alert({msg:ret});
    });
}

// var course_detail_expire = 86400 * 14 * 1000;
var course_detail_expire = 86400 * 1000;
// var course_detail_expire = 60*1000;
var push_timer;

function init_push() {
    var time = isEmpty($api.getStorage('notice_time')) ? '' : $api.getStorage('notice_time');
    if (!isEmpty(time)) {
        clearInterval(push_timer);
        push_timer = setInterval(function() {
            var date = new Date(Date.now());
            var hourse = extra(date.getHours());
            var minute = extra(date.getMinutes());
            var s = extra(date.getSeconds());
            if (time == (hourse + ':' + minute) && s == '00') {
                push({
                    title: '学习提醒',
                    content: get_loc_val('mine', 'nickName') + '同学，时间到了，赶紧开始学习吧！',
                    type: 2,
                    platform: 0,
                    userIds: api.deviceId
                });
            }
        }, 1000);
    }
}

//补位函数。
function extra(x) {
    //如果传入数字小于10，数字前补一位0。
    if (parseInt(x) < 10) {
        return "0" + parseInt(x);
    } else {
        return x;
    }
}

var err_conf_007 = {
    '-1000': '程序异常',
    '1000': '参数有误！',
    '1001': '没绑定账号',
    '1002': '账号没启用',
    '1003': '账号被禁用',
    '1004': '验证码错误',
    '1005': '用户名或密码错误',
    '1006': '用户名不可用',
    '1007': '同意《会员注册协议》方可注册',
    '1008': '用户名已存在',
    '1009': '手机号已注册',
    '1010': '没有访问权限',
    '1011': '第三方账号已绑定',
    '1012': '用户不存在',
    '1013': '还没完善用户信息',
    'nologin': '没有登录'
};
var debug = false;
var show_pro = true;
var common_url, static_url;
if (debug) {
    //测试地址
    common_url = 'http://demo.caicui.com';
    //common_url = 'https://demoapi.caicui.com';
    static_url = 'http://demo.caicui.com';
} else {
    //正式地址
    common_url = 'http://api.caicui.com';
    //common_url = 'https://apis.caicui.com';
    static_url = 'http://static.caicui.com';
}

function get_static() {
    if (debug) {
        //测试地址
        static_url = 'http://demo.caicui.com';
    } else {
        //正式地址
        static_url = 'http://static.caicui.com';
    }
}

var default_img = static_url + '/upload/201501/titletit.png';
//图片上传限制
var allowPicTtype = ['.png', '.jpg', '.jpeg', '.gif'];
//ajax重写
function myajaxRequest(url, method, params, callBack) {

    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    var data = {};
    if (method == "get" || method == "GET") {
        var urlquery = "";
        for (var key in params) {
            urlquery += key + "=" + params[key] + "&";
        }
        if (urlquery != "") {
            if (url.indexOf("?") > 0) {
                url += "&" + urlquery;
            } else {
                url += "?" + urlquery;
            }
        }
    } else {
        data.values = params;
    }
    api.ajax({
        url: common_url + '/' + url,
        method: method,
        cache: false,
        timeout: 1200,
        headers: headers,
        data: data
    }, function(ret, err) {
        if (api.connectionType == 'none' || api.connectionType == 'unknown') {
            is_ok = true;
        }
        callBack(ret, err);
    });
}

function ajaxRequest(url, method, params, callBack, hostName) {
    var src = '';
    var origin = '';
    var href = '';
    if(typeof url == 'string'){
      src = url;
    }else if(typeof url == 'object'){
      origin = url.origin;
      src = url.pathname;
    }
    
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    var data = {};
    if (method == "get" || method == "GET") {
        var urlquery = "";
        for (var key in params) {
            urlquery += key + "=" + params[key] + "&";
        }
        if (urlquery != "") {
            if (src.indexOf("?") > 0) {
                src += "&" + urlquery;
            } else {
                src += "?" + urlquery;
            }
        }
    } else {
        data.values = params;
    }
    if(origin){
      href = origin + src;
    }else{
      href = common_url + '/' + src
    }
    api.ajax({
        url: href,
        method: method,
        cache: false,
        timeout: 1200,
        headers: headers,
        data: data
    }, function(ret, err) {
        if (api.connectionType == 'none' || api.connectionType == 'unknown') {
            is_ok = true;
        }
        api.hideProgress();
        api.refreshHeaderLoadDone();
        if (src != 'api/v2/member/get' && !isEmpty(ret) && ret.state == 'error' && ret.msg == 'nologin') {
            out();
        }
        callBack(ret, err);
    });
}

function set_token(callback) {
    var systype = api.systemType;
    var param = {};
    if (systype == 'ios') {
        param.appType = 'iphone';
        param.appId = 'iPhoneCourse';
        param.appKey = '8f81bf2e06c0f32df06ba7a04cf4bbb7';
    } else if (systype == 'android') {
        param.appType = 'aphone';
        param.appId = 'aPhoneCourse';
        param.appKey = '4b6454d8cf903498116e26b26dd5791a';
    }
    myajaxRequest('api/v2.1/getToken', 'get', param, function(ret, err) {
        if (ret.state == 'success') {
            $api.setStorage('token', ret.data.token);
        }
        callback(ret, err);
    });
}

function get_token() {
    set_token(function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success') {
            $api.setStorage('token', ret.data.token);
        } else {

            if (!isEmpty(err_conf_007[ret.msg])) {
                var error = err_conf_007[ret.msg];
                api.toast({
                    msg: error,
                    location: 'middle'
                });
            }

        }
    });
}

function out() {
    api.sendEvent({
        name: 'to_login'
    });
    api.closeWin();
}

function getstor(key) {
    var val = get_loc_val('mine', key);
    if (val) {
        return val;
    } else {
        return false;
    }
}

//时间戳转成对应日期时间，格式为：2009-03-23
function timetoDate(tm) {
    var date = new Date(parseInt(tm) * 1000);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;

    return date.getFullYear() + "-" + month + "-" + day;
}

//时间戳转日期
function formatDate(now, t) {
    var date = new Date(parseInt(now * 1000));
    if (t == 'Y') {
        Y = date.getFullYear();
        return Y;
    }
    if (t == 'M') {
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        return M;
    }
    if (t == 'D') {
        D = date.getDate();
        return extra(D);
    }
    if (t == 'h') {
        h = date.getHours();
        return extra(h);
    }
    if (t == 'm') {
        m = date.getMinutes();
        return extra(m);
    }
    if (t == 's') {
        s = date.getSeconds();
        return extra(s);
    }
}

//秒数转成分秒

function formatSeconds(value) {

    var theTime = parseInt(value);
    // 秒
    var theTime1 = 0;
    // 分
    var theTime2 = 0;
    // 小时
    if (theTime >= 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 >= 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var i, s, h;
    if (theTime2 >= 10) {
        h = theTime2;
    } else {
        h = '0' + theTime2;
    }
    if (theTime1 >= 10) {
        i = theTime1;
    } else {
        i = '0' + theTime1;
    }
    if (theTime >= 10) {
        s = theTime;
    } else {
        s = '0' + theTime;
    }
    if (h > 0) {
        return parseInt(parseInt(i) + parseInt(h * 60)) + ':' + s;
    } else {
        return i + ':' + s;
    }
}

//秒数转成时分秒
function formatSec(value) {
    var theTime = parseInt(value);
    // 秒
    var theTime1 = 0;
    // 分
    var theTime2 = 0;
    // 小时
    if (theTime >= 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 >= 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var i, s, h;
    if (theTime2 >= 10) {
        h = theTime2;
    } else {
        h = '0' + theTime2;
    }
    if (theTime1 >= 10) {
        i = theTime1;
    } else {
        i = '0' + theTime1;
    }
    if (theTime >= 10) {
        s = theTime;
    } else {
        s = '0' + theTime;
    }
    if (h > 0) {
        return parseInt(parseInt(i) + parseInt(h * 60)) + ':' + s;
    } else {
        return i + ':' + s;
    }
}

//任务类型
function formatType(type, value) {
    if (isEmpty(value) || value == 0) {
        return '';
    } else {
        switch (type) {
            case 'video':
                var theTime = parseInt(value);
                // 秒
                var theTime1 = 0;
                // 分
                var theTime2 = 0;
                // 小时
                if (theTime >= 60) {
                    theTime1 = parseInt(theTime / 60);
                    theTime = parseInt(theTime % 60);
                    if (theTime1 >= 60) {
                        theTime2 = parseInt(theTime1 / 60);
                        theTime1 = parseInt(theTime1 % 60);
                    }
                }
                var i, s, h;
                if (theTime2 >= 10) {
                    h = theTime2;
                } else {
                    h = '0' + theTime2;
                }
                if (theTime1 >= 10) {
                    i = theTime1;
                } else {
                    i = '0' + theTime1;
                }
                if (theTime >= 10) {
                    s = theTime;
                } else {
                    s = '0' + theTime;
                }
                if (h > 0) {
                    return parseInt(parseInt(i) + parseInt(h * 60)) + ':' + s;
                } else {
                    return i + ':' + s;
                }
                //return h + ':' + i + ':' + s;
                break;
            case 'exam':
                return ' 第' + value + '题';
                break;
            default:
                return ' 第' + value + '页';
                break;
        }
    }
}

//判断是否为空
function isEmpty(data) {
    data = $.trim(data);
    if (isEmpty1(data) || isEmpty2(data)) {
        return true;
    }
    return false;
}

function isEmpty1(data) {
    if (data == undefined || data == null || data == 'null' || data == "" || data == 'NULL' || data == false || data == 'false') {
        return true;
    }
    return false;
}

function isEmpty2(v) {
    switch (typeof v) {
        case 'undefined':
            return true;
        case 'string':
            if ($api.trim(v).length == 0)
                return true;
            break;
        case 'boolean':
            if (!v)
                return true;
            break;
        case 'number':
            if (0 === v)
                return true;
            break;
        case 'object':
            if (null === v)
                return true;
            if (undefined !== v.length && v.length == 0)
                return true;
            for (var k in v) {
                return false;
            }
            return true;
            break;
    }
    return false;
}

function get_loc_val(key, index) {
    var val = $api.getStorage(key);
    if (isEmpty(val)) {
        return false;
    }
    if (isEmpty(val[index])) {
        return false;
    }
    return val[index];
}

function app_installed(appBundle, callback) {
    api.appInstalled({
        appBundle: appBundle
    }, function(ret, err) {
        if (ret.installed) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

function htmldecode(str) {
    //str = str.replace(/&/g, '&amp;');
    //str = str.replace(/</g, '&lt;');
    //str = str.replace(/>/g, '&gt;');
    //str = str.replace(/(?:t| |v|r)*n/g, '<br />');
    //str = str.replace(/  /g, '&nbsp; ');
    //str = str.replace(/t/g, '&nbsp; &nbsp; ');
    //str = str.replace(/x22/g, '&quot;');
    //str = str.replace(/x27/g, '&#39;');
    return str;
}

function html_decode(str) {
    //str = str.replace(/&/g, '&amp;');
    //str = str.replace(/</g, '&lt;');
    //str = str.replace(/>/g, '&gt;');
    //str = str.replace(/(?:t| |v|r)*n/g, '<br />');
    //str = str.replace(/  /g, '&nbsp; ');
    //str = str.replace(/t/g, '&nbsp; &nbsp; ');
    //str = str.replace(/x22/g, '&quot;');
    //str = str.replace(/x27/g, '&#39;');
    return str;
}

var cache_model = null;

function video_cache(method, title, ccid, UserId, apiKey, callback) {
    var param = {
        title: title,
        videoId: ccid,
        UserId: UserId,
        apiKey: apiKey
    };
    if (cache_model == null) {
        cache_model = api.require('lbbVideo');
    }
    if (isEmpty(cache_model)) {
        callback(false);
    }

    if (method == 'download') {
        getCCconfig(function(CCconfig) {
            if (CCconfig) {
                //alert(UserId+'====='+(isEmpty(CCconfig[UserId]) ? 0 : 1));
                param['isEncryption'] = isEmpty(CCconfig[UserId]) ? 0 : 1;
                //api.alert({
                //    msg:param
                //});
                
                cache_model.download(param, function(ret, err) {
                    //alert(JSON.stringify(ret))
                    if (api.systemType == "ios" && parseInt(ret.status) == 2) {
                        return false;
                    }
                    
                    //callback(ret, err);
                });
            }
        });
    } else if (method == 'downloadStop') {
        cache_model.downloadStop({"userId":getstor('memberId')},function(ret, err) {
            callback(ret, err);
        });
    } else if (method == 'downloadStart') {
        cache_model.downloadStart(function(ret, err) {
            callback(ret, err);
        });
        //cache_model.downloadStart(function(ret, err) {
        //    callback(ret, err);
        //});
    }
}

function write_file(filename, data, callback) {
    api.writeFile({
        path: 'box://' + filename,
        data: data
    }, function(ret, err) {
        callback(ret, err);
    });
}

function read_file(filename, callback) {
    api.readFile({
        path: 'box://' + filename
    }, function(ret, err) {
        callback(ret, err);
    });
}

function in_array(str, array) {
    for (var p in array) {
        if (array[p] == str) {
            return true;
        }
    }
    return false;
}

function set_cache(courseId, data) {
    $api.setStorage(courseId, data[0]);
    var memberId = getstor('memberId');
    var obj_data = $api.getStorage(memberId + 'video-buffer');
    var param = $api.getStorage('my_to_down');

    if (!isEmpty(obj_data)) {
        // if (!in_array(courseId, obj_data)) {
            obj_data.push(courseId);
            $api.setStorage(memberId + 'video-buffer', obj_data);
            write_file(memberId + courseId + '.db', JSON.stringify(data), function(ret, err) {})
            param.courseJson = data;
            $api.setStorage('my_to_down', param);
        // }
    } else {
        obj_data = [];
        obj_data.push(courseId);
        $api.setStorage(memberId + 'video-buffer', obj_data);
        write_file(memberId + courseId + '.db', JSON.stringify(data), function(ret, err) {})
        param.courseJson = data;
        $api.setStorage('my_to_down', param);
    }
}

function set_cache_lst(courseId, chapId) {
    var uid = getstor('memberId');
    var cid = courseId;
    var time1 = Date.now();
    var data = isEmpty($api.getStorage(cid + '-' + uid)) ? '' : $api.getStorage(cid + '-' + uid);
    if (data && time1 - data['time'] < course_detail_expire) {
        set_cache(courseId, data['data']);

    } else {
        var param = {};
        param.courseId = courseId;
        ajaxRequest('api/v2.1/course/courseDetail', 'get', param, function(rets, errs) {
            if (rets && rets.state == 'success') {
                var data = rets.data;
                if (isEmpty(data)) {
                    return false;
                }
                set_cache(courseId, data);
                var time_now = Date.now();
                var res = {
                    'time': time_now,
                    'data': data
                };
                $api.setStorage(cid + '-' + uid, res);
            }         
        });
    }
}

function getFixName(filename) { //获取文件后缀名
    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    return filename.substring(index1, index2);
    //后缀名
}

//下载按钮点击
function down(_this) {
    var memberId = getstor('memberId');
    var path = "";
    var courseId = $(_this).attr('courseid'),
        type = $(_this).attr('type'),
        chapterIdA = $(_this).attr('chapterida'),
        chapterIdB = $(_this).attr('chapteridb'),
        chapterIdC = $(_this).attr('chapteridc'),
        chapterNameA = $(_this).attr('chapterNamea'),
        chapterNameB = $(_this).attr('chapterNameb'),
        chapterNameC = $(_this).attr('chapterNamec'),
        courseName = $(_this).attr('courseName'),
        versionId = $(_this).attr('versionId'),
        index = $(_this).attr('key'),
        tasks = $.trim($(_this).siblings('.down_data').html());

    if (isEmpty(tasks)) {
        api.toast({
            msg: '无视频任务',
            location: 'middle'
        });
        return false;
    }
    if(!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)){
        path = chapterIdA;
    }
    if(!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)){
        path = chapterIdA + "//"+chapterIdB;
    }
    if(!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)){
        path = chapterIdA + "//"+chapterIdB + "//" + chapterIdC;
    }
    var param = {
        courseId: courseId,
        courseName : courseName,
        type: type,
        chapterIdA: chapterIdA,
        chapterIdB: chapterIdB,
        chapterIdC: chapterIdC,
        path : courseId+"//"+path+"//"+JSON.parse(tasks).videoCcid,
        pathname : courseName+"//"+chapterNameA+"//"+chapterNameB+"//"+chapterNameC+"//"+JSON.parse(tasks).title,
        index : index,
        tasks: JSON.parse(tasks)
    };
    var coursestatus = $api.getStorage("coursestatus"+versionId);
    param.islock = coursestatus.islock;
    param.activestate = coursestatus.activestate;
    param.expirationTime = coursestatus.expirationTime;                
    param.isbuy = coursestatus.isbuy;                
    $api.setStorage('my_to_down', param);
    var jsfun = "my_to_down();";
    api.execScript({
        name: 'root',
        script: jsfun
    });
    
    
}

function set_down(data) {
    var res = JSON.stringify(data);
    var jsfun = "if(typeof(eval('set_down_status')=='function')){set_down_status(" + res + ");}";
    api.execScript({
        name: 'course-studying-top',
        frameName: 'catalog',
        script: jsfun
    });
    api.execScript({
        name: 'video-buffer',
        frameName: 'video-cache-f',
        script: jsfun
    });
    api.execScript({
        name: 'video',
        frameName: 'video-menu',
        script: jsfun
    });
    api.execScript({
        name: 'tasks-cache',
        frameName: 'tasks-cache-f',
        script: jsfun
    });
}

var is_added = true;

function mydown(result) {
    is_added = true;
    var down_data = result;
    var memberId = getstor('memberId');
    var tasks = result;
    var courseId = result.courseId,
        type = result.type,
        chapterIdA = result.chapterIdA,
        chapterIdB = result.chapterIdB,
        chapterIdC = result.chapterIdC,
        item = result.tasks.videoCcid;
    if (!CourseIsexpire(courseId)) {
        api.alert({
            title: '温馨提示',
            msg: '该课程已过期'
        }, function(ret, err) {});
        return false;
    }
    var is_down = isEmpty($api.getStorage(memberId + 'downed')) ? '' : $api.getStorage(memberId + 'downed');
    var data = {
        type: type,
        chapterIdA: chapterIdA,
        chapterIdB: chapterIdB,
        chapterIdC: chapterIdC,
        item : item
    };
    set_cache_lst(courseId, '');
    if (isEmpty(tasks)) {
        //无视频任务
        data.type = 'no_video';
        set_down(data);
        return false;
    }
    if(data.type != 4){
        var param = $api.getStorage('my_to_down');
        var memberId = getstor('memberId');
        // cache_model = api.require('lbbVideo');
        
        var downObj = {
            userId : memberId,
            courseId : param.courseId,
            courseName : param.courseName,
            videoId : param.tasks.videoCcid,
            expirationTime : param.expirationTime,
            path : param.path,
            pathName : param.pathname,
            isbuy : param.isbuy,
            islock : param.islock,
            activestate : param.activestate,
            index : param.index,
            videoNum : 10
        }
        //保存任务数据库
        cache_model.insertDowndCourseState(downObj,function(ret,err){
            //
        })
        // 保存课程信息库
        cache_model.inserCourseDetailJson({
            "userId" : memberId,
            "courseId" : param.courseId,
            "courseJson" : JSON.stringify(param.courseJson)
        },function(ret,err){

        })
    }
    

 
    switch (type) {
        case '1':
        case 1:
            //正在下载-》暂停
            stop_down(function(r) {
                if (api.systemType == "ios" && parseInt(r.status) == 0) {
                    return false;
                }
                // $api.rmStorage(memberId + 'downed');
                data.type = 1;
                set_down(data);
            });
            break;
        case '2':
        case 2:
            //暂停-》开始下载
            // stop_down(function(r) {
                if (api.systemType == "ios" && parseInt(r.status) == 0) {
                    return false;
                }
                // $api.rmStorage(memberId + 'downed');
                result.type = 3;
                mydown(result);
            // });
            break;
        case '5':
        case 5:
            //暂停-》开始下载
            // stop_down(function(r) {
                if (api.systemType == "ios" && parseInt(r.status) == 0) {
                    return false;
                }
                // $api.rmStorage(memberId + 'downed');
                result.type = 3;
                mydown(result);
            // });
            break;
        case '3':
        case 3:
            api.getFreeDiskSpace(function(Space, err) {
                var size = (Space.size / 1000 / 1000).toFixed(0);
                if (size < 300) {
                    data.type = 'less_space';
                    set_down(data);
                } else {
                    //暂停/(未下载过)-》下载中
                    //开始下载
                    var task_data = [];
    
                    for (var p in tasks) {
                        if (tasks[p].taskType == 'video') {
                            task_data.push({
                                chapterIdA: chapterIdA,
                                chapterIdB: chapterIdB,
                                chapterIdC: chapterIdC,
                                data: tasks[p]
                            });
                        }
                    }
                    var cache;
                    var task_length = Object.keys(task_data).length;
                    if (task_data.length >= 1) {
                        to_down(0);
                    } else {
                        //无视频任务
                        data.type = 'no_video';
                        set_down(data);
                        return false;
                    }

                    function to_down(m) {
                        if (isEmpty(task_data[m]) || isEmpty(task_data[m].data.videoCcid) || isEmpty(task_data[m].data.apiKey)) {
                            return false;
                        }
                        var title = task_data[m].data.title,
                            videoCcid = task_data[m].data.videoCcid,
                            videoSiteId = task_data[m].data.videoSiteId,
                            apiKey = task_data[m].data.apiKey,
                            taskId = task_data[m].data.taskId;
                        if (is_down) {
                            //一级章节下载记录
                            if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                $api.setStorage(memberId + chapterIdA + 'progress', 1);
                            }
                            //二级章节下载记录
                            if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                $api.setStorage(memberId + chapterIdA + 'progress', 1);
                                $api.setStorage(memberId + chapterIdB + 'progress', 1);
                            }
                            //三级章节下载记录
                            if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                                $api.setStorage(memberId + chapterIdA + 'progress', 1);
                                $api.setStorage(memberId + chapterIdB + 'progress', 1);
                                $api.setStorage(memberId + chapterIdC + 'progress', 1);
                            }
                            //下载队列
                            read_file(memberId + 'Queue.db', function(res, err) {
                                if (res.status && res.data) {
                                    var Queue = JSON.parse(res.data);
                                    ////变成等待中的状态
                                    data.type = 'wait';
                                    set_down(data);
                                    var flag = true;
                                    for (var p in Queue) {
                                        //一级章节下载记录
                                        if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                            if ((!isEmpty(Queue[p]['chapterIdA']) && Queue[p]['chapterIdA'] == chapterIdA) || (!isEmpty(Queue[p]['chapterida']) && Queue[p]['chapterida'] == chapterIdA)) {
                                                flag = false;
                                            }
                                        }
                                        //二级章节下载记录
                                        if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                            if ((!isEmpty(Queue[p]['chapterIdB']) && Queue[p]['chapterIdB'] == chapterIdB) || (!isEmpty(Queue[p]['chapteridb']) && Queue[p]['chapteridb'] == chapterIdB)) {
                                                flag = false;
                                            }
                                        }
                                        //三级章节下载记录
                                        if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                                            if ((!isEmpty(Queue[p]['chapterIdC']) && Queue[p]['chapterIdC'] == chapterIdC) || (!isEmpty(Queue[p]['chapteridc']) && Queue[p]['chapteridc'] == chapterIdC)) {
                                                flag = false;
                                            }
                                        }
                                    }
                                    if (flag) {
                                        Queue.push(down_data);
                                        write_file(memberId + 'Queue.db', JSON.stringify(Queue), function(ret, err) {})
                                    }
                                } else {
                                    Queue = [];
                                    Queue.push(down_data);
                                    write_file(memberId + 'Queue.db', JSON.stringify(Queue), function(ret, err) {})
                                }
                            });
                            return false;
                        }
                        //下载中ui监听
                        data.type = 'ing';
                        set_down(data);

                        var lslcallback = function(ret, err) {
                            //alert(JSON.stringify(ret));
                            // api.sendEvent({
                            //     name: 'DOWN',
                            //     extra: {
                            //         ret:ret
                            //     }
                            // });
                            if (api.systemType == 'ios' && (ret.status == 3 || ret.status == '3')) {
                                var downed = $api.getStorage(memberId + 'downed');
                                if (downed) {
                                    var mychapterIdA = isEmpty(downed['chapterIdA']) ? '' : downed['chapterIdA'];
                                    var mychapterIdB = isEmpty(downed['chapterIdB']) ? '' : downed['chapterIdB'];
                                    var mychapterIdC = isEmpty(downed['chapterIdC']) ? '' : downed['chapterIdC'];
                                    //一级章节下载记录
                                    if (!isEmpty(mychapterIdA) && isEmpty(mychapterIdB) && isEmpty(mychapterIdC)) {
                                        $api.rmStorage(memberId + mychapterIdA + 'progress');
                                    }
                                    //二级章节下载记录
                                    if (!isEmpty(mychapterIdA) && !isEmpty(mychapterIdB) && isEmpty(mychapterIdC)) {
                                        $api.rmStorage(memberId + mychapterIdB + 'progress');
                                    }
                                    //三级章节下载记录
                                    if (!isEmpty(mychapterIdC) && !isEmpty(mychapterIdA) && !isEmpty(mychapterIdB)) {
                                        $api.rmStorage(memberId + mychapterIdC + 'progress');
                                    }
                                    return false;
                                }
                            }
                            if (ret.progress <= 0 && ret && ret.status != 0) {
                                return false;
                            }


                            if (api.systemType == 'android') {
                                if (ret.status == '300' || ret.status == 300) {
                                    clearInterval(down_timer);
                                    clearTimeout(down_setTimeout);
                                    is_count = false;
                                    data.type = 'wait';
                                    set_down(data);
                                    return false;
                                }
                            }

                            if (ret && (ret.status == 1 || ret.status == '1')) {
                                var progress = parseInt(ret.progress);
                                if (progress > 100) {
                                    return false;
                                }

                                $api.setStorage(videoCcid, ret.finish);
                                if (is_added) {
                                    //下载中ui监听
                                    data.type = 'ing';
                                    set_down(data);
                                    //下载队列
                                    read_file(memberId + 'Queue.db', function(res, err) {
                                        if (res.status && res.data) {
                                            var Queue = JSON.parse(res.data);
                                            var flag = true;
                                            for (var p in Queue) {
                                                //一级章节下载记录
                                                if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                                    if ((!isEmpty(Queue[p]['chapterIdA']) && Queue[p]['chapterIdA'] == chapterIdA) || (!isEmpty(Queue[p]['chapterida']) && Queue[p]['chapterida'] == chapterIdA)) {
                                                        flag = false;
                                                    }
                                                }
                                                //二级章节下载记录
                                                if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                                    if ((!isEmpty(Queue[p]['chapterIdB']) && Queue[p]['chapterIdB'] == chapterIdB) || (!isEmpty(Queue[p]['chapteridb']) && Queue[p]['chapteridb'] == chapterIdB)) {
                                                        flag = false;
                                                    }
                                                }
                                                //三级章节下载记录
                                                if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                                                    if ((!isEmpty(Queue[p]['chapterIdC']) && Queue[p]['chapterIdC'] == chapterIdC) || (!isEmpty(Queue[p]['chapteridc']) && Queue[p]['chapteridc'] == chapterIdC)) {
                                                        flag = false;
                                                    }
                                                }
                                            }
                                            if (flag) {
                                                Queue.push(down_data);
                                                write_file(memberId + 'Queue.db', JSON.stringify(Queue), function(ret, err) {})
                                            }
                                        } else {
                                            Queue = [];
                                            Queue.push(down_data);
                                            write_file(memberId + 'Queue.db', JSON.stringify(Queue), function(ret, err) {})
                                        }
                                    });
                                    is_added = false;
                                }
                                var cahce_data = $api.getStorage('cahce_data' + memberId + courseId);


                                if (isEmpty(cahce_data)) {
                                    cahce_data = {};
                                }
                                if (typeof cahce_data[chapterIdA] == "undefined" || isEmpty(cahce_data[chapterIdA])) {
                                    cahce_data[chapterIdA] = {};
                                }
                                var n = 0;
                                var num = 0;
                                var cahce_dataKeys;

                                //一级章节下载记录
                                if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                    cahce_data[chapterIdA][ret.videoId] = progress;
                                    cahce_dataKeys = Object.keys(cahce_data[chapterIdA]);
                                    for (var key in cahce_dataKeys) {
                                        if (cahce_dataKeys[key] != 'progress') {
                                            n += parseInt(cahce_data[chapterIdA][cahce_dataKeys[key]]);
                                        }
                                    }
                                    //当前环形进度
                                    // num = parseInt(n / task_length);
                                    // cahce_data[chapterIdA]['progress'] = num;
                                    num = ret.progress;
                                    cahce_data[chapterIdA]['progress'] = num;
                                }
                                //二级章节下载记录
                                if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                    if (typeof cahce_data[chapterIdA][chapterIdB] == "undefined" || isEmpty(cahce_data[chapterIdA][chapterIdB])) {
                                        cahce_data[chapterIdA][chapterIdB] = {};
                                    }
                                    cahce_data[chapterIdA][chapterIdB][ret.videoId] = progress;
                                    cahce_dataKeys = Object.keys(cahce_data[chapterIdA][chapterIdB]);
                                    for (var key in cahce_dataKeys) {
                                        if (cahce_dataKeys[key] != 'progress') {
                                            n += parseInt(cahce_data[chapterIdA][chapterIdB][cahce_dataKeys[key]]);
                                        }
                                    }
                                    //当前环形进度
                                    // num = parseInt(n / task_length);
                                    num = ret.progress;
                                    cahce_data[chapterIdA][chapterIdB]['progress'] = num;
                                }
                                //三级章节下载记录
                                if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                                    if (typeof cahce_data[chapterIdA][chapterIdB] == "undefined" || isEmpty(cahce_data[chapterIdA][chapterIdB])) {
                                        cahce_data[chapterIdA][chapterIdB] = {};
                                    }
                                    if (typeof cahce_data[chapterIdA][chapterIdB][chapterIdC] == "undefined" || isEmpty(cahce_data[chapterIdA][chapterIdB][chapterIdC])) {
                                        cahce_data[chapterIdA][chapterIdB][chapterIdC] = {};
                                    }
                                    cahce_data[chapterIdA][chapterIdB][chapterIdC][ret.videoId] = progress;
                                    cahce_dataKeys = Object.keys(cahce_data[chapterIdA][chapterIdB][chapterIdC]);
                                    for (var key in cahce_dataKeys) {
                                        if (cahce_dataKeys[key] != 'progress') {
                                            n += parseInt(cahce_data[chapterIdA][chapterIdB][chapterIdC][cahce_dataKeys[key]]);
                                        }
                                    }
                                    //当前环形进度
                                    // num = parseInt(n / task_length);
                                    num = ret.progress;
                                    cahce_data[chapterIdA][chapterIdB][chapterIdC]['progress'] = num;
                                }




                                $api.setStorage('cahce_data' + memberId + courseId, cahce_data);
                                //当前下载记录
                                if (m < task_length) {
                                    cache = {
                                        videoSiteId: videoSiteId,
                                        apiKey: apiKey,
                                        // progress: num,
                                        progress : ret.progress,
                                        courseId: courseId,
                                        chapterIdA: chapterIdA,
                                        chapterIdB: chapterIdB,
                                        chapterIdC: chapterIdC,
                                        taskId: taskId,
                                        videoCcid: videoCcid,
                                        title: title,
                                        tasks: tasks
                                    };
                                    var cache_ccid = {};
                                    cache_ccid[videoCcid] = cache;
                                    $api.setStorage('cache' + videoCcid, cache_ccid);
                                    $api.setStorage(memberId + 'downed', cache);
                                }
                                //一级章节下载记录
                                if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                    // $api.setStorage(memberId + chapterIdA + 'progress', num == 0 ? 1 : num);
                                    $api.setStorage(memberId + chapterIdA + 'progress', ret.progress == 0 ? 1 : ret.progress);

                                }
                                //二级章节下载记录
                                if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                    $api.setStorage(memberId + chapterIdA + 'progress', 1);
                                    // $api.setStorage(memberId + chapterIdB + 'progress', num == 0 ? 1 : num);
                                    $api.setStorage(memberId + chapterIdB + 'progress', ret.progress == 0 ? 1 : ret.progress);
                                }
                                //三级章节下载记录
                                if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                                    $api.setStorage(memberId + chapterIdA + 'progress', 1);
                                    $api.setStorage(memberId + chapterIdB + 'progress', 1);
                                    // $api.setStorage(memberId + chapterIdC + 'progress', num == 0 ? 1 : num);
                                    $api.setStorage(memberId + chapterIdC + 'progress', ret.progress == 0 ? 1 : ret.progress);
                                }





                                api.getFreeDiskSpace(function(retd, err) {
                                    var size = (retd.size / 1000 / 1000).toFixed(2);
                                    if (size <= 300) {
                                        stop_down(function(r) {
                                            data.type = 'less_space';
                                            set_down(data);
                                        });
                                    } else {
                                        var downed = $api.getStorage(memberId + 'downed');
                                        // if (!isEmpty(downed) && parseInt(num) < parseInt(downed[progress])) {
                                        if (!isEmpty(downed) && parseInt(ret.progress) < parseInt(downed[progress])) {
                                            return false;
                                        }
                                        //下载进度回调
                                        data.type = 'progress';
                                        data.size = size;
                                        // data.progress = num;
                                        data.progress = ret.progress;
                                        set_down(data);
                                        count_speed();


                                        $api.setStorage(videoCcid, ret.progress);
                                        //进度圈圈样式
                                        if (parseInt(ret.progress) >= 100) {
                                            $api.setStorage(videoCcid, ret.finish);
                                            if (ret.finish != 'YES') {
                                                return false;
                                            }
                                            // if ((m == task_data.length - 1 || num == 100)) {
                                            if ((m == task_data.length - 1 || ret.progress == 100)) {

                                                cache = {
                                                    videoSiteId: videoSiteId,
                                                    apiKey: apiKey,
                                                    progress: 100,
                                                    courseId: courseId,
                                                    chapterIdA: chapterIdA,
                                                    chapterIdB: chapterIdB,
                                                    chapterIdC: chapterIdC,
                                                    taskId: taskId,
                                                    videoCcid: videoCcid,
                                                    title: title,
                                                    tasks: task_data
                                                };
                                                var cache_ccid = {};
                                                cache_ccid[videoCcid] = cache;
                                                $api.setStorage('cache' + videoCcid, cache_ccid);
                                                $api.setStorage(memberId + 'downed', cache);
                                                //一级章节下载记录
                                                if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                                    $api.setStorage(memberId + chapterIdA + 'progress', 100);
                                                }
                                                //二级章节下载记录
                                                if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                                                    $api.setStorage(memberId + chapterIdA + 'progress', 1);
                                                    $api.setStorage(memberId + chapterIdB + 'progress', 100);
                                                }
                                                //三级章节下载记录
                                                if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                                                    $api.setStorage(memberId + chapterIdA + 'progress', 1);
                                                    $api.setStorage(memberId + chapterIdB + 'progress', 1);
                                                    $api.setStorage(memberId + chapterIdC + 'progress', 100);
                                                }
                                                //下载完成
                                                $api.rmStorage(memberId + 'downed');
                                                data.type = 'end';
                                                set_down(data);
                                                //删除下载队列  接着下一下载
                                                //下载队列
                                                read_file(memberId + 'Queue.db', function(res, err) {
                                                    if (res.status && res.data) {
                                                        var Queue = JSON.parse(res.data);
                                                        for (var p in Queue) {
                                                            if ((!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC) && !isEmpty(Queue[p]['chapterIdA']) && Queue[p]['chapterIdA'] == chapterIdA) ||
                                                                (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC) && !isEmpty(Queue[p]['chapterida']) && Queue[p]['chapterida'] == chapterIdA) ||
                                                                (!isEmpty(chapterIdB) && !isEmpty(chapterIdA) && isEmpty(chapterIdC) && !isEmpty(Queue[p]['chapterIdB']) && Queue[p]['chapterIdB'] == chapterIdB) ||
                                                                (!isEmpty(chapterIdB) && !isEmpty(chapterIdA) && isEmpty(chapterIdC) && !isEmpty(Queue[p]['chapteridb']) && Queue[p]['chapteridb'] == chapterIdB) ||
                                                                (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB) && !isEmpty(Queue[p]['chapterIdC']) && Queue[p]['chapterIdC'] == chapterIdC) ||
                                                                (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB) && !isEmpty(Queue[p]['chapteridc']) && Queue[p]['chapteridc'] == chapterIdC)
                                                            ) {
                                                                Queue.splice(p, 1);
                                                                if (Queue.length > 0) {
                                                                    var next = isEmpty(Queue[0]) ? '' : Queue[0];
                                                                    if (next) {
                                                                        result.chapterIdA = next['chapterIdA'];
                                                                        result.chapterIdB = next['chapterIdB'];
                                                                        result.chapterIdC = next['chapterIdC'];
                                                                        result.tasks = next['tasks'];
                                                                        set_down(result);
                                                                        result.type = 3;
                                                                        mydown(result);
                                                                    }
                                                                }
                                                                write_file(memberId + 'Queue.db', JSON.stringify(Queue), function(ret, err) {});
                                                                break;
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                            // m++;
                                            // if (m < task_length) {
                                            //     to_down(m);
                                            // }
                                        }
                                    }
                                });
                            } else if (ret.status == 0 || ret.status == '0') {
                                if (window.shut_network == false && window.allow_down == true && api.connectionType == 'wifi') {
                                    clearInterval(down_timer);
                                    clearTimeout(down_setTimeout);
                                    is_count = false;
                                    if ($api.getStorage(memberId + 'downed')) {
                                        data.type = 'error';
                                        //$api.rmStorage(memberId + 'downed');
                                    } else {
                                        data.type = 'redown';
                                    }
                                    set_down(data);
                                    return false;
                                }
                            }
                        };

                        if (m < task_length && !isEmpty($api.getStorage(videoCcid)) && $api.getStorage(videoCcid) == 'YES') {
                            var retlsl = {};
                            retlsl.status = 1;
                            retlsl.finish = 'YES';
                            retlsl.progress = 100;
                            retlsl.videoId = videoCcid;
                            
                            lslcallback(retlsl);
                            return false;
                        } else {
                            var retlsl = {};
                            retlsl.status = 1;
                            retlsl.finish = 'NO';
                            retlsl.progress = !isEmpty($api.getStorage(videoCcid)) ? $api.getStorage(videoCcid) : 1;
                            retlsl.videoId = videoCcid;
                            lslcallback(retlsl);
                        }
                        video_cache('download', title, videoCcid, videoSiteId, apiKey, lslcallback);
                    }

                }
            });
            break;
        case '4':
        case 4:
            //已完成
            break;
    }
}

function accAdd(num1, num2) {
    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    // return Math.round(num1 * m + num2 * m) / m;
    return parseInt(num1 * m + num2 * m) / m;
}

function get_dowm(chapterIdA, chapterIdB, chapterIdC) {
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
    var type = memberId + sel + 'progress';
    var precent = isEmpty($api.getStorage(type)) || $api.getStorage(type) == undefined || $api.getStorage(type) == 'NaN' ? 0 : $api.getStorage(type);
    return precent;
}
// function get_dowm2(videoId){
//     if(isEmpty(videoId)){
//         return false;
//     }
//     cache_model = api.require('lbbVideo');

//     var param = {
//         "userId" : getstor('memberId'),
//         "videoId" : videoId
//     }
//     cache_model.getTaskData(param,function(ret,err){
//         // var getData = null;
//         // ret = JSON.parse(ret.data.replace(/\\/g,''));
        
//         // if(!isEmpty(ret)){
//         //     getData = {
//         //         progress : ret[0].progress,
//         //         state : ret[0].state,
//         //         playTime : ret[0].playTime
//         //     }
//         // }else{
//         //     getData =  {
//         //         progress : 0,
//         //         state : 3,
//         //         playTime : 0
//         //     }
//         // } 
//         // alert(JSON.stringify(ret))
//         $(".task"+videoId).attr("type",1);
//         $(".task"+videoId).find(".val").html(10)
//         init_process();
//     })

// }
function is_loadA(chata) {
    var memberId = getstor('memberId');
    chata = memberId + chata + 'progress';
    if (!isEmpty($api.getStorage(chata) && $api.getStorage(chata) == 0)) {
        return '';
    }
    return isEmpty($api.getStorage(chata)) || $api.getStorage(chata) == undefined || $api.getStorage(chata) == 'NaN' ? 'none' : '';
}

function is_loadB(chatab) {
    var memberId = getstor('memberId');
    chatab = memberId + chatab + 'progress';
    if (!isEmpty($api.getStorage(chatab) && $api.getStorage(chatab) == 0)) {
        return '';
    }
    return isEmpty($api.getStorage(chatab)) || $api.getStorage(chatab) == undefined || $api.getStorage(chatab) == 'NaN' ? 'none' : '';
}

function is_loadC(chatac) {
    var memberId = getstor('memberId');
    chatac = memberId + chatac + 'progress';
    if (!isEmpty($api.getStorage(chatac) && $api.getStorage(chatac) == 0)) {
        return '';
    }
    return isEmpty($api.getStorage(chatac)) || $api.getStorage(chatac) == undefined || $api.getStorage(chatac) == 'NaN' ? 'none' : '';
}

function down_stop(callback) { //删除下载
    var memberId = getstor('memberId');
    var downed = $api.getStorage(memberId + 'downed');

    if (cache_model == null) {
        cache_model = api.require('lbbVideo');
    }
    cache_model.downloadStop(function(ret, err) {

        $api.rmStorage(memberId + 'downed');
        if (downed) {
            var chapterIdA = isEmpty(downed['chapterIdA']) ? '' : downed['chapterIdA'];
            var chapterIdB = isEmpty(downed['chapterIdB']) ? '' : downed['chapterIdB'];
            var chapterIdC = isEmpty(downed['chapterIdC']) ? '' : downed['chapterIdC'];
            //一级章节下载记录
            if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                $api.rmStorage(memberId + chapterIdA + 'progress');
            }
            //二级章节下载记录
            if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                $api.rmStorage(memberId + chapterIdB + 'progress');
            }
            //三级章节下载记录
            if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                $api.rmStorage(memberId + chapterIdC + 'progress');
            }
            callback(true);
        }
    });
}

function stop_down(callback) { //暂停下载
    var memberId = getstor('memberId');
    if (cache_model == null) {
        cache_model = api.require('lbbVideo');
    }
    cache_model.downloadStop({"userId":memberId},function(ret, err) {
        $api.rmStorage(memberId + 'downed');
        callback(ret);
    });
}

function my_to_down() {
    var data = $api.getStorage('my_to_down');
    //已完成
    if(data.type == 4 || data.type == '4'){
        return false;
    }
    //4G网络是否下载
  
    if((api.connectionType == '4g' || api.connectionType == '4G') && (data.type == 2 || data.type == '2' || data.type == 3 || data.type == '3') && api.connectionType != 'wifi'){
        api.confirm({
            title: '友情提示',
            msg: '当前处于4G网络，会消耗您的大量流量，您确定要下载吗？',
            buttons: ['确定', '取消']
        }, function(ret, err) {
            if (2 == ret.buttonIndex) {//用户取消
                return false;
            }
            if (1 == ret.buttonIndex) {//确定
                 mydown(data);
                return false;
            }
        });
         return false;
    }
    
    if((api.connectionType == '4g' || api.connectionType == '4G') && (data.type == 1 || data.type == '1') && api.connectionType != 'wifi'){
        mydown(data);
        return false;
    }
    

    if (api.connectionType == 'wifi') { //为wifi可以下载

        mydown(data);

        return false;
    }

    if (api.connectionType == 'none' || api.connectionType == 'unknown') {
        data.type = 'shut_network';

        set_down(data);

        return false;
    }
    if (api.connectionType != 'wifi') {

        data.type = 'deny_down';

        set_down(data);

        return false;
    }
}

function rmVideo(res) {
    var videoIds = JSON.parse(res);
    if (cache_model == null) {
        cache_model = api.require('lbbVideo');
    }
    if (!isEmpty(cache_model) && !isEmpty(videoIds)) {
        for (var p in videoIds) {
            delVideoFile(videoIds[p]);
            /*cache_model.rmVideo({
                videoId: videoIds[p]
            });*/
        }
    }
}

/*
 下载速度计算
 */
var is_count = false;
var down_timer;
var down_setTimeout;

function count_speed() {
    if (!is_count) {
        clearInterval(down_timer);
        clearTimeout(down_setTimeout);
        down_timer = setInterval(function() {
            api.getFreeDiskSpace(function(ret, err) {
                var size1 = ret.size;
                down_setTimeout = setTimeout(function() {
                    api.getFreeDiskSpace(function(retd, err) {
                        var size2 = retd.size;
                        if (size1 >= size2) {
                            var speed = (((size1 - size2) / 1000 / 1000) * 1024).toFixed(0);
                            api.sendEvent({
                                name: 'down_speed',
                                // name: 'DOWN',
                                extra: {
                                    speed: speed
                                }
                            });
                        }
                    })
                }, 1500);
            });
        }, 1500);
        is_count = true;
    }
}
//苹果appstore
window.allow_down = true;
window.shut_network = false;


function delVideoFile(videoId) {
    //  alert(videoId);
    var userid = getstor("memberId");
    var courseArr = $api.getStorage(userid + "video-buffer");
    var videoIdArr = [];
    if (!isEmpty(courseArr)) {
        for (var key in courseArr) {
            var courseId = courseArr[key];
            var data = JSON.parse(api.readFile({ sync: true, path: 'box://' + userid + courseId + ".db" }));
            //alert(data);
            //把正在下在的列表中的视频id放入一个数据中
            for (var i in data) {
                var data1 = data[i].chapters;
                //chapters
                for (var j in data1) {
                    var data2 = data1[j];
                    if (data2.isLeaf == "true") { //一级处理
                        //api.toast({msg:"111111-----"+data2.chapterId});
                        if (is_loadA(data2.chapterId) == '') {
                            var data3 = data2.tasks;
                            for (var g in data3) {
                                //判断是否在下载
                                videoIdArr.push(data3[g].videoCcid);
                            }
                        }
                    } else {
                        //二级处理
                        var children = data2[j];
                        for (var c in children) {
                            var data4 = children[c];
                            if (data4.isLeaf == "true") {
                                if ("" == is_loadB(data4.chapterId)) {
                                    var data5 = data4.tasks;
                                    for (var k in data5) {
                                        //判断是否在下载
                                        videoIdArr.push(data5[k].videoCcid);
                                    }
                                }
                            } else {
                                //三级处理
                                var children3 = data4[c];
                                for (var c3 in children3) {
                                    var data6 = children3[c3];
                                    if (data6.isLeaf == "true") {
                                        if ("" == is_loadC(data6.chapterId)) {
                                            var data7 = data6.tasks;
                                            for (var m in data7) {
                                                //判断是否在下载
                                                videoIdArr.push(data7[m].videoCcid);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //      alert(videoId);
        // api.alert({msg:videoIdArr});
    }
    //判断是否删除
    var isdel = true;
    for (var v1 in videoIdArr) {
        if (videoIdArr[v1] == videoId) {
            isdel = false;
            break;
        }
    }
    if (isdel) {
        //alert(isdel+"----"+videoId);
        $api.rmStorage(videoId);
        $api.rmStorage('cache' + videoId);
        cache_model.rmVideo({ videoId: videoId });
    }
}

function getdownrecord(){

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
            // alert(domid+"==="+domprogress)
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
 //判断实心圈、半心圈、空心圈，参数type:'circle'、'progress',参数chap_id二级章节id
      function isSolidcircle(type, chap_id, task_id, course_id, from) {
          if (isEmpty(course_id)) {
              var courseId = api.pageParam.course_id;
          } else {
              var courseId = course_id;
          }
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
                      //处理过的课程进度
                      var arr = {};
                      var data_arr = course_detail.chapters;
                      for (var i in data_arr) {
                          if (data_arr[i].isLeaf == 'false') {
                              var child = data_arr[i].children;
                              for (var j in child) {
                                  if (child[j].isLeaf == 'false') {
                                      var child2 = child[j].children;
                                      for (var k in child2) {
                                          var cId = child2[k].chapterId;
                                          arr[cId] = {};
                                          for (var x in child2[k].tasks) {
                                              if (child[j].isLeaf == 'false') {
      
                                              } else {
                                                  var taskid = child2[k].tasks[x].taskId;
                                                  arr[cId][taskid] = {
                                                      'progress': 0,
                                                      'isok': 0,
                                                      'total': 0
                                                  };
                                             }
                                          }
                                      }
                                  } else {
                                      var cId = child[j].chapterId;
                                      arr[cId] = {};
                                      for (var k in child[j].tasks) {
                                          var taskid = child[j].tasks[k].taskId;
                                          arr[cId][taskid] = {
                                              'progress': 0,
                                              'isok': 0,
                                              'total': 0
                                          };
                                      }
                                  }
                              }
                          } else {
                              var cId = data_arr[i].chapterId;
                              arr[cId] = {};
                              for (var k in data_arr[i].tasks) {
                                  var taskid = data_arr[i].tasks[k].taskId;
                                  arr[cId][taskid] = {
                                      'progress': 0,
                                      'isok': 0,
                                      'total': 0
                                  };
                              }
                          }
                      }
      
                      //获取课程任务进度列表（new）tested
                      var param = {
                          'token': $api.getStorage('token'), //必须
                          'memberId' : getstor('memberId'),
                          'courseId': courseId, //课程ID,必须
                          'charpterId': '', //章节ID,非必须
                          'taskId': ''//任务ID,非必须
                      };
                      ajaxRequest({ 'origin': 'http://action.caicui.com/', 'pathname': 'api/userAction/course/getTasksProgress/v1.0/' }, 'get', param, function(ret, err) {
                      //ajaxRequest('api/v2/study/getTasksProgress', 'get', param, function (ret, err) {//008.022 获取课程任务进度列表（new）tested，接口编号：008-022
                          if (err) {
                              return false;
                          } else if (ret && ret.state == 'success') {
                              var tasksNum = 0;
                              var chaptersNum = 0;
                              //课程进度
                              for (var i in ret.data) {
                                  var tmpdata = ret.data[i];
                                  if(tmpdata.state == 1){
                                    tasksNum++;
                                  }
                                  if (!isEmpty(arr[tmpdata.chapterId]) && !isEmpty(arr[tmpdata.chapterId][tmpdata.taskId])) {
                                      if (tmpdata.state == 1) {
                                          arr[tmpdata.chapterId][tmpdata.taskId].isok = 3;
                                      } else {
                                          if (tmpdata.progress > 0) {
                                              arr[tmpdata.chapterId][tmpdata.taskId].isok = 1;
                                          } else {
                                              arr[tmpdata.chapterId][tmpdata.taskId].isok = 0;
                                          }
                                      }
                                      arr[tmpdata.chapterId][tmpdata.taskId].progress = tmpdata.progress;
                                      arr[tmpdata.chapterId][tmpdata.taskId].total = tmpdata.total;
                                  }
                              }
                              //处理过的课程进度
                              if (type == 'circle') {
                                  //获取圈圈样式
                                  if (from == 'video-menu') {
                                      $('#chaList').find('.dot-status').each(function () {
                                          var tmp_chapID = $(this).attr('data-chapId');
                                          if (!isEmpty(tmp_chapID) && !isEmpty(arr[tmp_chapID])) {
                                              var num = 0;
                                              var len = 0;
                                              for (var i in arr[tmp_chapID]) {
                                                  num += parseInt(arr[tmp_chapID][i].isok);
                                                  ++len;
                                              }
      
      
                                              if (num > 0) {
                                                  if (num == len * 3) {
                                                    chaptersNum++;
                                                      $(this).attr('type', '3');
                                                      //实心圈
                                                  } else {
                                                      //半圈
                                                      $(this).attr('type', '2');
                                                  }
                                              } else {
                                                  $(this).attr('type', '1');
                                                  //空圈
                                              }
      
                                          }
                                      });
                                  } else {
                                      $('#content').find('.dot-status').each(function () {
                                          var tmp_chapID = $(this).attr('data-chapId');
                                          if (!isEmpty(tmp_chapID) && !isEmpty(arr[tmp_chapID])) {
                                              var num = 0;
                                              var len = 0;
                                              for (var i in arr[tmp_chapID]) {
                                                  num += parseInt(arr[tmp_chapID][i].isok);
                                                  ++len;
                                              }
      
      
                                              if (num > 0) {
                                                  if (num == len * 3) {
                                                    chaptersNum++;
                                                      $(this).attr('type', '3');
                                                      //实心圈
                                                  } else {
                                                      //半圈
                                                      $(this).attr('type', '2');
                                                  }
                                              } else {
                                                  $(this).attr('type', '1');
                                                  //空圈
                                              }
      
                                          }
                                      });
                                  }
                              } else if (type == 'progress') {
                                  //如果是获取任务进度条
                                  $('#chaTask').find('.taskProgress').each(function () {
                                      $(this).css('width', '100%');
                                  });
                              }
                              api.sendEvent({
                                name : 'setChaptersNum',
                                extra : {
                                  'chaptersNum' : chaptersNum,
                                  'chaptersNumTotal' : course_detail.chapterNum
                                }
                              })
                              api.sendEvent({
                                name : 'setTasksNum',
                                extra : {
                                  'tasksNum' : tasksNum,
                                  'tasksNumTotal' : course_detail.taskNum
                                }
                              })
                          }
                      });
      
      
                  }
              });
          } else {
              course_detail = tmp_course_detail;//存储课程详细信息
              //处理过的课程进度
              //处理过的课程进度
              var arr = {};
              var data_arr = course_detail.chapters;
              for (var i in data_arr) {
                  if (data_arr[i].isLeaf == 'false') {
                      var child = data_arr[i].children;
                      for (var j in child) {
                          if (child[j].isLeaf == 'false') {
                              var child2 = child[j].children;
                              for (var k in child2) {
                                  var cId = child2[k].chapterId;
                                  arr[cId] = {};
                                  for (var x in child2[k].tasks) {
                                      //if (child[j].isLeaf == 'false') {
      
                                      //} else {
                                          var taskid = child2[k].tasks[x].taskId;
                                          arr[cId][taskid] = {
                                              'progress': 0,
                                              'isok': 0,
                                              'total': 0
                                          };
                                     // }
                                  }
                              }
                          } else {
                              var cId = child[j].chapterId;
                              arr[cId] = {};
                              for (var k in child[j].tasks) {
                                  var taskid = child[j].tasks[k].taskId;
                                  arr[cId][taskid] = {
                                      'progress': 0,
                                      'isok': 0,
                                      'total': 0
                                  };
                              }
                          }
                      }
                  } else {
                      var cId = data_arr[i].chapterId;
                      arr[cId] = {};
                      for (var k in data_arr[i].tasks) {
                          var taskid = data_arr[i].tasks[k].taskId;
                          arr[cId][taskid] = {
                              'progress': 0,
                              'isok': 0,
                              'total': 0
                          };
                      }
                  }
              }
      
      
              //获取课程任务进度列表（new）tested
              var param = {
                  'token': $api.getStorage('token'), //必须
                  'memberId' : getstor('memberId'),
                  'courseId': courseId, //课程ID,必须
                  'charpterId': '', //章节ID,非必须
                  'taskId': ''//任务ID,非必须
              };
              ajaxRequest({ 'origin': 'http://action.caicui.com/', 'pathname': 'api/userAction/course/getTasksProgress/v1.0/' }, 'get', param, function(ret, err) {
              //ajaxRequest('api/v2/study/getTasksProgress', 'get', param, function (ret, err) {//008.022 获取课程任务进度列表（new）tested，接口编号：008-022
                  if (err) {
                      return false;
                  } else if (ret && ret.state == 'success') {
                      var tasksNum = 0;
                      var chaptersNum = 0;
                      //课程进度
                      for (var i in ret.data) {
                          var tmpdata = ret.data[i];
                          if(tmpdata.state == 1){
                            tasksNum++;
                          }
                          if (!isEmpty(arr[tmpdata.chapterId]) && !isEmpty(arr[tmpdata.chapterId][tmpdata.taskId])) {
                              if (tmpdata.state == 1) {
                                  arr[tmpdata.chapterId][tmpdata.taskId].isok = 3;
                              } else {
                                  if (tmpdata.progress > 0) {
                                      arr[tmpdata.chapterId][tmpdata.taskId].isok = 1;
                                  } else {
                                      arr[tmpdata.chapterId][tmpdata.taskId].isok = 0;
                                  }
                              }
      
                              arr[tmpdata.chapterId][tmpdata.taskId].progress = tmpdata.progress;
                              arr[tmpdata.chapterId][tmpdata.taskId].total = tmpdata.total;
                          }
                      }
                      //处理过的课程进度
                      if (type == 'circle') {
                          if (from == 'video-menu') {
                              $('#chaList').find('.dot-status').each(function () {
                                  var tmp_chapID = $(this).attr('data-chapId');
      
                                  if (!isEmpty(tmp_chapID) && !isEmpty(arr[tmp_chapID])) {
                                      var num = 0;
                                      var len = 0;
                                      for (var i in arr[tmp_chapID]) {
                                          num += parseInt(arr[tmp_chapID][i].isok);
                                          ++len;
                                      }
      
                                      if (num > 0) {
                                          if (num == len * 3) {
                                            chaptersNum++;
                                              $(this).attr('type', '3');//实心圈
                                              //api.alert({msg: arr['ff8080814db86d41014dc1a26c4f0539']});
                                          } else {
                                              //半圈
                                              $(this).attr('type', '2');
                                          }
                                      } else {
                                          $(this).attr('type', '1');
                                          //空圈
                                      }
      
                                  }
                              });
                          } else {
                              $('#content').find('.dot-status').each(function () {
                                  var tmp_chapID = $(this).attr('data-chapId');
                                  if (!isEmpty(tmp_chapID) && !isEmpty(arr[tmp_chapID])) {
                                      var num = 0;
                                      var len = 0;
                                      for (var i in arr[tmp_chapID]) {
                                          num += parseInt(arr[tmp_chapID][i].isok);
                                          ++len;
                                      }
      
                                      if (num > 0) {
                                          if (num == len * 3) {
                                            chaptersNum++;
                                              $(this).attr('type', '3');
                                              //实心圈
                                          } else {
                                              //半圈
                                              $(this).attr('type', '2');
                                          }
                                      } else {
                                          $(this).attr('type', '1');
                                          //空圈
                                      }
      
                                  }
                              });
                          }
                      } else if (type == 'progress') {
                          //如果是获取任务进度条
                          $('#chaTask').find('.taskProgress').each(function () {
                              var tmp_chapID = chap_id;
                              var tmp_taskID = $(this).attr('data-taskid');
                              if (!isEmpty(tmp_chapID) && !isEmpty(tmp_taskID)) {
                                  var tmp_task_progress = arr[tmp_chapID][tmp_taskID];
                                  if (isEmpty(tmp_task_progress) || isEmpty(tmp_task_progress.isok)) {
                                      $(this).css('width', '0%');
                                  } else if (tmp_task_progress.isok == 3) {
                                      $(this).css('width', '100%');
                                  } else if (tmp_task_progress.isok == 0) {
                                      $(this).css('width', '0%');
                                  } else if (tmp_task_progress.isok == 1) {
                                      var tmpwidth = ((tmp_task_progress.progress * 100) / tmp_task_progress.total).toFixed(2) + '%';
                                      $(this).css('width', tmpwidth);
                                  }
                              } else {
                                  $(this).css('width', '0%');
                              }
                          });
                      }
                      api.sendEvent({
                        name : 'setChaptersNum',
                        extra : {
                          'chaptersNum' : chaptersNum,
                          'chaptersNumTotal' : course_detail.chapterNum
                        }
                      })
                      api.sendEvent({
                        name : 'setTasksNum',
                        extra : {
                          'tasksNum' : tasksNum,
                          'tasksNumTotal' : course_detail.taskNum
                        }
                      })
                  }
              });
          }
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