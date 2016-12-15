/*	保存任务进度到数据库
	*	需要保存的任务进度字段
	*	{
	*		//token : '', // token
	*		//memberId : '', // 用户id
	*		//memberName : '', // 用户昵称

	*		categoryId : '', // 证书id
	*		categoryName : '', // 证书名称
	*		subjectId : '', // 科目id
	*		subjectName : '', // 科目名称
	*		courseId : '', // 课程id
	*		courseName : '', // 课程名称
	*		chapterId : '', // 章节id
	*		chapterName : '', // 章节名称
	*		taskId : '', // 任务id
	*		taskName ：'', // 任务名称

	*		progress : '', // 最后1次学习进度
	*		total: '', // 任务总长度
	*		state : '', // 是否播放结束
	*		isSend : '', // 是否已同步服务器 true false
	*		isSupply : '', // 1 是否补发 0是实时报文
	*		createDate : '', // 视频进度保存时间
	*		downloadProgress : '', // 下载进度
	*		downloadState : '', // 下载状态（ing，stop，end）
	*		downloadDate : '', // 下载日期
	*		expiredDate : '' // 过期日期
	*	}
	*	saveTasksProgress(data,callback); 保存数据到任务进度数据库 参数data：保存的数据
	*	showTasksProgress(); 显示任务进度数据库的数据
	*	clearTasksProgress(taskId); 删除任务进度数据库的数据 参数taskId：任务id，无参数：删除所有
	*	delTasksProgress(); 删除任务进度数据库表
	*	getCourseIdAll(callback); 获取所有的courseId 
	*	getTaskProgress(taskId, callback);  获取任务进度
	*	getCourseTaskProgress(courseId, callback);  获取课程下面所有的任务进度
	*	getTaskProgressNoSend(courseId, callback); 获取课程/所有未同步的任务进度
	*	getTasksProgressSupplyAll(); 获取所有未发送的进度
*/

