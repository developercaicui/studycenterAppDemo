/*course-studying-f页面js*/
document.documentElement.style.fontSize = (document.documentElement.clientWidth / 640) * 100 + 'px';
//定义变量
var currentPage = 1;
var pageSize = 1000;
var total = 0;


//  var data={
//  "data": {
//  "total": 30,
//  "courselist": [
//  {
//  "categoryIndex": 20,
//  "effectiveDay": 270,
//  "taskTotal": "51",
//  "isU": "false",
//  "lastTaskId": "ff8080814eaf7474014ebefe857125b8",
//  "courseId": "ff8080814eaf7474014eb450fc180846",
//  "lastTaskdate": 1470623538000,
//  "outline": "",
//  "teacherName": "财务英语明星讲师团",
//  "orderID_item_id": "8a22ecb5535aa60801538413c00a640f",
//  "lastmodifyTime": 1469856982,
//  "categoryName": "CFA",
//  "subjectName": "CFA 财务英语基础课",
//  "courseIndex": 2,
//  "subjectID": "ff8080814f3eb9ed014f48ef69fe136c",
//  "progressSum": 131,
//  "teacherHonor": "",
//  "availability": "",
//  "lastTaskName": "merger",
//  "courseBkImage": "/upload/201508/631e2507c86c40779b99368df10f8a5b.jpg",
//  "categoryId": "ff80808149cc09f70149f3e7b9534654",
//  "chapterName": "Merge",
//  "taskprogress": 0,
//  "chapterId": "ff8080814eaf7474014eb510f9d90d29",
//  "expirationTime": 1486120148,
//  "buyTime": 1458209800,
//  "teacherImage": "/upload/201507/3bfaf8b86cb14985a194c01d9e9fbbb1.png",
//  "versionId": "ff8080814eaf7474014eb450fc180846",
//  "lastState": "init",
//  "subjectIndex": 0,
//  "lastProgress": 3,
//  "courseName": "CFA 财务英语基础课"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "116",
//  "isU": "true",
//  "lastTaskId": "8a22ecb55553160d0155532f49800018",
//  "courseId": "8a22ecb5554cfedf0155525de555005e",
//  "lastTaskdate": 1470637529000,
//  "outline": "",
//  "teacherName": "Vivian Doo",
//  "orderID_item_id": "8a22ecb55215dca501521b49922206d2",
//  "lastmodifyTime": 1470626179,
//  "categoryName": "ACCA",
//  "subjectName": "F6",
//  "courseIndex": 1,
//  "subjectID": "ff80808147c904170147d2d3d4b60098",
//  "progressSum": 1403,
//  "teacherHonor": "都薇",
//  "availability": "",
//  "lastTaskName": "Tax year",
//  "courseBkImage": "/upload/201606/5fb9da430fa347bbaf012a182682fa8f.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "chapterName": "Chapter 2 Introduction to Income Tax",
//  "taskprogress": 1,
//  "chapterId": "8a22ecb5554cfedf0155526a016c0063",
//  "expirationTime": 1485570890,
//  "buyTime": 1466489747,
//  "teacherImage": "/upload/201606/2f4caeffc3324a79b0777af36a9e5900.png",
//  "versionId": "ff80808147c904170147d2d530c30099",
//  "lastState": "init",
//  "subjectIndex": 7,
//  "lastProgress": 17,
//  "courseName": "2016 ACCA F6 Taxation"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "11",
//  "isU": "true",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "courseBkImage": "/upload/201606/fb24c01db0d54cbb94521f76b371cd95.jpg",
//  "courseId": "8a22ecb5556c579501556ccb8472000e",
//  "outline": "",
//  "teacherName": "Vivian Doo",
//  "lastmodifyTime": 1469784922,
//  "orderID_item_id": "8a22ecb55215dca501521b49922206d2",
//  "categoryName": "ACCA",
//  "subjectName": "F6",
//  "courseIndex": 1,
//  "expirationTime": 1485570890,
//  "subjectID": "ff80808147c904170147d2d3d4b60098",
//  "buyTime": 1466489747,
//  "teacherImage": "/upload/201606/2f4caeffc3324a79b0777af36a9e5900.png",
//  "versionId": "ff808081486933e601488982777a058a",
//  "teacherHonor": "都薇",
//  "subjectIndex": 7,
//  "availability": "",
//  "courseName": "2016 复习串讲-ACCA F6 Taxation"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "11",
//  "isU": "true",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "courseBkImage": "/upload/201502/9363df26e34344ca9da5071b40def668.jpg",
//  "courseId": "ff8080814dc1dc4e014dff86ba232934",
//  "outline": "",
//  "teacherName": "Sunny Sun",
//  "lastmodifyTime": 1467340826,
//  "orderID_item_id": "8a22ecb55215dca501521b49922206d2",
//  "categoryName": "ACCA",
//  "subjectName": "P1",
//  "courseIndex": 20,
//  "expirationTime": 1485322053,
//  "subjectID": "ff808081473905e70147625487550079",
//  "buyTime": 1452156753,
//  "teacherImage": "/upload/201606/de99bbb67d7d44c681da62f6fb5f03bc.png",
//  "versionId": "ff808081486933e601488989ad470592",
//  "teacherHonor": "八年教龄，金牌讲师，ACCA资深会员",
//  "subjectIndex": 11,
//  "availability": "",
//  "courseName": "复习串讲-ACCA P1 Governance Risk, and Ethic"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "24",
//  "isU": "true",
//  "lastTaskId": "ff8080814dc1dc4e014dff8681e22911",
//  "courseId": "ff8080814dc1dc4e014dff86819c28fe",
//  "lastTaskdate": 1469774602000,
//  "outline": "",
//  "teacherName": "Sunny Sun",
//  "orderID_item_id": "8a22ecb55215dca501521b49922206d2",
//  "lastmodifyTime": 1470209374,
//  "categoryName": "ACCA",
//  "subjectName": "P1",
//  "courseIndex": 19,
//  "subjectID": "ff808081473905e70147625487550079",
//  "progressSum": 181,
//  "teacherHonor": "八年教龄，金牌讲师，ACCA资深会员",
//  "availability": "",
//  "lastTaskName": "Chapter 6 Directors' remuneration",
//  "courseBkImage": "/upload/201502/3d1eb2443ceb42fb85700a9628cb5cf1.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "chapterName": "Chapter 6 Directors' remuneration",
//  "taskprogress": 0,
//  "chapterId": "ff8080814dc1dc4e014dff8681dd2910",
//  "expirationTime": 1485322053,
//  "buyTime": 1452156752,
//  "teacherImage": "/upload/201606/de99bbb67d7d44c681da62f6fb5f03bc.png",
//  "versionId": "ff808081473905e701476bd8a0300092",
//  "lastState": "init",
//  "subjectIndex": 11,
//  "lastProgress": 0,
//  "courseName": "ACCA P1 Governance Risk, and Ethic"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "98",
//  "isU": "false",
//  "lastTaskId": "ff8080814dad5062014db32051db01a8",
//  "courseId": "ff8080814dad5062014db32051b801a2",
//  "lastTaskdate": 1470654321000,
//  "outline": "",
//  "teacherName": "David Xi",
//  "orderID_item_id": "8a22ecb55541a7960155427ab8ae0097",
//  "lastmodifyTime": 1470259790,
//  "categoryName": "ACCA",
//  "subjectName": "F1",
//  "courseIndex": 1,
//  "subjectID": "ff808081473905e701476204cb6c006f",
//  "progressSum": 19597,
//  "teacherHonor": "ACCA金牌讲师",
//  "availability": "",
//  "lastTaskName": "Chapter 1 Organisation and Types of Organisation",
//  "courseBkImage": "/upload/201502/6096a5abb99846e3b9597f5bbb1a7b61.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "chapterName": "Chapter 1 Organisation and Types of Organisation",
//  "taskprogress": 13,
//  "chapterId": "ff8080814dad5062014db32051d501a7",
//  "expirationTime": 1484577352,
//  "buyTime": 1465699186,
//  "teacherImage": "/upload/201606/bda225ae7bde46fb848c09d65fdafb3a.png",
//  "versionId": "ff808081473905e701476205d8740070",
//  "lastState": "init",
//  "subjectIndex": 2,
//  "lastProgress": 0,
//  "courseName": "ACCA F1 Accountant in Business"
//  },
//  {
//  "categoryIndex": 23,
//  "effectiveDay": 270,
//  "taskTotal": "206",
//  "isU": "false",
//  "lastTaskId": "8a22ecb553c543220153ca6675d70020",
//  "courseId": "8a22ecb5537864ee0153791d2014000c",
//  "lastTaskdate": 1470638358000,
//  "outline": "",
//  "teacherName": "Cate Cheng",
//  "orderID_item_id": "8a22ecb555910eae0155c4e906650594",
//  "lastmodifyTime": 1469971236,
//  "categoryName": "FRM",
//  "subjectName": "FRM Part 1",
//  "courseIndex": 2,
//  "subjectID": "8a22ecb5537864ee01537901cba30002",
//  "progressSum": 806,
//  "teacherHonor": "程黄维",
//  "availability": "",
//  "lastTaskName": "Topic 1 Risk Management: A Helicopter View-1",
//  "courseBkImage": "/upload/201607/7d4c8f6e89a64d83a79195ef414045cf.jpg",
//  "categoryId": "8a22ecb5537864ee015378fa05a10001",
//  "chapterName": "Topic 1 Risk Management: A Helicopter View",
//  "taskprogress": 1,
//  "chapterId": "8a22ecb5537864ee01537959c1970017",
//  "expirationTime": 1483950146,
//  "buyTime": 1467887453,
//  "teacherImage": "/upload/201606/f24fdec43210472b834af8c29174890b.png",
//  "versionId": "8a22ecb5537864ee0153791d2014000c",
//  "lastState": "init",
//  "subjectIndex": 10,
//  "lastProgress": 0,
//  "courseName": "FRM Part 1 基础课"
//  },
//  {
//  "categoryIndex": 100,
//  "effectiveDay": 180,
//  "taskTotal": "30",
//  "isU": "false",
//  "lastTaskId": "8a22ecb551ed44ca0151ed87b85300c3",
//  "courseId": "8a22ecb551ce0ae20151ce8875080120",
//  "lastTaskdate": 1467889576000,
//  "outline": "",
//  "teacherName": "Sunny Sun",
//  "orderID_item_id": "8a22ecb555910eae0155c4a9bd7d058f",
//  "lastmodifyTime": 1466139958,
//  "categoryName": "OBU",
//  "subjectName": "OBU 论文基础课",
//  "courseIndex": 1,
//  "subjectID": "8a22ecb551f17b3e0151f1e04c7d0118",
//  "progressSum": 17,
//  "teacherHonor": "八年教龄，金牌讲师，ACCA资深会员",
//  "availability": "",
//  "lastTaskName": "LESSON 4\t  论文申请步骤、时效及免试影响",
//  "courseBkImage": "/upload/201512/e7b0600a049848f59ec2f2d48e1dabc5.jpg",
//  "categoryId": "8a22ecb551cf56cb0151d2152b5c0252",
//  "chapterName": "第二部分 Eligibility of applying OBU BSc in Applied Accounting（论文申请资格及要求）",
//  "taskprogress": 0,
//  "chapterId": "8a22ecb551ce0ae20151ce89508d0123",
//  "expirationTime": 1483435438,
//  "buyTime": 1467883306,
//  "teacherImage": "/upload/201606/de99bbb67d7d44c681da62f6fb5f03bc.png",
//  "versionId": "8a22ecb551ce0ae20151ce8875080120",
//  "lastState": "init",
//  "subjectIndex": 50,
//  "lastProgress": 0,
//  "courseName": "OBU 论文基础课"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "26",
//  "isU": "false",
//  "lastTaskId": "ff8080814dc1dc4e014dd64295fe0f18",
//  "courseId": "ff8080814dc1dc4e014dd64295dc0f11",
//  "lastTaskdate": 1469604399000,
//  "outline": "",
//  "teacherName": "Amy Liu",
//  "orderID_item_id": "8a22ecb55262924f0152630c26bb0201",
//  "lastmodifyTime": 1468168703,
//  "categoryName": "ACCA",
//  "subjectName": "F2",
//  "courseIndex": 4,
//  "subjectID": "ff808081473905e7014762524e800072",
//  "progressSum": 1632,
//  "teacherHonor": "十年教龄，ACCA金牌讲师",
//  "availability": "",
//  "lastTaskName": "知识串讲-PART A-03",
//  "courseBkImage": "/upload/201502/311cb0a97d9c4c70b98a264e32fba310.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "chapterName": "知识串讲-PART A-Accounting for material",
//  "taskprogress": 0,
//  "chapterId": "ff8080814dc1dc4e014dd64295f80f17",
//  "expirationTime": 1481360002,
//  "buyTime": 1453360687,
//  "teacherImage": "/upload/201606/a9b2f46ff15546bda8b26279cab91707.png",
//  "versionId": "ff808081486933e6014889793b7a0582",
//  "lastState": "init",
//  "subjectIndex": 3,
//  "lastProgress": 15,
//  "courseName": "复习串讲-ACCA F2 Management Accounting"
//  },
//  {
//  "categoryIndex": 25,
//  "effectiveDay": 180,
//  "taskTotal": "59",
//  "isU": "false",
//  "lastTaskId": "ff8080814dc1dc4e014dff5f55032710",
//  "courseId": "ff8080814dc1dc4e014dff5f54ec270d",
//  "lastTaskdate": 1467886656000,
//  "outline": "",
//  "teacherName": "Elena Shi",
//  "orderID_item_id": "8a22ecb554559b010154bcd7cbe11426",
//  "lastmodifyTime": 1470154255,
//  "categoryName": "CIMA",
//  "subjectName": "C01",
//  "courseIndex": 1,
//  "subjectID": "ff8080814cc0f542014cc524440c0019",
//  "progressSum": 2583,
//  "teacherHonor": "时晓燕",
//  "availability": "",
//  "lastTaskName": "introduction",
//  "courseBkImage": "/upload/201504/c8324d46f6054fecb4f01dd5d42355f3.jpg",
//  "categoryId": "ff8080814c7e36d9014c9c3219fa01a8",
//  "chapterName": "introduction",
//  "taskprogress": 0,
//  "chapterId": "ff8080814dc1dc4e014dff5f54fd270f",
//  "expirationTime": 1481359816,
//  "buyTime": 1463457139,
//  "teacherImage": "/upload/201606/7a5e783df2cf44b581cb7477cf357332.png",
//  "versionId": "ff8080814cc0f542014cc514476d0014",
//  "lastState": "init",
//  "subjectIndex": 10,
//  "lastProgress": 0,
//  "courseName": "CIMA Fundamentals of Management Accounting（C01）"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "12",
//  "isU": "true",
//  "lastTaskId": "ff8080814e062b43014e2859ab590cd2",
//  "courseId": "ff8080814e062b43014e284664330cb8",
//  "lastTaskdate": 1468402624000,
//  "outline": null,
//  "teacherName": "Reache Xie",
//  "orderID_item_id": "8a22ecb55215dca501521b49922206d2",
//  "lastmodifyTime": 1469647468,
//  "categoryName": "ACCA",
//  "subjectName": "P7",
//  "courseIndex": 30,
//  "subjectID": "ff8080814dc1dc4e014de1236c921356",
//  "progressSum": 1874,
//  "teacherHonor": "谢云",
//  "availability": "",
//  "lastTaskName": "risk question- Q1 oak Co -1-1",
//  "courseBkImage": "/upload/201506/6975cf586ae14772a5f3c164ae750927.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "chapterName": "risk question- Q3(a) + Q1 -1",
//  "taskprogress": 1,
//  "chapterId": "ff8080814e062b43014e2851e0260cbe",
//  "expirationTime": 1481278375,
//  "buyTime": 1465374431,
//  "teacherImage": "/upload/201507/61536c832e5046e7a0678a1f0a9693cf.jpg",
//  "versionId": "ff8080814e062b43014e284664330cb8",
//  "lastState": "init",
//  "subjectIndex": 16,
//  "lastProgress": 434,
//  "courseName": "复习串讲-ACCA P7 Advanced Audit and Assurance "
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "14",
//  "isU": "false",
//  "courseId": "ff8080814f607c24014f68797ae11714",
//  "outline": "",
//  "teacherName": "Amy Liu",
//  "orderID_item_id": "8a22ecb55258ae260152630d14ce16cd",
//  "lastmodifyTime": 1469568866,
//  "categoryName": "ACCA",
//  "subjectName": "F2",
//  "courseIndex": 999,
//  "subjectID": "ff808081473905e7014762524e800072",
//  "progressSum": 365,
//  "teacherHonor": "十年教龄，ACCA金牌讲师",
//  "availability": "",
//  "courseBkImage": "/upload/201603/c51f095a42f84313a19f3197a9f4b497.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "taskprogress": 0,
//  "expirationTime": 1481081286,
//  "buyTime": 1453360747,
//  "teacherImage": "/upload/201606/a9b2f46ff15546bda8b26279cab91707.png",
//  "versionId": "ff8080814f607c24014f68797ae11714",
//  "subjectIndex": 3,
//  "courseName": "ACCA F2 Management Accounting（体验课）"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "70",
//  "isU": "false",
//  "courseId": "ff8080814dad5062014dadd9c70d0053",
//  "outline": "",
//  "teacherName": "Amy Liu",
//  "orderID_item_id": "8a22ecb55262924f0152630b35af01f8",
//  "lastmodifyTime": 1469786157,
//  "categoryName": "ACCA",
//  "subjectName": "F2",
//  "courseIndex": 3,
//  "subjectID": "ff808081473905e7014762524e800072",
//  "progressSum": 3952,
//  "teacherHonor": "十年教龄，ACCA金牌讲师",
//  "availability": "",
//  "courseBkImage": "/upload/201502/a31000c03237447eb2bf91a3a3c5a18f.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "taskprogress": 3,
//  "expirationTime": 1480926372,
//  "buyTime": 1465374373,
//  "teacherImage": "/upload/201606/a9b2f46ff15546bda8b26279cab91707.png",
//  "versionId": "ff808081473905e70147626ef839007f",
//  "subjectIndex": 3,
//  "courseName": "ACCA F2 Management Accounting"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "21",
//  "isU": "false",
//  "lastTaskId": "ff8080814dc1dc4e014dff87b3ab2a5d",
//  "courseId": "ff8080814dc1dc4e014dff87b39c2a5a",
//  "lastTaskdate": 1470405450000,
//  "outline": "",
//  "teacherName": "Ralph Gui",
//  "orderID_item_id": "8a22ecb55238faab0152391afc5b004b",
//  "lastmodifyTime": 1470119998,
//  "categoryName": "ACCA",
//  "subjectName": "P3",
//  "courseIndex": 24,
//  "subjectID": "ff808081473905e701476254e30b007b",
//  "progressSum": 1498,
//  "teacherHonor": "六年教龄，ACCA金牌讲师",
//  "availability": "",
//  "lastTaskName": "知识串讲-1",
//  "courseBkImage": "/upload/201502/c1642418560240f2a931d307730f5a1d.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "chapterName": "知识串讲-1",
//  "taskprogress": 0,
//  "chapterId": "ff8080814dc1dc4e014dff87b3a52a5c",
//  "expirationTime": 1480415832,
//  "buyTime": 1452657015,
//  "teacherImage": "/upload/201506/ddc184e8ec6041d4a58efb0068b72a96.jpg",
//  "versionId": "ff808081486933e60148898c925b0596",
//  "lastState": "init",
//  "subjectIndex": 13,
//  "lastProgress": 1443,
//  "courseName": "复习串讲-ACCA P3 Business Analysis"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "98",
//  "isU": "false",
//  "lastTaskId": "ff8080814dad5062014db32051db01a8",
//  "courseId": "ff8080814dad5062014db32051b801a2",
//  "lastTaskdate": 1470654321000,
//  "outline": "",
//  "teacherName": "David Xi",
//  "orderID_item_id": "8a22ecb55340eb66015340edd5fc0008",
//  "lastmodifyTime": 1470259790,
//  "categoryName": "ACCA",
//  "subjectName": "F1",
//  "courseIndex": 1,
//  "subjectID": "ff808081473905e701476204cb6c006f",
//  "progressSum": 19597,
//  "teacherHonor": "ACCA金牌讲师",
//  "availability": "",
//  "lastTaskName": "Chapter 1 Organisation and Types of Organisation",
//  "courseBkImage": "/upload/201502/6096a5abb99846e3b9597f5bbb1a7b61.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "chapterName": "Chapter 1 Organisation and Types of Organisation",
//  "taskprogress": 13,
//  "chapterId": "ff8080814dad5062014db32051d501a7",
//  "expirationTime": 1480414169,
//  "buyTime": 1464862170,
//  "teacherImage": "/upload/201606/bda225ae7bde46fb848c09d65fdafb3a.png",
//  "versionId": "ff808081473905e701476205d8740070",
//  "lastState": "init",
//  "subjectIndex": 2,
//  "lastProgress": 0,
//  "courseName": "ACCA F1 Accountant in Business"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "61",
//  "isU": "false",
//  "lastTaskId": "ff8080814db86d41014dc1a2202004d3",
//  "courseId": "ff8080814db86d41014dc1a2200f04d0",
//  "lastTaskdate": 1468920139000,
//  "outline": "",
//  "teacherName": "Cindy Deng",
//  "orderID_item_id": "8a22ecb553ca89e40153cf871ac20d83",
//  "lastmodifyTime": 1467340232,
//  "categoryName": "ACCA",
//  "subjectName": "F3",
//  "courseIndex": 5,
//  "subjectID": "ff808081473905e701476252b4390073",
//  "progressSum": 4148,
//  "teacherHonor": "ACCA资深会员,金牌讲师",
//  "availability": "",
//  "lastTaskName": "F3-课程介绍",
//  "courseBkImage": "/upload/201502/fb9f1cfc2911499da1666e8aa5383d47.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "chapterName": "F3-课程介绍",
//  "taskprogress": 5,
//  "chapterId": "ff8080814db86d41014dc1a2201a04d2",
//  "expirationTime": 1480414044,
//  "buyTime": 1459475651,
//  "teacherImage": "/upload/201606/448ebf46b76e43158d1431d94c90836a.png",
//  "versionId": "ff808081473905e7014762700dfa0081",
//  "lastState": "init",
//  "subjectIndex": 4,
//  "lastProgress": 0,
//  "courseName": "ACCA F3 Financial Accounting"
//  },
//  {
//  "categoryIndex": 5,
//  "effectiveDay": 180,
//  "taskTotal": "70",
//  "isU": "false",
//  "courseId": "ff8080814dad5062014dadd9c70d0053",
//  "outline": "",
//  "teacherName": "Amy Liu",
//  "orderID_item_id": "8a22ecb553ca891a0153ca8d1dc4000c",
//  "lastmodifyTime": 1469786157,
//  "categoryName": "ACCA",
//  "subjectName": "F2",
//  "courseIndex": 3,
//  "subjectID": "ff808081473905e7014762524e800072",
//  "progressSum": 3952,
//  "teacherHonor": "十年教龄，ACCA金牌讲师",
//  "availability": "",
//  "courseBkImage": "/upload/201502/a31000c03237447eb2bf91a3a3c5a18f.jpg",
//  "categoryId": "ff808081473905e701475cd3c2080001",
//  "taskprogress": 3,
//  "expirationTime": 1480413106,
//  "buyTime": 1459392159,
//  "teacherImage": "/upload/201606/a9b2f46ff15546bda8b26279cab91707.png",
//  "versionId": "ff808081473905e70147626ef839007f",
//  "subjectIndex": 3,
//  "courseName": "ACCA F2 Management Accounting"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "125",
//  "isU": "false",
//  "lastTaskId": "ff8080814dc1dc4e014dd5d296380b0a",
//  "courseId": "ff8080814dc1dc4e014dd5d293880a93",
//  "lastTaskdate": 1469691107000,
//  "outline": "",
//  "teacherName": "QiQi Wu",
//  "orderID_item_id": "8a22ecb554559b010154e0d6d8381ace",
//  "lastmodifyTime": 1470211088,
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-1",
//  "courseIndex": 110,
//  "subjectID": "ff808081486933e601489c799f0f0868",
//  "progressSum": 7535,
//  "teacherHonor": "吴奇奇",
//  "availability": "",
//  "lastTaskName": "内部审计",
//  "courseBkImage": "/upload/201502/43de7614c9c141f38f5d0827840d343a.jpg",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "chapterName": "第二节 内部审计",
//  "taskprogress": 0,
//  "chapterId": "ff8080814dc1dc4e014dd5d296310b09",
//  "expirationTime": 1488714411,
//  "buyTime": 1464061057,
//  "teacherImage": "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//  "versionId": "ff808081486933e601489c867448086a",
//  "lastState": "init",
//  "subjectIndex": 50,
//  "lastProgress": 1087,
//  "courseName": "2015 CMA Part1 财务规划 绩效与控制 基础"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "6",
//  "isU": "false",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "courseBkImage": "/upload/201603/98603e808b054705bfa56b6185da03ef.jpg",
//  "courseId": "ff8080814f607c24014f695b07881b7c",
//  "outline": "",
//  "teacherName": "Cate Cheng",
//  "lastmodifyTime": 1464200151,
//  "orderID_item_id": "8a22ecb554559b010154e0d6e2681ad6",
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-2",
//  "courseIndex": 999,
//  "expirationTime": 1488528162,
//  "subjectID": "ff808081486933e601489c7a1aa20869",
//  "buyTime": 1464061059,
//  "teacherImage": "/upload/201606/f24fdec43210472b834af8c29174890b.png",
//  "versionId": "ff8080814f607c24014f695b07881b7c",
//  "teacherHonor": "程黄维",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "CMA Part2 财务决策（体验课）"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "21",
//  "isU": "false",
//  "lastTaskId": "8a22ecb553eab12801540452360300b6",
//  "courseId": "8a22ecb553eab1280153f36f380a007f",
//  "lastTaskdate": 1468494252000,
//  "outline": "",
//  "teacherName": "QiQi Wu",
//  "orderID_item_id": "8a22ecb554559b010154e0d6d3501aca",
//  "lastmodifyTime": 1469751076,
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-1",
//  "courseIndex": 130,
//  "subjectID": "ff808081486933e601489c799f0f0868",
//  "progressSum": 111,
//  "teacherHonor": "吴奇奇",
//  "availability": "",
//  "lastTaskName": "前导课",
//  "courseBkImage": "/upload/201604/92da0abdac4a45f5b46f9546ade771ac.jpg",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "chapterName": "前导",
//  "taskprogress": 0,
//  "chapterId": "8a22ecb553eab1280153f38a4e240087",
//  "expirationTime": 1495429814,
//  "buyTime": 1464061055,
//  "teacherImage": "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//  "versionId": "8a22ecb553eab1280153f36f380a007f",
//  "lastState": "init",
//  "subjectIndex": 50,
//  "lastProgress": 111,
//  "courseName": "2016 CMA Part I 中文 前导"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "7",
//  "isU": "false",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "courseBkImage": "/upload/201603/5380627063094993bc47b794a3c92077.jpg",
//  "courseId": "ff8080814f607c24014f695026021b33",
//  "outline": "",
//  "teacherName": "QiQi Wu",
//  "lastmodifyTime": 1465857137,
//  "orderID_item_id": "8a22ecb554e6d5310154f09c351e00ec",
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-1",
//  "courseIndex": 999,
//  "expirationTime": 1488517780,
//  "subjectID": "ff808081486933e601489c799f0f0868",
//  "buyTime": 1464325649,
//  "teacherImage": "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//  "versionId": "ff8080814f607c24014f695026021b33",
//  "teacherHonor": "吴奇奇",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "CMA Part1 财务规划 绩效与控制（体验课）"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "10",
//  "isU": "false",
//  "lastTaskId": "ff8080814dc1dc4e014dd5d195230a82",
//  "courseId": "ff8080814dc1dc4e014dd5d195120a7f",
//  "lastTaskdate": 1468828670000,
//  "outline": "",
//  "teacherName": "QiQi Wu",
//  "orderID_item_id": "8a22ecb554559b010154e0d6d5d31acc",
//  "lastmodifyTime": 1470228231,
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-1",
//  "courseIndex": 100,
//  "subjectID": "ff808081486933e601489c799f0f0868",
//  "progressSum": 1034,
//  "teacherHonor": "吴奇奇",
//  "availability": "",
//  "lastTaskName": "前导课-01",
//  "courseBkImage": "/upload/201502/b9703daddd6d42d0ac56f66fe7a5cdde.jpg",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "chapterName": "前导课",
//  "taskprogress": 0,
//  "chapterId": "ff8080814dc1dc4e014dd5d1951c0a81",
//  "expirationTime": 1488282994,
//  "buyTime": 1464061056,
//  "teacherImage": "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//  "versionId": "ff808081491181a3014917d1bec90762",
//  "lastState": "init",
//  "subjectIndex": 50,
//  "lastProgress": 1034,
//  "courseName": "2015 CMA Part1 财务规划 绩效与控制 前导"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "64",
//  "isU": "false",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "courseBkImage": "/upload/201502/6bde3d7f0ba74fe39255cbaeeb6d2697.jpg",
//  "courseId": "ff8080814dc1dc4e014dd5d3b9dd0b97",
//  "outline": "",
//  "teacherName": "Cate Cheng",
//  "lastmodifyTime": 1470245819,
//  "orderID_item_id": "8a22ecb554559b010154e0d6dd7a1ad2",
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-2",
//  "courseIndex": 5,
//  "expirationTime": 1488281873,
//  "subjectID": "ff808081486933e601489c7a1aa20869",
//  "buyTime": 1464061058,
//  "teacherImage": "/upload/201606/f24fdec43210472b834af8c29174890b.png",
//  "versionId": "ff8080814930fc1001493179306800f0",
//  "teacherHonor": "程黄维",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "2015 CMA Part II  财务决策"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "5",
//  "isU": "false",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "courseBkImage": "/upload/201502/2ea1a9b84d74491da4c9eac86761faf0.jpg",
//  "courseId": "ff8080814dc1dc4e014dd5d36b480b8d",
//  "outline": "",
//  "teacherName": "Cate Cheng",
//  "lastmodifyTime": 1469835123,
//  "orderID_item_id": "8a22ecb554559b010154e0d6daa61ad0",
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-2",
//  "courseIndex": 200,
//  "expirationTime": 1488281824,
//  "subjectID": "ff808081486933e601489c7a1aa20869",
//  "buyTime": 1464061057,
//  "teacherImage": "/upload/201606/f24fdec43210472b834af8c29174890b.png",
//  "versionId": "ff808081499d17aa01499dda5dba057b",
//  "teacherHonor": "程黄维",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "2015 CMA Part II  财务决策 前导"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "20",
//  "isU": "false",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "courseBkImage": "/upload/201504/5d7fcafc7c424f9bad16807b5ee40974.jpg",
//  "courseId": "ff8080814dc1dc4e014dd5da10850bfa",
//  "outline": "",
//  "teacherName": "Cate Cheng",
//  "lastmodifyTime": 1470308085,
//  "orderID_item_id": "8a22ecb554559b010154e0d6dff11ad4",
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-2",
//  "courseIndex": 6,
//  "expirationTime": 1488280641,
//  "subjectID": "ff808081486933e601489c7a1aa20869",
//  "buyTime": 1464061059,
//  "teacherImage": "/upload/201606/f24fdec43210472b834af8c29174890b.png",
//  "versionId": "ff8080814c7e36d9014c9d3a034501dc",
//  "teacherHonor": "程黄维",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "2015 CMA Part II  财务决策 串讲"
//  },
//  {
//  "categoryIndex": 20,
//  "effectiveDay": 270,
//  "taskTotal": "20",
//  "isU": "false",
//  "categoryId": "ff80808149cc09f70149f3e7b9534654",
//  "courseBkImage": "/upload/201512/61f232978f904786badd23bfebcc34ac.jpg",
//  "courseId": "8a2a5fa451c0c3ad0151c2950ccf0080",
//  "outline": "",
//  "teacherName": "CFA明星讲师团",
//  "lastmodifyTime": 1465875780,
//  "orderID_item_id": "8a22ecb5535aa60801538413c05a6417",
//  "categoryName": "CFA",
//  "subjectName": "L1基础课",
//  "courseIndex": 1,
//  "expirationTime": 1486784737,
//  "subjectID": "ff80808149cc09f70149f3e860fa4655",
//  "buyTime": 1458209800,
//  "teacherImage": "/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png",
//  "versionId": "8a2a5fa451c0c3ad0151c2950ccf0080",
//  "teacherHonor": "",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "CFA L1 基础课（体验课）"
//  },
//  {
//  "categoryIndex": 20,
//  "effectiveDay": 270,
//  "taskTotal": "46",
//  "isU": "false",
//  "categoryId": "ff80808149cc09f70149f3e7b9534654",
//  "courseBkImage": "/upload/201601/b520b1a96b624f9a92f961ed73aedf52.png",
//  "courseId": "8a22ecb55210cb6b0152116aef77016e",
//  "outline": "",
//  "teacherName": "CFA明星讲师团",
//  "lastmodifyTime": 1469897687,
//  "orderID_item_id": "8a22ecb5535aa60801538413c0676419",
//  "categoryName": "CFA",
//  "subjectName": "L1基础课",
//  "courseIndex": 3,
//  "expirationTime": 1486784287,
//  "subjectID": "ff80808149cc09f70149f3e860fa4655",
//  "buyTime": 1458209800,
//  "teacherImage": "/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png",
//  "versionId": "ff8080814dc1dc4e014e006d4a312c37",
//  "teacherHonor": "",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "2016 CFA L1 前导课"
//  },
//  {
//  "categoryIndex": 10,
//  "effectiveDay": 280,
//  "taskTotal": "19",
//  "isU": "false",
//  "categoryId": "ff808081486933e601489c4662f60851",
//  "courseBkImage": "/upload/201502/d6df146c0f28488084230038f14f1cdb.jpg",
//  "courseId": "ff8080814dc1dc4e014dd5d304f00b6d",
//  "outline": "",
//  "teacherName": "QiQi Wu",
//  "lastmodifyTime": 1470136104,
//  "orderID_item_id": "8a22ecb553ca891a0153f47cf5e3642c",
//  "categoryName": "CMA中文",
//  "subjectName": "CMA 中文 Part-1",
//  "courseIndex": 120,
//  "expirationTime": 1485403888,
//  "subjectID": "ff808081486933e601489c799f0f0868",
//  "buyTime": 1460095743,
//  "teacherImage": "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//  "versionId": "ff8080814997fb360149986602300200",
//  "teacherHonor": "吴奇奇",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "2015 CMA Part1 财务规划 绩效与控制 串讲"
//  },
//  {
//  "categoryIndex": 20,
//  "effectiveDay": 270,
//  "taskTotal": "664",
//  "isU": "false",
//  "lastTaskId": "8a22ecb5527d453f015280e629ac0011",
//  "courseId": "8a22ecb55210cb6b0152116a2bdc016c",
//  "lastTaskdate": 1470301904000,
//  "outline": "",
//  "teacherName": "CFA明星讲师团",
//  "orderID_item_id": "8a22ecb5535aa60801538413bffa640d",
//  "lastmodifyTime": 1470236449,
//  "categoryName": "CFA",
//  "subjectName": "L1基础课",
//  "courseIndex": 4,
//  "subjectID": "ff80808149cc09f70149f3e860fa4655",
//  "progressSum": 637,
//  "teacherHonor": "",
//  "availability": "",
//  "lastTaskName": "LOS1.a Describe the structure of the CFA Institute Professional Conduct Program and the process for the enforcement of the Code and Standards.",
//  "courseBkImage": "/upload/201601/bf35ed9f6cae41019804161f21b729de.png",
//  "categoryId": "ff80808149cc09f70149f3e7b9534654",
//  "chapterName": "Reading 1: Code of Ethics and Standards of Professional Conduct",
//  "taskprogress": 1,
//  "chapterId": "8a22ecb55214bf87015214ef70380074",
//  "expirationTime": 1482819155,
//  "buyTime": 1458209800,
//  "teacherImage": "/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png",
//  "versionId": "ff8080814a04df96014a3d8e4f6a067a",
//  "lastState": "init",
//  "subjectIndex": 50,
//  "lastProgress": 0,
//  "courseName": "2016 CFA 基础课"
//  },
//  {
//  "categoryIndex": 20,
//  "effectiveDay": 270,
//  "taskTotal": "292",
//  "isU": "false",
//  "categoryId": "ff80808149cc09f70149f3e7b9534654",
//  "courseBkImage": "/upload/201601/f0d3daf53ab845a7821d9b2cdebdcc92.png",
//  "courseId": "8a22ecb5526cc38e015278501f28000c",
//  "outline": "",
//  "teacherName": "CFA明星讲师团",
//  "lastmodifyTime": 1469743774,
//  "orderID_item_id": "8a22ecb5535aa60801538413c0186411",
//  "categoryName": "CFA",
//  "subjectName": "L1强化课",
//  "courseIndex": 5,
//  "expirationTime": 1481607480,
//  "subjectID": "ff8080814e9056e4014e91459e810493",
//  "buyTime": 1458209800,
//  "teacherImage": "/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png",
//  "versionId": "ff8080814e9056e4014e911137490330",
//  "teacherHonor": "",
//  "subjectIndex": 50,
//  "availability": "",
//  "courseName": "2016 CFA 强化课"
//  }
//  ],
//  "pageNo": 1,
//  "pageSize": 1000
//  },
//  "state": "success",
//  "msg": ""
//  };
// var tpl = $('#tpl').html();
// var content = doT.template(tpl);
// $('#content').html(content(data.data.courselist));



