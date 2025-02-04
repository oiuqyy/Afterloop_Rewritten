//Afterloop Rewritten alpha1.0, 20250204
//用于处理右侧信息栏

$(document).ready(function () {  //本段代码添加了一个监听事件，若用户打完字，回车键被敲下，则试图eval()执行文本框里的代码
    $('#command').keydown(function (event) {
        // 检查是否按下了回车键（keyCode为13）
        if (event.keyCode === 13) {
            try {
                let command = $('#command')[0].value;
                $('#command')[0].value = '';
                eval(command);
            }
            catch (err) {
                addInfo('danger', err.message);
            }
            event.preventDefault();
        }
    });
});

function addInfo(type, content) {  //用来显示信息的函数
    //type有success, info, warning, danger, primary, secondary, light, dark，都可以用
    let txt = "<div class='alert alert-" + type + "'>" + content + "</div>";
    $('#information_adding_place').append(txt);
}

function clearInfo(){  //清除右侧信息栏
    $('#information_adding_place').empty();
}