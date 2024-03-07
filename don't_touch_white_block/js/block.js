// 游戏容器类 Block
class Block {
    constructor(container) {
        this.container = container;     //游戏容器
        this.timer = null;              //计时器
		this.temp = -1;					//标签
        this.state = false;             //游戏状态
        this.speed = 2;                 //游戏速度
        this.sum = 0;                   //游戏分数
        this.top = -150;                //容器顶部
        this.lastRowChilds = null;      //最后一行
    }
    //开始游戏
    start() {
        let _this = this;
        this.state = true;
        //创建行
        for (let i = 0; i < 4; i++) {
            this.createRow();
            console.log('创建行');
        }
        //每单位时间处理事件
        this.timer = setInterval(() => {
            _this.move();
            _this.judge();
        }, 25);

    }

    //创建新行
    createRow() {
        // const contain = this.container;
        //添加内容从首子节点开始添加
        let firstChild = this.container.firstChild;
        let rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        // 行内方块，随机黑色
        let blocks = ['block', 'block', 'block', 'block'];
        let random = Math.floor(Math.random() * 4);
        blocks[random] = 'black';
        // 添加进入行
        for (let i = 0; i < 4; i++) {
            let block = document.createElement('div');
            block.className = blocks[i];
            rowDiv.appendChild(block);
        }

        if (firstChild == null) {
            //没有行，添加
            this.container.appendChild(rowDiv);
        } else {
            //有行，添加到一号子节点
            this.container.insertBefore(rowDiv, firstChild);
        }
    }

    //界面移动
    move() {
        this.top += this.speed;     //随速度累加
        this.container.style.top = this.top + 'px';
    }

    //判断游戏状态
    judge() {
        // 容器出框，创建行
        //获取容器所有行
        let rowChilds = document.getElementsByClassName('row');
        this.lastRowChilds = rowChilds[rowChilds.length - 1];
		
		for (let i = 0; i < this.lastRowChilds.childNodes.length; i++) {
		    if (this.lastRowChilds.childNodes[i].className == 'black') {
		        this.temp = i;
				console.log(this.temp);
		    }
		}
		
        if (this.top >= 0) {
            // 到达底部自动生成块
            this.createRow();
            // 容器视图回到-150px
            this.top = -150;
            this.container.style.top = '-150px';
            console.log('回到位置:', this.container.offsetTop);
            // 在最后一行的所有块中遍历
            for (let i = 0; i < this.lastRowChilds.childNodes.length; i++) {
                // 游戏自动进行时游戏状态
                if (this.lastRowChilds.childNodes[i].className == 'black') {
                    console.log('有黑的，游戏结束');
                    this.gameOver();
                } else if(rowChilds.length == 6){      //除了游戏开始，让容器适中存在五行
                    this.container.removeChild(this.lastRowChilds);
                }
            }
        }
        this.flash();
    
    }

    //显示得分
    flash() {
        let score = document.getElementById('score');
        score.innerHTML = this.sum;
        let res = document.getElementById('res');
        res.innerHTML = `得分: ${this.sum}`;
    }

    // 点击监听
    keyEvent() {
        let aim = -1;
		let _this = this;
        // 为容器添加点击监听
		document.onkeydown = function(e){
			console.log('执行了keyEvent');
			if(e.key == "r"){ //如果键盘按了R
				aim = 0;
			}else if(e.key == "t"){ //如果键盘按了T
				aim = 1;					
			}else if(e.key == "y"){ //如果键盘按了Y
				aim = 2;			
			}else if(e.key == "u"){ //如果键盘按了U
				aim = 3;
			}
			
            if (aim == _this.temp) {
                _this.sum++;            //点击黑块得分增加
                _this.speed += 0.2;     //速度增加
                console.log('点到了黑块,速度增加为:', _this.speed);
				_this.lastRowChilds.childNodes[_this.temp].className = 'block';
				_this.temp = -1;
            } else {
                console.log('点到了白块');
                _this.gameOver();         //游戏结束
            }
		}
    }

    // 游戏结束
    gameOver() {
        this.state = false;      //游戏状态置为false
        clearInterval(this.timer);         //清空定时器
        const curtain_end = document.getElementById('curtain_end'); //展示页面
        curtain_end.style.display = 'block';
    }

    //重新开始
    again() {
        this.timer = null;              //计时器
        this.state = false;             //游戏状态
        this.speed = 2;                 //游戏速度
        this.sum = 0;                   //游戏分数
        this.top = -150;                //容器顶部
        this.lastRowChilds = null;      //最后一行
        this.container.innerHTML = '';  //将容器置空
        this.start();
    }
}
