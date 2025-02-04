//AfterloopSimulator alpha1.6
//Author: oiuqyy
//air='', wall='-'. start='S', end='E'
//加了方向，边框圆角有了，导入导出功能增加了，接下来解决移动动画，或者增加选关页面（小地图用的上了），或者想办法适配手机端吧
//附带文件:AfterLoop.html、display.js和AfterLoop.css
var level = [
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
        'S': '+',
        'E': '/'
    },
    '011 Moose'
];
var item = '';
var typedict = {};
var start, end, locss, locs, blocknames, save = new Array();
var i, j, k, height, width = 0;

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0; i < arr1.length; i++) {
        if (!arr2.includes(arr1[i])) {
            return false;
        }
        if (!arr1.includes(arr2[i])) {
            return false;
        }
    }
    return true;
}

function first_skim(thelevel) {
    blocknames = [];
    save = thelevel[0];
    typedict = thelevel[1];
    for (i = 0, len = save.length; i < len; i++) {
        for (var j = 0, len2 = save[0].length; j < len2; j++) {
            item = save[i][j];
            if (!blocknames.includes(item)) {
                if (!(item == 'S' || item == 'E')) {
                    blocknames.push(item);
                } else if (item == 'S') {
                    start = [i, j];
                } else if (item == 'E') {
                    end = [i, j];
                }
            }
        }
    }
    if (blocknames.includes('-')) {
        blocknames.splice(blocknames.indexOf('-'), 1);
    }
    if (blocknames.includes('')) {
        blocknames.splice(blocknames.indexOf(''), 1);
    }
    return blocknames, start, end, save.length, save[0].length;
}

function second_classify(save, blocknames) {
    locss = [];
    for (i = 0, len = blocknames.length; i < len; i++) {
        locs = [];
        for (j = 0, len2 = save.length; j < len2; j++) {
            for (k = 0, len3 = save[0].length; k < len3; k++) {
                item = save[j][k];
                if (item == blocknames[i]) {
                    locs.push([j, k]);
                }
            }
        }
        locss.push(locs);
    }
    return locss;
}

function getnei(loc, direction) {
    var neiloc;
    var i2 = loc[0];
    var j2 = loc[1];
    var save1 = JSON.parse(JSON.stringify(save)); //复制地图数组
    if (direction == 1) {
        neiloc = [i2 - 1, j2];
    } else if (direction == 2) {
        neiloc = [i2 + 1, j2];
    } else if (direction == 3) {
        neiloc = [i2, j2 - 1];
    } else if (direction == 4) {
        neiloc = [i2, j2 + 1];
    } else {
        alert("AttributeError: given direction " + String(direction) + " not found");
    }
    if ((neiloc[0] >= save.length) || (neiloc[0] == -1) || (neiloc[1] >= save[0].length) || (neiloc[1] == -1)) {
        return '-';
    } else {
        i2 = neiloc[0];
        j2 = neiloc[1];
        var nei2 = save[i2][j2];
        if (['', 'S', 'E'].includes(nei2)) {
            return '';
        } else if (nei2 == '-') {
            return '-';
        } else {
            for (var k = 0, len = blocks.length; k < len; k++) {
                if (blocks[k].name == nei2) {
                    return blocks[k];
                }
            }
        }
    }
}


function alerthelper(thelist) { //只是用来调试的，没有实际作用的函数
    var item;
    var newlist = [];
    for (var i = 0; i < thelist.length; i++) {
        item = thelist[i];
        if (item == '-' || item == '') {
            newlist.push(item);
        } else {
            newlist.push(item.name);
        }
    }
    return newlist;
}

class block {
    constructor(name, locs, blocktype) {
        this.name = name;
        this.locs = locs;
        this.blocktype = blocktype;
    }

    can_move(direction) {
        var movelist = this.getmovelist(direction, 'all');
        if (movelist.includes('-')) {
            return 0;
        }
        for (var i = 0; i < movelist.length; i++) {
            if (movelist[i].blocktype == '-' && direction < 3) {
                return 0;
            }
            if (movelist[i].blocktype == '|' && direction > 2) {
                return 0;
            }
        }
        return 1;
    }

    getmovelist(direction, recursion) { //recursion递归，返回direction方向上的所有邻居，以对象的方式呈现，除了墙用‘-’，包括自己
        var nei;
        var movelist = [];
        var newmovelist = [];
        var neilist = [];
        if (recursion == 'all') {
            for (i = 0; i < this.locs.length; i++) {
                nei = getnei(this.locs[i], direction);
                if (nei == '-') {
                    if (!movelist.includes('-')) {
                        movelist.push('-');
                    }
                } else if (nei != '') {
                    if (!movelist.includes(nei)) {
                        movelist.push(nei);
                    }
                }
            }
            var mi = 0;
            while (!arraysEqual(newmovelist, movelist)) {
                mi = mi + 1;
                if (mi > 5) { return [newmovelist, movelist]; }
                newmovelist = [];
                for (var i = 0; i < movelist.length; i++) {
                    newmovelist.push(movelist[i]);
                }
                for (i = 0; i < movelist.length; i++) {
                    if ((movelist[i] != '-') && (movelist[i] != '')) {
                        neilist = movelist[i].getmovelist(direction, 'one');
                        for (j = 0; j < neilist.length; j++) {
                            if (!movelist.includes(neilist[j])) {
                                movelist.push(neilist[j]);
                            }
                        }
                    }
                }
            }
        } else if (recursion == 'one') {
            for (i = 0; i < this.locs.length; i++) {
                nei = getnei(this.locs[i], direction);
                if (nei == '-') {
                    if (!movelist.includes('-')) {
                        movelist.push('-');
                    }
                } else if (nei != '') {
                    if (!movelist.includes(nei)) {
                        movelist.push(nei);
                    }
                }
            }
        }
        if (!movelist.includes(this)) {
            movelist.push(this);
        }
        return movelist;
    }
}