var is_loding=false;
function getData(page) {
	/*
	 var tpl = $('#tpl').html();
	 var content = doT.template(tpl);
	 $('#content').html(content(data));
	 return;
	 //            var tpl = $('#tpl').html();
	 //            var content = doT.template(tpl);
	 //            if (page == 1) {
	 //                $('#content').html(content(data));
	 //            } else {
	 //                $('#content').append(content(data));
	 //            }
	 //
	 //            return ;
	 */
	var param = {};
	param.pageNo = page;
	param.pageSize = pageSize;
	param.token = $api.getStorage('token');
	if(page==1&& show_pro && !is_loding){
	    api.showProgress({
	        title : '加载中',
	        modal : false
	    });
	}
	ajaxRequest('api/v2.1/learning/learningcourse', 'get', param, function(ret, err) {//008.003.2 在学的课程列表（new）编号  :
        api.refreshHeaderLoadDone();
        is_loding=true;
		if(show_pro){
            api.hideProgress();
        }
		if (err) {
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		var tpl = $('#tpl').html();
		var content = doT.template(tpl);
		if (ret && ret.state == 'success') {
			total = ret.data.total;
			if (page == 1) {
				if (isEmpty(ret.data.courselist)) {
					$('body').addClass('null');
					return false;
				}
				$('#content').html(content(ret.data.courselist));
			} else {
				if (isEmpty(ret.data.courselist)) {
					return false;
				}
				$('#content').append(content(ret.data.courselist));
			}
			saveExpire(ret.data.courselist);

			progressBar();
			api.parseTapmode();
		} else {
			//api.toast({
			//	msg : ret.msg,
			//	location : 'middle'
			//});
		}
	});

}

apiready = function() {

	//获取页面的数据
	getData(1);
	api.addEventListener({
		name : 'flush_study'
	}, function(ret, err) {
		getData(1);
	});
	//监听下拉刷新
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/arrow-down-o.png',
		bgColor : '#f3f3f3',
		textColor : '#787b7c',
		textDown : '下拉更多',
		textUp : '松开刷新',
		showTime : false
	}, function(ret, err) {
		getData(1);
		currentPage = 1;
	});
	//监听滚动到底部
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (total == 0 || currentPage < Math.ceil(total / pageSize)) {
			currentPage++;
			getData(currentPage);
			progressBar();
		}
	});

	//监听横屏切换竖屏事件
	api.addEventListener({
		name : 'changeScreen'
	}, function(ret, err) {
		//切换屏幕
		api.setScreenOrientation({
			orientation : 'portrait_up'
		});
	});
};
//历史课程详情
function course_det(_this,xyc, a, b,  e, f) {

	var c = $(_this).data('chaptername');
	var d = $(_this).data('coursename');
	//if(c=='undefined'||!c){
	//    return false;
	//}
	$api.setStorage('studying_to_center', 1);
	api.openWin({
		name : xyc,
		url : xyc + '.html',
		bgColor : '#fff',
		opaque : true,
		reload : true,
		softInputMode : 'resize',
		pageParam : {
			tag : 1,
			courseId : a,
			chapterId : b,
			chapterName : c,
			courseName : d,
			categoryId : e,
			subjectId : f
		},
		vScrollBarEnabled : false,
		slidBackEnabled : false
	});
}

