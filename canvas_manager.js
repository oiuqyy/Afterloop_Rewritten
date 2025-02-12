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
    ctx.setTransform(1, 0, 0, 1, 0, 0);  //初始化画布
    ctx.clearRect(0, 0, 1000, 500); //清空所有的内容
    //若放不进去，就让不够的那个方向撑满
    let width = level.width;
    let height = level.height;
    let save = level.save;
    if (width < 11 && height < 6) {  //画布像素是1000*500，一个方块最大是100*100，若方块最大都可以放进去，那就100*100；
        ctx.translate(ctx_width / 2 - 50 * width, ctx_height / 2 - 50 * height);
        ctx.scale(100, 100);  //将画布1单位设定为一个方块边长的大小
        // addInfo('success', String(ctx_width / 2 - 50 * width) + ' ' + String(ctx_height / 2 - 50 * height));
    } else {
        let ctx_scale = Math.min(ctx_width / width, ctx_height / height);
        ctx.translate((ctx_width - ctx_scale * width) / 2, (ctx_height - ctx_scale * height) / 2);
        // addInfo('success', String(ctx_width - ctx_scale * width)/2 + ' ' + String(ctx_height - ctx_scale * height)/2);
        ctx.scale(ctx_scale, ctx_scale);
    }
    for (let i = 0; i < save.length; i++) {
        for (let j = 0; j < save[0].length; j++) {
            drawSingleBlock(ctx, j, i, save[i][j], level.blocknamedict);
        }
    }
    if ('starLocs' in level) {
        for (let i = 0; i < level.starLocs.length; i++) {
            let x = level.starLocs[i][1];  //注意这里要反过来
            let y = level.starLocs[i][0];
            drawFloatItem(ctx, x, y, 'star');
        }
    }
    if ('beaconReceiverLocs' in level) {
        for (let i = 0; i < level.beaconReceiverLocs.length; i++) {
            let x = level.beaconReceiverLocs[i][1];  //注意这里要反过来
            let y = level.beaconReceiverLocs[i][0];
            drawFloatItem(ctx, x, y, 'beaconReceiver');
        }
    }
    let endx = level.end[1];  //注意这里要反过来
    let endy = level.end[0];
    drawFloatItem(ctx, endx, endy, 'end');
    // addInfo('success', '应该是成功画画了');
}
function drawSingleBlock(ctx, x, y, type, blocknamedict) {
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
    if (type[0] == 'B' && type !== 'B-') {
        //信标画法
        ctx.fillStyle = '#0040FF';  //一种蓝色
        ctx.fillRect(x, y, 1, 1);
        ctx.fillStyle = '#002DB3';  //这种蓝色的深色
        ctx.arc(x + 0.5, y + 0.5, 0.4, 0, 2 * Math.PI);
        ctx.fill();  //填充圆弧
        ctx.beginPath();
        ctx.fillStyle = '#CEF6EC';  //类似白色
        ctx.arc(x + 0.5, y + 0.5, 0.25, 0, 2 * Math.PI);
        ctx.fill();
    } else if (type == 'B-') {
        //信标屏障画法
        ctx.fillStyle = '#002DB3';  //一种深蓝色
        ctx.fillRect(x, y, 1, 1);
        ctx.fillStyle = '#0040FF';  //浅蓝色
        ctx.fillRect(x, y + 0.2, 1, 0.1);
        ctx.fillRect(x, y + 0.7, 1, 0.1);
        ctx.fillRect(x + 0.2, y, 0.1, 1);
        ctx.fillRect(x + 0.7, y, 0.1, 1);
    } else if (type == '') {
        //空气画法
        ctx.fillStyle = color[''];
        ctx.fillRect(x, y, 1, 1);
    } else if (type == 'S') {
        //玩家画法
        ctx.fillStyle = color['S'];
        ctx.fillRect(x, y, 1, 1);
        ctx.fillStyle = color[''];
        ctx.fillRect(x + 0.2, y + 0.3, 0.2, 0.2);
        ctx.fillRect(x + 0.6, y + 0.3, 0.2, 0.2);
        ctx.fillRect(x + 0.2, y + 0.65, 0.6, 0.15);
    } else {
        //正常方块画法
        let color1 = color[type];
        let color2 = darkenColor(color1, 0.3);  //加深30%
        let blocktype = blocknamedict[type].blocktype;
        // addInfo('success', String(x) + String(y) + color1 + color2 + blocktype);
        ctx.fillStyle = color1;  //设置颜色
        ctx.fillRect(x, y, 1, 1);
        ctx.fillStyle = color2;
        if (type !== '' && ! 'S-'.includes(type)) {
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
}
function drawFloatItem(ctx, x, y, type) {  //画悬浮的东西
    //type有BeaconReceiver, end, star
    ctx.save();  //s先保存
    if (type == 'beaconReceiver') {
        //信标底座画法
        ctx.globalAlpha = 0.6;  //透明度
        ctx.translate(x + 0.5, y + 0.5);
        ctx.fillStyle = '#00DDDD';
        ctx.beginPath();
        ctx.arc(0, 0, 0.4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, -0.1);
            ctx.lineTo(-0.3, -0.4);
            ctx.lineTo(0.3, -0.4);
            ctx.closePath();
            ctx.fill()
            ctx.rotate(Math.PI / 2);
        }
    } else if (type == 'star') {
        //星星画法，由百度AI提供
        function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
            var rot = Math.PI / 2 * 3;
            var x = cx;
            var y = cy;
            var step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.lineWidth = 0.05;
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
        ctx.globalAlpha = 0.4;
        drawStar(x + 0.5, y + 0.5, 5, 0.4, 0.2);
    } else if (type == 'end') {
        //出口画法
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#DD00DD';
        ctx.setLineDash([0.15, 0.15]);
        ctx.lineWidth = 0.1;
        ctx.strokeRect(x, y, 1, 1);
    }
    ctx.restore();
}