//Afterloop Rewritten alpha1.0, 20250204
//附带文件：index.html, button_manager.js, information_manager.js, canvas_manager.js
//使用库：jquery-3.7.1, bootstrap

//对标AfterLoop.js
//注释一律离代码两个空格！！！

//B=Beacon, B-=Beacon Barrier
const version_info = 'Afterloop Rewritten alpha1.3, 20250212, 实现了信标判断、玩家推动、吃星星、下一关的功能，游戏终于可以玩了！下一步实现retry和关卡选择。';
const default_level_structure = [  //测试用例，不允许修改
    [
        ['', 'B', '', ''],  //但凡能写在这里的都应是Block（或空气）
        ['', 'pu', 'B-', '-'],
        ['S', 'br', 'y', '-'],
        ['gr', '', '', '-'],
        ['', '-', 'y', '']
    ],
    {
        'pu': '+',
        'gr': '|',
        'br': '|',
        'y': '|'
    },
    {
        name: '019 Caribou',
        starLocs: [[0, 0], [1, 1], [2, 2]],  //处理星星的逻辑分开写
        end: [4, 3],
        beaconReceiverLocs: [[0, 3]]  //信标图信标底座的位置
    }
];

var ctx = $("#Canvas")[0].getContext("2d");  //ctx的作用域不知道为什么出过好多bug，注意一下（好像是全局作用域会覆盖其他作用域的改动）
const ctx_width = 1000;  //可改为ctx.canvas.width
const ctx_height = 500;
var state = 0;  //目前状态，0加载中，1等待玩家操作，2动画中不允许移动，3关卡胜利

class Block {  //相同颜色的块算一个Block；Block Receiver不算Block而是分开在其他地方执行逻辑

    //重要：一局游戏中会生成的Block对象应有且仅有以下类型：
    //      Start（玩家）
    //      ColorBlock（各种颜色的方块）
    //      wall（墙）
    //      Beacon（信标）
    //      Beacon Barrier（信标屏障）
    //而星星、Beacon Receiver、end不算Block对象，不应有其实例

