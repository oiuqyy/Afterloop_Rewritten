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
        '-': '/',
        '': '/',
        'S': '/',
        'E': '/'
    },
    '011 Moose'
];

var levels = [
    [
        [
            ['S', 'pu', '', '', '', ''],
            ['-', '', '', '', '', 'E']
        ],
        {
            'pu': '-',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '001 Earth'
    ],
    [
        [
            ['S', 'pu', '', 'pu', '', ''],
            ['-', 'br', '', '', '', 'E']
        ],
        {
            'pu': '-',
            'br': '-',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '002 Neptune'
    ],
    [
        [
            ['', 'pu', 'pu', '', 'pu', 'E'],
            ['S', '', '', '', '', '-']
        ],
        {
            'pu': '-',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '003 Mercury'
    ],
    [
        [
            ['S', 'pu', '', '', '', '', '-'],
            ['-', '', 'br', '', 'br', '', 'E']
        ],
        {
            'pu': '-',
            'br': '-',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '004 Kalliope'
    ],
    [
        [
            ['', 'pu', 'pu', '', 'pu', 'E'],
            ['', 'br', 'br', '', '', '-'],
            ['S', '', '', '', '', '-']
        ],
        {
            'pu': '-',
            'br': '-',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '006 Eros'
    ],
    [
        [
            ['', '', 'pu', '', '', '-'],
            ['', 'br', 'y', 'br', 'br', 'E'],
            ['S', '', '', '', '', '-']
        ],
        {
            'pu': '-',
            'br': '-',
            'y': '|',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '007 Amalthea'
    ],
    [
        [
            ['S', 'pu', 'pu', '', '', ''],
            ['-', 'br', '', '', 'br', 'E'],
            ['-', '', 'y', 'y', '', '']
        ],
        {
            'pu': '-',
            'br': '-',
            'y': '-',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '008 Thebe'
    ],
    [
        [
            ['', '', 'pu', '', ''],
            ['-', 'br', '', 'br', ''],
            ['y', '', 'y', '', ''],
            ['S', 'gr', '', '-', 'E']
        ],
        {
            'pu': '-',
            'gr': '-',
            'br': '-',
            'y': '-',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '009 Hermippe'
    ],
    [
        [
            ['-', '-', '', '', '-'],
            ['', '', 'pu', '', '-'],
            ['', 'br', '', 'y', 'E'],
            ['S', '', 'pu', '', '-']
        ],
        {
            'pu': '|',
            'br': '|',
            'y': '|',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '011 Moose'
    ],
    [
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
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '012 Owl'
    ],
    [
        [
            ['pu', 'br', '', 'br', 'E'],
            ['', '', '', '', '-'],
            ['pu', '', '', '', '-'],
            ['S', '', '', '', '-']
        ],
        {
            'pu': '|',
            'br': '-',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '013 Bear'
    ],
    [
        [
            ['S', 'pu', 'E'],
            ['', '', 'br'],
            ['', 'pu', ''],
            ['-', '', ''],
        ],
        {
            'pu': '|',
            'br': '|',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '014 Beaver'
    ],
    [
        [
            ['pu', '', '-'],
            ['S', '', '-'],
            ['', 'br', '-'],
            ['pu', '', '-'],
            ['', 'br', 'E']
        ],
        {
            'pu': '|',
            'br': '|',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '015 Squirrel'
    ],
    [
        [
            ['', '', 'pu', '', 'pu', ''],
            ['', '', '', 'br', 'y', 'br'],
            ['S', '', '', '', 'y', 'E'],
            ['', '', '', 'br', 'y', 'br'],
            ['', '', 'gr', '', 'gr', '']
        ],
        {
            'pu': '-',
            'br': '|',
            'gr': '-',
            'y': '+',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '016 Hare'
    ],
    [
        [
            ['', 'pu', '', '-'],
            ['S', '', 'br', '-'],
            ['y', '', 'br', '-'],
            ['', 'pu', '', '-'],
            ['', '', 'br', 'E']
        ],
        {
            'pu': '|',
            'br': '|',
            'y': '|',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '017 Reindeer'
    ],
    [
        [
            ['S', 'pu', '', '', '', '-'],
            ['br', '', 'br', '', 'y', 'E'],
            ['gr', '', 'gr', '', '', '-']
        ],
        {
            'pu': '-',
            'gr': '-',
            'br': '-',
            'y': '|',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '018 Wolf'
    ],
    [
        [
            ['', '', '', '-'],
            ['', 'pu', '', '-'],
            ['S', 'br', 'y', '-'],
            ['gr', '', '', '-'],
            ['', '-', 'y', 'E']
        ],
        {
            'pu': '-',
            'gr': '|',
            'br': '|',
            'y': '|',
            '-': '/',
            '': '/',
            'S': '/',
            'E': '/'
        },
        '019 Caribou'
    ],
];

var levelid = 0;

function exportlevel() {
    var save = level[0];
    var typedict = level[1];
    var txt = '';
    for (var i = 0; i < save.length; i++) {
        for (var j = 0; j < save[0].length; j++) {
            txt = txt + save[i][j] + '#';
        }
        txt = txt.slice(0, -1) + '$';
    }
    txt = txt.slice(0, -1) + '%' + JSON.stringify(typedict) + '%' + level[2];
    document.getElementById('loader').innerText = btoa(txt);
}

function importlevel() {
    schemetics = document.getElementById('loader').value;
    var temptxt1, temptxt2 = '';
    var templist = [];
    save = [];
    typedict = {};
    try {
        templist = atob(schemetics).split('%');
        temptxt1 = templist[0];
        temptxt2 = templist[1];
        var infos = templist[2];
        templist = temptxt1.split('$');
        for (var i = 0; i < templist.length; i++) {
            save = save.concat([templist[i].split('#')]);
        }
        typedict = JSON.parse(temptxt2);
        document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + '<br>导入成功<br>关卡' + infos;
    } catch (err) {
        document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + '<br>错误：' + err.message;
    }
    level = [save, typedict];
    init();
    document.getElementById('gamezone').innerHTML = create_displayer(level);
}

function nextlevel() {
    if (levelid == levels.length) {
        levelid == 0;
    } else {
        levelid = levelid + 1;
    }
    level = levels[levelid];
    init();
    document.getElementById('gamezone').innerHTML = create_displayer(level);
}

function lastlevel() {
    if (levelid == 0) {
        levelid == levels.length;
    } else {
        levelid = levelid - 1;
    }
    level = levels[levelid];
    init();
    document.getElementById('gamezone').innerHTML = create_displayer(level);
}