function bigger(save, element = '-') {
    height = save.length;
    width = save[0].length;
    var s2 = [];
    for (i = 0; i < width + 2; i++) {
        s2.push(element);
    }
    for (i = 0; i < height; i++) {
        s2.push([element].concat(save[i]).concat([element]));
    }
    s2.push(s2[0]);
    return s2;
}

function move(save, block, direction) { //这里的block是name不是object
    var li = blocks[blocknames.indexOf(block)].getmovelist(direction, 'all');
    for (i = 0; i < li.length; i++) {
        li[i] = li[i].name;
    }
    li.push('S');
    var movemap = [];
    var temp = [];
    var i, j = 0;
    for (i = 0; i < save.length; i++) {
        temp = [];
        for (j = 0; j < save[0].length; j++) {
            if (li.includes(save[i][j])) {
                temp.push(save[i][j]);
                save[i][j] = '';
            } else {
                temp.push('UND');
            }
        }
        movemap.push(temp);
    }
    for (i = 0; i < movemap.length; i++) {
        for (j = 0; j < movemap[0].length; j++) {
            if (movemap[i][j] != 'UND') {
                if (direction == 1) {
                    save[i - 1][j] = movemap[i][j];
                } else if (direction == 2) {
                    save[i + 1][j] = movemap[i][j];
                } else if (direction == 3) {
                    save[i][j - 1] = movemap[i][j];
                } else if (direction == 4) {
                    save[i][j + 1] = movemap[i][j];
                }
            }
        }
    }
    return save;
}

function moveplayer(save, direction) {
    i = start[0];
    j = start[1];
    save[i][j] = '';
    if (direction == 1) {
        save[i - 1][j] = 'S';
        start = [i - 1, j];
    } else if (direction == 2) {
        save[i + 1][j] = 'S';
        start = [i + 1, j];
    } else if (direction == 3) {
        save[i][j - 1] = 'S';
        start = [i, j - 1];
    } else if (direction == 4) {
        save[i][j + 1] = 'S';
        start = [i, j + 1];
    }
    return save;
}

function printmap(save) {
    var txt = '';
    var bigsave = bigger(save);
    for (i = 0; i < bigsave.length; i++) {
        for (j = 0; j < bigsave[0].length; j++) {
            txt = txt + "<span style='color:" + color[bigsave[i][j]] + "'>▇</span>";
        }
        txt = txt + '<br>';
    }
    return txt;
}

function step(op) {
    if (getnei(start, op) == '') {
        save = moveplayer(save, op);
    } else if (getnei(start, op) == '-') {
        //document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + '<br>You cant do this!!!Blocked!!!';
    } else if (getnei(start, op).can_move(op) == 0) {
        //document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + '<br>You cant do this!!!Blocked!!!';
    } else {
        save = move(save, getnei(start, op).name, op);
        if (op == 1) {
            start[0] = start[0] - 1;
        } else if (op == 2) {
            start[0] = start[0] + 1;
        } else if (op == 3) {
            start[1] = start[1] - 1;
        } else if (op == 4) {
            start[1] = start[1] + 1;
        }
        locss = second_classify(save, blocknames);
        blocks = [];
        for (var l = 0; l < blocknames.length; l++) {
            blocks.push(new block(blocknames[l], locss[l], typedict[blocknames[l]]));
        }
    }
    if (start[0] == end[0] && start[1] == end[1]) {
        document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + '<br>You win!!!';
    }
    level[0] = save;
    document.getElementById('gamezone').innerHTML = create_displayer(level);
}

var color = {
    '': 'white',
    '-': 'black',
    'S': 'green',
    'E': 'grey',
    'bl': 'blue',
    'y': 'yellow',
    'br': 'brown',
    'pu': 'purple',
    'pi': 'pink',
    'gr': 'lightgreen', 
    'yg': 'yellowgreen',
    'lb': 'lightblue'
};

function init() {
    blocks = []; //存储所有block类，以name和class为一对存储
    blocknames, start, end, height, width = first_skim(level);
    locss = second_classify(save, blocknames);
    for (var l = 0; l < blocknames.length; l++) {
        blocks.push(new block(blocknames[l], locss[l], typedict[blocknames[l]]));
    }
}