//进度条
//setInterval(function(){},16.7);
function slidePro() {
	var progress = document.querySelectorAll('.wodPro');
	//每一个都执行
	for (var i = 0; i < progress.length; i++) {
		var pro = progress[i];
		//获取当前的进度父容器
		start();
	}
	//条形进度条的方法
	function start() {
		var bt = 0;
		//获取父容器下的数字标签
		var progressBT = pro.querySelector('.stydyProBcout');
		//获取进度到的数字
		var progressBTS = parseInt(progressBT.innerHTML);
		//获取变化的进度元素
		var progressChange = pro.querySelector('.stydyProIN');
		var Go = setInterval(function() {
			bt++;
			if (progressBTS == 0) {
				bt = 0;
			}
			progressChange.style.width = bt + '%';
			//改变元素的宽度

			if (bt == progressBTS || progressBTS == 0) {
				clearInterval(Go);
			}
		}, 16.7);
	}

}

//找出任务进度
function findTask(study_progress, course_detail) {
	var chapters_num = 0;
	//一级章节索引
	var chapters_child_num = 0;
	//二级章节索引
	var child_task_num = 0;
	//任务索引
	if (!isEmpty(study_progress)) {
		var tmp_chapterId = study_progress.chapterId;
		//二级章节id
		var tmp_taskId = study_progress.taskId;
		//任务id
		for (var i in course_detail.chapters) {
			var first_charpter_info = course_detail.chapters[i];
			//循环获取一级章节信息
			for (var j in first_charpter_info.children) {
				var second_charpter_info = first_charpter_info.children[j];
				//循环获取二级章节信息
				if (second_charpter_info.chapterId == tmp_chapterId) {
					var tasks = second_charpter_info.tasks;
					for (var k in tasks) {
						if (tasks[k].taskId == tmp_taskId) {
							if (study_progress.state == 'complate') {
								//该任务已完成，执行下个任务
								if (k == tasks.length - 1) {
									//如果是二级章节的最后一个任务，则执行下个章节
									if (j == first_charpter_info.children.length - 1) {
										//如果二级章节已经是最后一个，则执行下个一级章节
										if (i == course_detail.chapters.length - 1) {
											//如果一级章节已经是最后一个，则询问是否重新学习
											api.confirm({
												title : '温馨提示',
												msg : '恭喜你，该课程已学完，再学一遍？',
												buttons : ['确定', '取消']
											}, function(ret, err) {
												if (ret.buttonIndex == 1) {
													return {
														chapters_num : 0,
														chapters_child_num : 0,
														child_task_num : 0
													};
												} else {
													return false;
												}
											});
										} else {
											return {
												chapters_num : parseInt(i) + 1,
												chapters_child_num : 0,
												child_task_num : 0
											};
										}
									} else {
										return {
											chapters_num : i,
											chapters_child_num : parseInt(j) + 1,
											child_task_num : 0
										};
									}
								} else {
									return {
										chapters_num : i,
										chapters_child_num : j,
										child_task_num : parseInt(k) + 1
									};
								}
							} else {
								//继续执行该任务
								return {
									chapters_num : i,
									chapters_child_num : j,
									child_task_num : k
								};
							}
						}
					}
				}
			}
		}
	}
	return {
		chapters_num : chapters_num,
		chapters_child_num : chapters_child_num,
		child_task_num : child_task_num
	};
}

