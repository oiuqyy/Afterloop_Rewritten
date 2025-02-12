//Afterloop Rewritten alpha1.0, 20250204
//实现下面的按钮组的各种功能
//包括导入导出，切换到关卡选择之类的
//部分修改自levelloader.js，可确保以前的关卡字符串还可以用
//这两段代码如果看不懂看看下面的templist输出马上就懂了

function exportLevel() {  //先读取全局变量level，然后输出在文本框里
    let save = level.save;
    let typedict = level.typedict;
    let txt = '';
    for (let i = 0; i < save.length; i++) {
        for (let j = 0; j < save[0].length; j++) {
            txt = txt + save[i][j] + '#';
        }
        txt = txt.slice(0, -1) + '$';  //将最后一个#号改为$
    }
    txt = txt.slice(0, -1) + '%' + JSON.stringify(typedict) + '%' + level.name;
    $('#save_load_area')[0].value = btoa(txt);
}

function importLevel() {  //先读取文本框为level_structure，然后创建level对象并绘制
    schemetics = $('#save_load_area')[0].value;
    let temptxt1, temptxt2 = '';
    let templist = [];
    let temp_save = [];
    typedict = {};
    // try {
    templist = atob(schemetics).split('%');
    temptxt1 = templist[0];
    temptxt2 = templist[1];
    let temp_name = templist[2];  //temp_name的作用域在try代码块里，不能在外面用
    console.log(templist);
    templist = temptxt1.split('$');
    for (let i = 0; i < templist.length; i++) {
        temp_save = temp_save.concat([templist[i].split('#')]);
    }
    typedict = JSON.parse(temptxt2);
    level = new Level([temp_save, typedict, temp_name]);
    drawLevel(ctx, level);  //绘制level（在canvas_manager.js里）
    $('#level_name')[0].innerText = temp_name;  //加载默认关卡名字
    addInfo('success', '<strong>导入成功！</strong><br>关卡' + temp_name);
    // } catch (err) {
    //     addInfo('danger', '<strong>错误：</strong>' + err.message);
    // }
}

function changeLevel(level_id) {
    level = new Level(levels[level_id]);
    drawLevel(ctx, level);  //绘制level（在canvas_manager.js里）
    $('#level_name')[0].innerText = level.name;
}

function nextLevel() {
    if (level_index == levels.length - 1) {
        level_index = 0;
        changeLevel(0);
    } else {
        changeLevel(level_index + 1);
        level_index += 1;
    }
}

function retry(){
    level = new Level(levels[level_index]);
    drawLevel(ctx, level);
    $('#level_name')[0].innerText = level.name;
}