;(function(window) {
    var DB = {
        db: '',
        taskNameDB: 'taskDB',
        taskNameTable: 'Task' + getstor('memberId'),
        online: function() {
            if (api.connectionType != 'unknown' || api.connectionType != 'none') {
                return true;
            } else {
                return false;
            }
        },
        saveTasksProgress: function(data, callback) { // 异步保存 数据库-任务
            if (data) {
                DB.taskDB(function(ret, err) {
                    if (ret.status) {
                        DB.insetTaskDB(data, callback);
                    }
                });
            }
        },
        showTasksProgress: function(callback) {
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    DB.selectSql(DB.taskNameDB, 'SELECT * FROM ' + DB.taskNameTable, function(ret, err) {
                        if (ret.status && ret.data && ret.data.length) {
                            alert('showTasksProgress:::' + JSON.stringify(ret));
                            if (callback) { callback() };
                        } else {
                            alert('查询进度失败');
                        }
                    });
                }
            });
        },
        clearTasksProgress: function(taskId) {
            var clearTaskId = arguments.length ? true : false;
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    var clearSelectSql = 'DELETE FROM ' + DB.taskNameTable;
                    if (clearTaskId) {
                        clearSelectSql += ' WHERE taskId="' + taskId + '"'
                    }
                    DB.selectSql(DB.taskNameDB, clearSelectSql, function(ret, err) {
                    	// alert('showTasksProgress:::' + JSON.stringify(ret)+ JSON.stringify(err));
                        if (ret.status) { //删除成功

                        } else { //删除失败
                            alert('删除失败');
                        }
                    })
                }
            });
        },
        delTasksProgress: function() {
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    DB.selectSql(DB.taskNameDB, 'DROP TABLE ' + DB.taskNameTable, function(ret, err) {
                        alert('delTasksProgress:::' + JSON.stringify(ret) + ';' + JSON.stringify(err))
                    });
                }
            });
        },
        isEmptyTasksProgress: function(callback) {
            DB.selectSql(DB.taskNameDB, 'SELECT * FROM ' + DB.taskNameTable, function(ret, err) {
                var isEmpty = false;
                if (ret.status && ret.data && ret.data.length) {
                    isEmpty = true;
                }
                if (callback) { callback(isEmpty) }
            });
        },
        getCourseIdAll: function(callback) {
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    DB.isEmptyTasksProgress(function(isEmpty) {
                        if (isEmpty) {
                            var selectSql = 'SELECT courseId FROM ' + DB.taskNameTable + ' GROUP BY courseId';
                            DB.selectSql(DB.taskNameDB, selectSql, function(ret, err) {
                                var courseIdAll = [];
                                if (ret.status) {
                                    for (var i = 0; i < ret.data.length; i++) {
                                        courseIdAll.push(ret.data[i].courseId);
                                    }
                                }
                                if (callback) { callback(courseIdAll) }
                            })
                        } else {
                            alert('数据库为空');
                        }
                    })
                }
            });
        },
        getTaskProgress: function(taskId, callback) {
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    DB.isEmptyTasksProgress(function(isEmpty) {
                        if (isEmpty) {
                            var selectSql = 'SELECT progress FROM ' + DB.taskNameTable + ' where taskId="' + taskId + '"';
                            DB.selectSql(DB.taskNameDB, selectSql, function(ret, err) {
                                if (ret.status) {
                                    if (callback) { callback(ret.data[0].progress) }
                                } else { //
                                    alert('获取失败');
                                }
                            })
                        } else {
                            alert('数据库为空');
                        }
                    })
                }
            });
        },
        getCourseTaskProgress: function(courseId, callback) {
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    DB.isEmptyTasksProgress(function(isEmpty) {
                        if (isEmpty) {
                            var selectSql = 'SELECT * FROM ' + DB.taskNameTable + ' where courseId="' + courseId + '"';
                            DB.selectSql(DB.taskNameDB, selectSql, function(ret, err) {
                                var courseTaskProgress = [];
                                if (ret.status) {
                                    courseTaskProgress = ret.data;
                                }
                                if (callback) { callback(courseTaskProgress) }
                            })
                        } else {
                            alert('数据库为空');
                        }
                    })
                }
            });
        },
        getTaskProgressNoSend: function(courseId, callback) {
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    var selectSql = '';
                    if (arguments.length == 2) {
                        selectSql = 'SELECT * FROM ' + DB.taskNameTable + ' where isSend="false" and courseId="' + courseId + '"';
                    } else {
                        selectSql = 'SELECT * FROM ' + DB.taskNameTable + ' where isSend="false"';
                    }

                    DB.selectSql(DB.taskNameDB, selectSql, function(ret, err) {
                        if (ret.status) {
                            if (callback) { callback(ret.data) }
                        } else { //
                            alert('获取失败');
                        }
                    })
                }
            });
        },
        getTasksProgressSupplyAll: function() {
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    DB.isEmptyTasksProgress(function(isEmpty) {
                        if (isEmpty) {
                            var selectSql = 'SELECT progress FROM ' + DB.taskNameTable + ' where isSupply="1"';
                            DB.selectSql(DB.taskNameDB, selectSql, function(ret, err) {
                                if (ret.status) {
                                    if (callback) { callback(ret.data) }
                                } else { //
                                    alert('获取失败');
                                }
                            })
                        } else {
                            alert('数据库为空');
                        }
                    })
                }
            });
        },
        saveTasksProgressSync: function() { // 同步保存
        },
        taskDB: function(callback) { // 创建 || 打开 数据库-任务
            DB.create(DB.taskNameDB, function(ret, err) {
                if (ret.status) {
                    DB.selectSql(DB.taskNameDB, 'SELECT * FROM ' + DB.taskNameTable, function(ret, err) {
                        if (ret.status && ret.data && ret.data.length) {} else {
                            DB.executeSql(DB.taskNameDB, 'CREATE TABLE ' + DB.taskNameTable + ' (nid integer primary key, token  varchar(255), memberId varchar(255), memberName varchar(255), categoryId varchar(255), categoryName varchar(255), subjectId varchar(255), subjectName varchar(255), courseId varchar(255), courseName varchar(255), chapterId varchar(255), chapterName varchar(255), taskId varchar(255), taskName varchar(255), progress varchar(255), total varchar(255), state varchar(255), isSend varchar(255), isSupply varchar(255), createDate varchar(255), downloadProgress varchar(255), downloadState varchar(255), downloadDate varchar(255), expiredDate varchar(255))');
                        }
                        if (callback) { callback(ret, err) };
                    });
                }
            });
        },
        insetTaskDB: function(data, callback) { // 添加 || 更新 数据库-任务

            DB.selectSql(DB.taskNameDB, 'SELECT * FROM ' + DB.taskNameTable + ' where taskId="' + data.taskId + '"', function(ret, err) {
                // alert('insetTaskDB:::'+JSON.stringify(ret)+JSON.stringify(err))
                if (ret.status && ret.data && ret.data.length) { //更新
                    DB.updateTaskDB(data, callback);
                    var online = DB.online();
                    if (online) {
                        DB.addTaskDB(data, callback, true);
                    }
                } else { //添加
                    DB.addTaskDB(data, callback);
                    var online = DB.online();
                    if (online) {
                        DB.addTaskDB(data, callback, true);
                    }
                }
            })
        },
        addTaskDB: function(data, callback, log) { // 添加一条记录 数据库-任务
            var createDate = Date.parse(new Date()); //当前时间戳
            data.token = getstor('token');
            data.memberId = getstor('memberId');
            data.memberName = getstor('nickName');
            if (log) {
                data.taskId = data.taskId + 'log';
                data.isSupply = 1;
            } else {
                data.isSupply = 0;
            }
            DB.executeSql(DB.taskNameDB, "INSERT INTO " + DB.taskNameTable + " (nid, token, memberId, memberName,  categoryId, categoryName, subjectId, subjectName, courseId, courseName, chapterId, chapterName, taskId, taskName, progress, total, state, isSend, isSupply, createDate, downloadProgress, downloadState, downloadDate, expiredDate) " +
                " VALUES (" +
                "NULL," +
                "'" + data.token + "'," +
                "'" + data.memberId + "'," +
                "'" + data.memberName + "'," +
                "'" + data.categoryId + "'," +
                "'" + data.categoryName + "'," +
                "'" + data.subjectId + "'," +
                "'" + data.subjectName + "'," +
                "'" + data.courseId + "'," +
                "'" + data.courseName + "'," +
                "'" + data.chapterId + "'," +
                "'" + data.chapterName + "'," +
                "'" + data.taskId + "'," +
                "'" + data.taskName + "'," +
                "'" + data.progress + "'," +
                "'" + data.total + "'," +
                "'" + data.state + "'," +
                "'" + data.isSend + "'," +
                "'" + data.isSupply + "'," +
                "'" + createDate + "'," +
                "'" + data.downloadProgress + "'," +
                "'" + data.downloadState + "'," +
                "'" + data.downloadDate + "'," +
                "'" + data.expiredDate + "'" +
                ");",
                function(ret, err) {
                    if (callback) { callback(ret, err) }
                });
        },
        updateTaskDB: function(data, callback) { // 更新一条记录 数据库-任务
            // 更新 progress state isSend createDate 
            DB.executeSql(DB.taskNameDB, 'UPDATE ' + DB.taskNameTable + ' SET progress="' + data.progress + '",state="' + data.state + '",isSend="' + data.isSend + '",createDate="' + data.createDate + '" WHERE taskId="' + data.taskId + '"', function(ret, err) {

                if (callback) { callback(ret, err) }
            });
        },
        selectTaskDB: function() { // 显示数据库-任务
            DB.selectSql(DB.taskNameDB, 'SELECT * FROM ' + DB.taskNameTable, function(ret, err) {
                alert('showTasksProgress:::' + JSON.stringify(ret) + ';' + JSON.stringify(err))
            });
        },

        create: function(dbname, callback) { // 打开数据库，若数据库不存在则创建数据库。
            DB.db = api.require('db');
            DB.db.openDatabase({
                name: dbname
            }, function(ret, err) {
                if (callback) { callback(ret, err) };
            });
        },
        close: function(dbname, callback) { // 关闭数据库
            DB.db.closeDatabase({
                name: dbname
            }, function(ret, err) {
                if (callback) { callback(ret, err) };
            })
        },
        executeSql: function(dbname, sql, callback) { // 执行sql
            DB.db.executeSql({
                name: dbname,
                sql: sql
            }, function(ret, err) {
                if (callback) { callback(ret, err) };
            })
        },
        selectSql: function(dbname, sql, callback) { // 查询sql
            DB.db.selectSql({
                name: dbname,
                sql: sql
            }, function(ret, err) {
                if (callback) { callback(ret, err) };
            })
        }
    };
    window.DB = {
        saveTasksProgress: DB.saveTasksProgress,
        showTasksProgress: DB.showTasksProgress,
        clearTasksProgress: DB.clearTasksProgress,
        delTasksProgress: DB.delTasksProgress,
        getCourseIdAll: DB.getCourseIdAll,
        getTaskProgress: DB.getTaskProgress,
        getCourseTaskProgress: DB.getCourseTaskProgress,
        getTaskProgressNoSend: DB.getTaskProgressNoSend,
        getTasksProgressSupplyAll: DB.getTasksProgressSupplyAll
    }
})(window);
