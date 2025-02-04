function create_displayer(level) {
    var txt = '';
    var bigsave = level[0];
    var typedict = level[1];
    for (i = 0; i < bigsave.length; i++) {
        txt = txt + "<div id='hang" + String(i) + "' style='width:" + String(width) + "00px;'>";
        for (j = 0; j < bigsave[0].length; j++) {
            txt = txt + "<div id='" + String(i) + '_' + String(j) + "' class='ablock' style='background-color:" + color[bigsave[i][j]] + ";'>";
            if (typedict[bigsave[i][j]] == '-') {
                txt = txt + "<div class='sign-'></div>";
            } else if (typedict[bigsave[i][j]] == '|') {
                txt = txt + "<div class='sign1'></div>";
            } else if (typedict[bigsave[i][j]] == '+') {
                txt = txt + "<div class='sign-'></div><div class='sign1'></div>";
            }
            txt = txt + "</div>";
        }
        txt = txt + '</div>';
    }
    return txt;
}