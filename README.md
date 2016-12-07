# studycenterAppDemo
## 一，搭建测试环境
工具：Sublime3, 系统：windows
######  step 1:

创建项目测试目录
	
	'mkdir studycenterApp'	
下载代码到测试目录
	
	'git clone git@github.com/developercaicui/studycenterAppDemo.git'(不要用https的方式)
###### step 2:
[Sublime3 WiFi真机同步和WiFi真机预览](http://docs.apicloud.com/Dev-Tools/sublime-wifi-sync)

	
######  step 3:
安装库文件
	
	'npm install'
开启代码检测

	'gulp server'

## 二，目录结构&提交代码
> studycenterAppDemo：根目录
>
> 	demo：apicloud 的测试代码
>
> 	node_modules：npm库文件
>
> 	build：jade(html)模版&stylus(css)模版

获取远程demo分支,并切换到demo分支
	
	'git checkout  –b demo origin/demo'

在本地建立自己开发的分支branchName，开发完，

切换到demo分支

  'git checkout demo'

合并分支到当前分支
  
  'git merge branchName'

进入demo目录，提交代码并添加提交信息
	
	'git add *'
	'git commmit -m "提交信息"'
返回根目录，上传到demo分支
		
	'git push origin demo'

>多人协作工作模式一般是这样的：
>
>首先，可以试图用git push origin branch-name推送自己的修改.
>
>如果推送失败，则因为远程分支比你的本地更新早，需要先用git pull试图合并。
>
>如果合并有冲突，则需要解决冲突，并在本地提交。再用git push origin branch-name推送。