//点击页面上的在学课程，跳转学习课程页面
function play(courseId) {
	if (isEmpty(courseId)) {
		//var courseId = 'ff8080814db86d41014dc13f0a59024e';
		api.toast({
			msg : '课程ID无效',
			location : 'middle'
		});
		return false;
	}
	$api.setStorage('ios_style', 1);
	api.showProgress({
		title : '加载中',
		modal : false
	});
	//如果没有缓存信息，就从接口获取
	var tmp_course_detail = $api.getStorage(courseId);
	if (isEmpty(tmp_course_detail)) {
		//获取课程的详细信息
		//api/v2.1/course/courseDetail，接口编号：004-006
		ajaxRequest('api/v2.1/course/courseDetail', 'get', {
			courseId : courseId
		}, function(ret, err) {//004.006获取课程的详细信息
			if (err) {
				api.hideProgress();
				api.toast({
					msg : err.msg,
					location : 'middle'
				});
				return false;
			}
			if (ret && ret.state == 'success') {
				var course_detail = ret.data[0];
				//课程详情数据
				$api.setStorage(courseId, course_detail);
				//用户上次的学习进度
				getLastProgress(course_detail);
			}
		});
	} else {
		var course_detail = tmp_course_detail;
		//存储课程详细信息
		getLastProgress(course_detail);
		//用户上次学习进度数据
	}
}