    constructor(blockname, level) {  //name例如'y', 'bl'这种，locs是这个块里每个方块的位置的列表，blocktype为+-|和x，墙就是x
        this.blockname = blockname;
        this.locs = new Array();
        if (blockname == '-' || blockname == 'B-') {
            this.blocktype = 'x';
        } else if (blockname == 'S' || (blockname[0] == 'B') && blockname !== 'B-') {  //若是玩家或信标
            this.blocktype = '+';
        } else {
            this.blocktype = level.typedict[blockname];
        }
        this.level = level;  //赋值level对象方便调用level属性
    }
    addLoc(loc) {
        this.locs.push(loc);
    }
    getNei(direction) {  //传入方向，输出对应方向上的邻居的方块列表，列表元素为Block名字
        if (this.blockname == '-' || this.blockname == 'B-') {  //如果是墙就别管了，直接输出墙
            return ['-']
        } else {
            let save = this.level.save;
            let width = this.level.width;
            let height = this.level.height;
            let neilist = [];
            for (let i = 0; i < this.locs.length; i++) {
                let location = [...this.locs[i]];  //使用扩展运算符实现深拷贝，防止原有属性被篡改
                if (direction == 'up') {
                    location[0] -= 1;
                } else if (direction == 'down') {
                    location[0] += 1;
                } else if (direction == 'left') {
                    location[1] -= 1;
                } else if (direction == 'right') {
                    location[1] += 1;
                } else {
                    addInfo('danger', 'directionError');
                }
                if (location[0] == -1 || location[0] == height || location[1] == -1 || location[1] == width) {  //若坐标在地图外面
                    return ['-'];  //直接输出墙
                }
                let item = save[location[0]][location[1]];
                if (!(neilist.includes(item) || item == '' || item == this.blockname)) {  //若不是空气也不是自己
                    neilist.push(item);
                }
            }
            return neilist;
        }
    }
    getMoveList(direction, recursion = 'all') { //recursion递归，返回direction方向上的所有邻居，以对象的方式呈现，除了墙用‘-’，包括自己
        let nei;
        let movelist = [];
        let newmovelist = [];
        let neilist = [];
        function arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) {
                return false;
            }
            for (let i = 0; i < arr1.length; i++) {
                if (!arr2.includes(arr1[i])) {
                    return false;
                }
                if (!arr1.includes(arr2[i])) {
                    return false;
                }
            }
            return true;
        }
        if (((direction == 'up' || direction == 'down') && this.blocktype == '-') || ((direction == 'left' || direction == 'right') && this.blocktype == '|')) {
            return ['-'];
        }
        if (recursion == 'all') {
            movelist = this.getNei(direction);
            let mi = 0;
            while (!arraysEqual(newmovelist, movelist)) {
                mi = mi + 1;
                if (mi > 5) {
                    return [newmovelist, movelist];
                }
                newmovelist = [];
                for (let i = 0; i < movelist.length; i++) {
                    newmovelist.push(movelist[i]);
                }
                for (let i = 0; i < movelist.length; i++) {
                    if ((movelist[i] != '-') && (movelist[i] != '')) {
                        neilist = this.level.blocknamedict[movelist[i]].getMoveList(direction, 'one');
                        for (let j = 0; j < neilist.length; j++) {
                            if (!movelist.includes(neilist[j])) {
                                movelist.push(neilist[j]);
                            }
                        }
                    }
                }
            }
        } else if (recursion == 'one') {
            neilist = this.getNei(direction);
            for (let i = 0; i < neilist.length; i++) {
                if (neilist[i] == '-') {
                    if (!movelist.includes('-')) {
                        movelist.push('-');
                    }
                } else if (neilist[i] != '') {
                    if (!movelist.includes(neilist[i])) {
                        movelist.push(neilist[i]);
                    }
                }
            }
        }
        if (!movelist.includes(this.blockname)) {
            movelist.push(this.blockname);
        }
        return movelist;
    }
    move(direction) {
        for (let i = 0; i < this.locs.length; i++) {
            if (direction == 'up') {
                this.locs[i][0] -= 1;
            } else if (direction == 'down') {
                this.locs[i][0] += 1;
            } else if (direction == 'left') {
                this.locs[i][1] -= 1;
            } else if (direction == 'right') {
                this.locs[i][1] += 1;
            }
        }
    }
}

