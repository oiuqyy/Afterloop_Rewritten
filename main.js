//Afterloop Rewritten alpha1.0, 20250204
//附带文件：index.html, button_manager.js, information_manager.js, canvas_manager.js
//使用库：jquery-3.7.1, bootstrap

//对标AfterLoop.js
//注释一律离代码两个空格！！！

//direction 1=up, 2=right, 3=down, 4=left
const version_info = 'Afterloop Rewritten alpha1.0, 20250204';
const default_level_structure = [  //测试用例，不允许修改
    [
        ['-', '', '', 'pu', '', 'br', '', '', '-', '-'],
        ['S', '', 'y', '', 'gr', '', 'lb', '', '', '-'],
        ['yg', '', '', 'pu', '', 'br', 'yg', '', '', 'E'],
        ['-', '', 'y', '', 'gr', '', 'lb', '', '-', '-']
    ],
    {
        'pu': '|',
        'gr': '|',
        'br': '|',
        'y': '|',
        'lb': '|',
        'yg': '-',
        '-': 'x',
        '': '/',
        'S': '/',
        'E': '/'
    },
    '000 Test'
];

var ctx = $("#Canvas")[0].getContext("2d");  //ctx的作用域不知道为什么出过好多bug，注意一下
const ctx_width = 1000;  //可改为ctx.canvas.width
const ctx_height = 500;
var state = 0;  //目前状态，0加载中，1等待玩家操作，2动画中不允许移动，3关卡胜利

class Block {  //相同颜色的块算一个Block
    constructor(blockname, blocktype) {  //name例如'y', 'bl'这种，locs是这个块里每个方块的位置的列表，blocktype为+-|和x，墙就是x
        this.blockname = blockname;
        this.locs = new Array();
        this.blocktype = blocktype;
    }
    addLoc(loc) {
        this.locs.push(loc);
    }
    getNei(direction, level) {  //传入方向，输出对应方向上的邻居的方块列表，列表元素Block名字
        //direction 1=up, 2=right, 3=down, 4=left
        let save = level.save;
        let width = level.width;
        let height = level.height;
        let neilist = [];
        for (let i = 0; i < this.locs.length; i++) {
            let location = this.locs[i];
            if (direction == 1 || direction == 3) {
                location[0] += direction - 2;
            } else {
                location[1] -= direction - 3;
            }
            if (location[0]==-1||location[0]==height||location[1]==-1||location[1]==width){  //若坐标在地图外面
                return ['-'];  //直接输出墙
            }
            let item = save[location[0]][location[1]];
            if (!(neilist.includes(item)||item=='')) {
                neilist.push(item);
            }
        }
        return neilist;
    }
    getMoveList(direction, level) {
        
    }
    move() {

    }
}

class Level {  //由于旧的level由列表结构体组成，这里重构为了对象，使得对level的调用更加方便，同时也提升了效率
    constructor(level_structure) {  //传入的level_structure是旧的列表体
        this.save = level_structure[0];
        this.typedict = level_structure[1];  //就是存储块名字和-|+x的对象
        this.name = level_structure[2];
        this.width = this.save[0].length;
        this.height = this.save.length;
        //first_skim部分，为Level里的每个块生成Block类的对象，添加到Level.blocklist属性里；块名字和对象添加到Level.blocknamedict里
        //并找出start和end
        let tempblocklist = [];
        let tempblocknamedict = new Object();
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let item = this.save[i][j];
                if (item == 'S') { this.start = [i, j]; }
                if (item == 'E') { this.end = [i, j]; }
                if (item !== '' && item !== 'E' && !tempblocklist.includes(item)) {
                    tempblocklist.push(item);
                    tempblocknamedict[item] = new Block(item, this.typedict[item]);
                }
            }
        }
        //second_classfy部分，完善Block对象的locs列表
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let item = this.save[i][j];
                if (item !== '' && item !== 'E') {
                    tempblocknamedict[item].addLoc([i, j]);
                }
            }
        }
        this.blocklist = tempblocklist;
        this.blocknamedict = tempblocknamedict;
        // console.log(this.blocklist);
        // console.log(this.blocknamedict);
    }
    move(direction) {  //处理玩家想要移动的函数
        // addInfo('secondary', '用户想要移动' + String(direction));
    }
}

var level = new Level(default_level_structure);  //生成默认关卡

function init() {  //初始化
    state = 0;
    var ctx = $("#Canvas")[0].getContext("2d");
    drawLevel(ctx, level);  //绘制level（在canvas_manager.js里）
    $('#level_name')[0].innerText = level.name;  //加载默认关卡名字
    addInfo('primary', version_info);
    state = 1;  //等待玩家操作
}