//判断任务类型，跳转相应的页面
function judge_task(res_process, course_detail, last_progress) {
	if (isEmpty(res_process)) {
		res_process = {
			chapters_num : 0,
			chapters_child_num : 0,
			child_task_num : 0
		};
	}
	if (isEmpty(course_detail) || isEmpty(course_detail.chapters)) {
		return false;
	}
	var chapters_info = course_detail.chapters[res_process.chapters_num];
	if (isEmpty(chapters_info.children)) {
		return false;
	}
	//当前一级章节信息
	var chapters_child_info = chapters_info.children[res_process.chapters_child_num];
	if (isEmpty(chapters_child_info.tasks)) {
		return false;
	}
	//当前二级章节信息
	var task_info = chapters_child_info.tasks[res_process.child_task_num];
	//当前任务信息
	//判断当前任务类型
	if (isEmpty(task_info) || isEmpty(task_info.taskType)) {
		api.toast({
			msg : '无课程任务',
			location : 'middle'
		});
		return;
	}
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
			msg : '暂无任务，请稍后再试或联系客服',
			location : 'middle'
		});
		return false;
	}
	//需要传递的参数
	var pageParams = {
		from : 'course-studying',
		last_progress : last_progress, //上次的学习进度
		course_detail : course_detail, //课程详情
		chapters_num : res_process.chapters_num, //一级章节索引
		chapters_child_num : res_process.chapters_child_num, //二级章节索引
		child_task_num : res_process.child_task_num, //任务索引
		task_info : task_info, //当前要学习的任务信息
		type : 'task'
	};
	api.hideProgress();
	//设置屏幕向右翻转
	api.setScreenOrientation({
		orientation : 'landscape_right'
	});
	//跳转到横屏页面
	api.openWin({
		name : new_win_name,
		url : new_win_url,
		delay : 200,
		slidBackEnabled : false, //iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
		pageParam : pageParams
	});
}

