/*	保存任务进度到数据库
	*	需要保存的任务进度字段
	*	{
	*		//token : '', // token
	*		//memberId : '', // 用户id
	*		//memberName : '', // 用户昵称

	*		categoryId : '', // 证书id
	*		subjectId : '', // 科目id
	*		courseId : '', // 课程id
	*		courseName : '', // 课程名称
	*		charpgerId : '', // 章节id
	*		chapterName : '', // 章节名称
	*		taskId : '', // 任务id
	*		taskName ：'', // 任务名称
	*		progress : '', // 最后1次学习进度
	*		total: '', // 任务总长度
	*		state : '', // 是否播放结束
	*		isSend : '', // 是否已同步服务器 true false
	*		modifyDate : '', // 视频进度保存时间
	*		downloadProgress : '', // 下载进度
	*		downloadState : '', // 下载状态（ing，stop，end）
	*		downloadDate : '', // 下载日期
	*		expiredDate : '' // 过期日期
	*	}
	*	saveTasksProgress(data); 保存数据到任务进度数据库 参数data：保存的数据
	*	showTasksProgress(); 显示任务进度数据库的数据
	*	clearTasksProgress(taskId); 删除任务进度数据库的数据 参数taskId：任务id，无参数：删除所有
	*	delTasksProgress(); 删除任务进度数据库表
	*	getCourseIdAll(callback); 获取所有的courseId 
	*	getTaskProgress(taskId, callback);  获取任务进度 
	*	getTaskProgressNoSend(callback); 获取所有未同步的任务进度
*/
;(function(window){
	window.DB = {
		db : '',
		taskNameDB : 'taskDB',
		taskNameTable : 'Task'+getstor('memberId'),
		saveTasksProgress : function(data){ // 异步保存 数据库-任务
			if(data){
				DB.taskDB(function(ret, err){
					if(ret.status){
						DB.insetTaskDB(data);
					}
				});
				
			}
		},
		showTasksProgress : function(){
			DB.create(DB.taskNameDB,function(ret, err){
				if(ret.status){
					DB.selectSql(DB.taskNameDB,'SELECT * FROM '+DB.taskNameTable,function(ret, err){
						alert('showTasksProgress:::'+JSON.stringify(ret)+';'+JSON.stringify(err))
					});
				}
			});
		},
		clearTasksProgress : function(taskId){
			var clearTaskId = arguments.length ? true : false;
			DB.create(DB.taskNameDB,function(ret, err){
				if(ret.status){
					var clearSelectSql = 'DELETE FROM '+DB.taskNameTable;
					if(clearTaskId){
						clearSelectSql += ' WHERE taskId="'+taskId+'"'
					}
					DB.selectSql(DB.taskNameDB,clearSelectSql,function(ret, err){
						if(ret.status){//删除成功
							
						}else{//删除失败
							alert('删除失败');
						}
					})
				}
			});
			
		},
		delTasksProgress : function(){
			DB.create(DB.taskNameDB,function(ret, err){
				if(ret.status){
					DB.selectSql(DB.taskNameDB,'DROP TABLE '+DB.taskNameTable,function(ret, err){
						alert('delTasksProgress:::'+JSON.stringify(ret)+';'+JSON.stringify(err))
					});
				}
			});
		},
		getCourseIdAll : function(callback){
			DB.create(DB.taskNameDB,function(ret, err){
				if(ret.status){
					var clearSelectSql = 'SELECT courseId FROM '+DB.taskNameTable+' GROUP BY courseId';
					DB.selectSql(DB.taskNameDB,clearSelectSql,function(ret, err){
						if(ret.status){
							var courseIdAll = [];
							for(var i = 0; i<ret.data.length;i++){
								courseIdAll.push(ret.data[i].courseId);
							}
							if(callback){callback(courseIdAll)}
						}else{//
							alert('获取失败');
						}
					})
				}
			});
		},
		getTaskProgress : function(taskId, callback){
			DB.create(DB.taskNameDB,function(ret, err){
				if(ret.status){
					var clearSelectSql = 'SELECT progress FROM '+DB.taskNameTable+' where taskId="'+taskId+'"';
					DB.selectSql(DB.taskNameDB,clearSelectSql,function(ret, err){
						if(ret.status){
							if(callback){callback(ret.data[0].progress)}
						}else{//
							alert('获取失败');
						}
					})
				}
			});
		},
		getTaskProgressNoSend : function(callback){
			DB.create(DB.taskNameDB,function(ret, err){
				if(ret.status){
					var clearSelectSql = 'SELECT * FROM '+DB.taskNameTable+' where isSend="false"';
					DB.selectSql(DB.taskNameDB,clearSelectSql,function(ret, err){
						if(ret.status){
							// var courseIdAll = [];
							// for(var i = 0; i<ret.data.length;i++){
							// 	courseIdAll.push(ret.data[i].courseId);
							// }
							if(callback){callback(ret.data)}
						}else{//
							alert('获取失败');
						}
					})
				}
			});
		},

		saveTasksProgressSync : function(){ // 同步保存
		},
		
		taskDB : function(callback){// 创建 || 打开 数据库-任务
			DB.create(DB.taskNameDB,function(ret, err){
				if(ret.status){
					DB.selectSql(DB.taskNameDB,'SELECT * FROM '+DB.taskNameTable,function(ret, err){
						if(ret.status && ret.data && ret.data.length){
						}else{
							DB.executeSql(DB.taskNameDB,'CREATE TABLE '+DB.taskNameTable+' (nid integer primary key, categoryId varchar(255), subjectId varchar(255), courseId varchar(255), courseName varchar(255), charpgerId varchar(255), chapterName varchar(255), taskId varchar(255), taskName varchar(255), progress varchar(255), total varchar(255), state varchar(255), isSend varchar(255), modifyDate varchar(255), downloadProgress varchar(255), downloadState varchar(255), downloadDate varchar(255), expiredDate varchar(255))');
						}
						if(callback){callback(ret, err)};
					});
				}
			});
		},
		insetTaskDB : function(data){// 添加 || 更新 数据库-任务
			DB.selectSql(DB.taskNameDB,'SELECT * FROM '+DB.taskNameTable+' where taskId="'+data.taskId+'"',function(ret, err){
				// alert('insetTaskDB:::'+JSON.stringify(ret)+JSON.stringify(err))
				if(ret.status && ret.data && ret.data.length){//更新
					DB.updateTaskDB(data);
				}else{//添加
					DB.addTaskDB(data);
				}
			})
		},
		addTaskDB : function(data){// 添加一条记录 数据库-任务
		    var currenttime=Date.parse(new Date()); //当前时间戳
		    DB.executeSql(DB.taskNameDB,"INSERT INTO "+DB.taskNameTable+" (nid, categoryId, subjectId, courseId, courseName, charpgerId, chapterName, taskId, taskName, progress, total, state, isSend, modifyDate, downloadProgress, downloadState, downloadDate, expiredDate) " +
	            " VALUES (" +
	            "NULL," +
	            "'"+data.categoryId+"'," +
	            "'"+data.subjectId+"'," +
	            "'"+data.courseId+"'," +
	            "'"+data.courseName+"'," +
	            "'"+data.charpgerId+"'," +
	            "'"+data.chapterName+"'," +
	            "'"+data.taskId+"'," +
	            "'"+data.taskName+"'," +
	            "'"+data.progress+"'," +
	            "'"+data.total+"'," +
	            "'"+data.state+"'," +
	            "'"+data.isSend+"'," +
	            "'"+data.modifyDate+"'," +
	            "'"+data.downloadProgress+"'," +
	            "'"+data.downloadState+"'," +
	            "'"+data.downloadDate+"'," +
	            "'"+data.expiredDate+"'" +
	            ");"
		    ,function(ret,err){
		    	// alert('addTaskDB:::'+JSON.stringify(ret)+';'+JSON.stringify(err))
		    });
		},
		updateTaskDB : function(data){// 更新一条记录 数据库-任务
			// 更新 progress state isSend modifyDate 
			DB.executeSql(DB.taskNameDB,'UPDATE '+DB.taskNameTable+' SET progress="'+data.progress+'",state="'+data.state+'",isSend="'+data.isSend+'",modifyDate="'+data.modifyDate+'" WHERE taskId="'+data.taskId+'"');
		},
		selectTaskDB : function(){ // 显示数据库-任务
			DB.selectSql(DB.taskNameDB,'SELECT * FROM '+DB.taskNameTable,function(ret, err){
				alert('showTasksProgress:::'+JSON.stringify(ret)+';'+JSON.stringify(err))
			});
		},

		create : function(dbname, callback){// 打开数据库，若数据库不存在则创建数据库。
			DB.db = api.require('db');
			DB.db.openDatabase({
			    name: dbname
			}, function(ret, err) {
				if(callback){callback(ret,err)};
			});
		},
		close : function(dbname, callback){// 关闭数据库
			DB.db.closeDatabase({
				name : dbname
			}, function(ret, err){
				if(callback){callback(ret,err)};
			})
		},
		executeSql : function(dbname, sql, callback){// 执行sql
			DB.db.executeSql({
				name : dbname,
				sql : sql
			},function(ret, err){
				if(callback){callback(ret,err)};
			})
		},
		selectSql : function(dbname, sql, callback){// 查询sql
			DB.db.selectSql({
				name : dbname,
				sql : sql
			},function(ret, err){
				if(callback){callback(ret,err)};
			})
		}
	};
})(window);
