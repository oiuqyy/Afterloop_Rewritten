//Afterloop Rewritten alpha1.0, 20250204
//对标display.js和levelloader.js
const color = {  //这里color设定为了常量，之后若要增加颜色需要修改代码
    '': '#ffffff',  //white
    '-': '#000000',  //black
    'S': '#008000',  //green
    'E': '#808080',  //grey
    'bl': '#0000ff',  //blue
    'y': '#ffff00',  //yellow
    'br': '#a52a2a',  //brown
    'pu': '#800080',  //purple
    'pi': '#ffc0cb',  //pink
    'gr': '#90ee90',  //lightgreen
    'yg': '#9acd32',  //yellowgreen
    'lb': '#add8e6',  //lightblue
};


function drawLevel(ctx, level) {
    //若放不进去，就让不够的那个方向撑满
    let width = level.width;
    let height = level.height;
    let save = level.save;
    let typedict = level.typedict;
    if (width < 11 && height < 6) {  //画布像素是1000*500，一个方块最大是100*100，若方块最大都可以放进去，那就100*100；
        ctx.translate(ctx_width / 2 - 50 * width, ctx_height / 2 - 50 * height);
        ctx.scale(100, 100);  //将画布1单位设定为一个方块边长的大小
        // addInfo('success', String(ctx_width / 2 - 50 * width) + ' ' + String(ctx_height / 2 - 50 * height));
    } else {
        let ctx_scale = Math.min(ctx_width/width,ctx_height/height);
        ctx.translate((ctx_width - ctx_scale * width)/2, (ctx_height - ctx_scale * height)/2);
        addInfo('success', String(ctx_width - ctx_scale * width)/2 + ' ' + String(ctx_height - ctx_scale * height)/2);
        ctx.scale(ctx_scale, ctx_scale);
    }
    for (let i = 0; i < save.length; i++) {
        for (let j = 0; j < save[0].length; j++) {
            drawSingleBlock(ctx, j, i, typedict, save[i][j]);
        }
    }
    // addInfo('success', '应该是成功画画了');
}
function drawSingleBlock(ctx, x, y, typedict, type) {
    //此处xy都可以不是整数，为之后做动画作铺垫
    function darkenColor(color, percentage) { //来自百度AI，用于将颜色加深
        // 将颜色从十六进制转换为RGB
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);

        // 加深颜色
        r = Math.min(255, Math.round(r * (1 - percentage)));
        g = Math.min(255, Math.round(g * (1 - percentage)));
        b = Math.min(255, Math.round(b * (1 - percentage)));

        // 将RGB值转换回十六进制格式
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    let color1 = color[type];
    let color2 = darkenColor(color1, 0.3);  //加深30%
    let blocktype = typedict[type];
    // addInfo('success', String(x) + String(y) + color1 + color2 + blocktype);
    ctx.fillStyle = color1;  //设置颜色
    ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = color2;
    if (type != '' && ! 'SE-'.includes(type)) {
        ctx.fillRect(x + 0.1, y + 0.1, 0.8, 0.8);
        ctx.fillStyle = color1;
        ctx.fillRect(x + 0.15, y + 0.15, 0.7, 0.7);
        ctx.fillStyle = color2;
    }
    if (blocktype == '+' || blocktype == '|') {
        ctx.fillRect(x + 0.45, y + 0.2, 0.1, 0.6);
    }
    if (blocktype == '-' || blocktype == '+') {
        ctx.fillRect(x + 0.2, y + 0.45, 0.6, 0.1);
    }
}