//获取上一次的学习进度
function getLastProgress(course_detail) {
	var courseId = course_detail.courseId;
	var tmpParam = {
		'token' : $api.getStorage('token'), //必须
		'memberId' : get_loc_val('mine', 'memberId'),
		'categoryId' : course_detail.categoryId, //非必须
		'subjectId' : course_detail.subjectId, //非必须
		'courseId' : courseId, //非必须
		'chapterId' : '', //非必须
		'taskId' : ''//非必须
	};
	//(实时)最后一次任务状态（new）tested,编号:008.026,GET - /api/v2.1/chapter/tasklastProgress
	ajaxRequest('api/v2.1/chapter/tasklastProgress', 'get', tmpParam, function(ret, err) {//008.026 最后一次任务状态（new）tested，接口编号：008-026
		if (err) {
			api.hideProgress();
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		if (ret && ret.state == 'success') {
			if (isEmpty(ret.data)) {
				//api.toast({
				//    msg:'获取任务信息失败',
				//    location:'middle'
				//});
				//return false;
				var res_process = {
					chapters_num : 0,
					chapters_child_num : 0,
					child_task_num : 0
				};
				judge_task(res_process, course_detail, 0);
			} else {
				var study_progress = ret.data;
				var res_process = findTask(study_progress, course_detail);
				//根据进度和课程信息，找到要学习的任务
				if (isEmpty(res_process)) {
					return false;
				} else {
					judge_task(res_process, course_detail, study_progress.progress);
				}
			}

		}
	});
}

function to_jh() {
	api.sendEvent({
		name : 'wjhkc'
	});
}