class Level {  //由于旧的level由列表结构体组成，这里重构为了对象，使得对level的调用更加方便，同时也提升了效率
    constructor(level_structure) {  //传入的level_structure是旧的列表体
        this.save = level_structure[0];
        this.typedict = level_structure[1];  //就是存储块名字和-|+x的对象
        Object.assign(this, level_structure[2]);  //将信息复制给Level
        this.width = this.save[0].length;
        this.height = this.save.length;
        if ('beaconReceiverLocs' in this) {  //检测有没有信标
            this.hasBeacon = true;
        } else {
            this.hasBeacon = false;
        }
        //将信标B拆分为B1, B2, B3...，使得每个信标有自己的名字和Block
        let k = 1;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let item = this.save[i][j];
                if (item == 'B') {
                    this.save[i][j] = 'B' + String(k);
                    k += 1;
                }
            }
        }
        //first_skim部分，为Level里的每个块生成Block类的对象，添加到Level.blocklist属性里；块名字和对象添加到Level.blocknamedict里
        let tempblocklist = [];
        let tempblocknamedict = new Object();
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let item = this.save[i][j];
                if (item !== '' && !tempblocklist.includes(item)) {
                    tempblocklist.push(item);
                    tempblocknamedict[item] = new Block(item, this);
                }
            }
        }
        //second_classfy部分，完善Block对象的locs列表
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let item = this.save[i][j];
                if (item !== '') {
                    tempblocknamedict[item].addLoc([i, j]);
                }
            }
        }
        this.blocklist = tempblocklist;
        this.blocknamedict = tempblocknamedict;
        console.log(tempblocknamedict);
    }
    move(direction) {  //处理玩家想要移动的函数
        if (state == 1) {
            state = 0;  //在加载中
            let moveList = this.blocknamedict['S'].getMoveList(direction);
            if (moveList.includes('-')) {
                addInfo('danger', 'Blocked!');
            } else {
                //先创建要移动的方块的数组
                let temp_save = Array.from({ length: this.height }, () => Array(this.width));
                for (let i = 0; i < this.height; i++) {
                    for (let j = 0; j < this.width; j++) {
                        let item = this.save[i][j];
                        if (moveList.includes(item)) {
                            temp_save[i][j] = item;
                            this.save[i][j] = '';
                        } else {
                            temp_save[i][j] = '';
                        }
                    }
                }
                //再粘贴到原save
                for (let i = 0; i < this.height; i++) {
                    for (let j = 0; j < this.width; j++) {
                        let item = temp_save[i][j];
                        if (item !== '') {
                            if (direction == 'up') {
                                this.save[i - 1][j] = item;
                            } else if (direction == 'down') {
                                this.save[i + 1][j] = item;
                            } else if (direction == 'left') {
                                this.save[i][j - 1] = item;
                            } else if (direction == 'right') {
                                this.save[i][j + 1] = item;
                            }
                        }
                    }
                }
                //最后修改每个移动Block的locs
                for (let i = 0; i < moveList.length; i++) {
                    this.blocknamedict[moveList[i]].move(direction);
                }
            }
            this.checkEverything();
            state = 1;  //加载完毕
        }
    }
    checkEverything() {  //检测各种事件
        let playerLoc = this.blocknamedict['S'].locs[0];
        //检测吃星
        if ('starLocs' in this) {
            console.log(playerLoc);
            for (let i = 0; i < this.starLocs.length; i++) {
                if (playerLoc[0] == this.starLocs[i][0] && playerLoc[1] == this.starLocs[i][1]) {
                    this.starLocs.splice(i, 1);
                    addInfo('success', '获得一个星星！');
                }
            }
        }
        //检测信标
        if (this.hasBeacon) {
            let beacon_locs = [];
            for (let i = 0; i < this.blocklist.length; i++) {
                let blockname = this.blocklist[i];
                if (blockname[0] == 'B' && blockname !== 'B-') {
                    beacon_locs.push(this.blocknamedict[blockname].locs[0]);
                }
            }
            let goodBeaconNumber = 0;
            for (let i = 0; i < this.beaconReceiverLocs.length; i++) {
                for (let j = 0; j < beacon_locs.length; j++) {
                    if (this.beaconReceiverLocs[i][0] == beacon_locs[j][0] && this.beaconReceiverLocs[i][1] == beacon_locs[j][1]) {
                        goodBeaconNumber += 1;
                    }
                }
            }
            if (goodBeaconNumber == this.beaconReceiverLocs.length) {
                //删除所有信标墙
                for (let i = 0; i < this.height; i++) {
                    for (let j = 0; j < this.width; j++) {
                        if (this.save[i][j] == 'B-') {
                            this.save[i][j] = 0;  //此处为避免不必要的麻烦并没有处理B-的Block对象
                        }
                    }
                }
                addInfo('success', '信标谐振已完成！');
                this.hasBeacon = false;  //就装作它没有了吧
            }
        }
        //更新画面
        drawLevel(ctx, this);
        //检测通关，一定要放在更新画面后面哦！
        if (playerLoc[0] == this.end[0] && playerLoc[1] == this.end[1]) {  //如果到达终点
            nextLevel();
        }
    }
}
var level_index = 0;  //关卡编号，默认为0
var level;

function init() {  //初始化
    level = new Level(levels[level_index]);  //生成默认关卡
    state = 0;
    var ctx = $("#Canvas")[0].getContext("2d");
    drawLevel(ctx, level);  //绘制level（在canvas_manager.js里）
    if ('name' in level) {
        $('#level_name')[0].innerText = level.name;  //加载关卡名字
    } else {
        $('#level_name')[0].innerText = 'Untitled'
    }
    addInfo('primary', version_info);
    state = 1;  //等待玩家操作
}