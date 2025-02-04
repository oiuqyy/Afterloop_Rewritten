'''
AfterloopSimulator
beta1.0

Author: oiuqyy
'''
import turtle
import time
#air='', wall='-'. start='S', end='E'
save = [
    ['','','','','','-','bl','','','',''],
    ['','y','pu','','pu','-','','','pu','S',''],
    ['','','br','y','','-','bl','','','br','pu'],
    ['','','','pi','br','pi','','pi','pi','pi','pi'],
    ['','','','','','-','','y','','','E']
    ]


#save = [['','','','','','-','bl','','','','S']['','y','pu','','pu','-','','','pu','','']['','','br','y','','-','bl','','','br','pu']['','','','pi','br','pi','','pi','pi','pi','pi']['','','','','','-','','y','','','E']]
def first_skim(save):
    blocknames = []
    for i in range(len(save)):
        for j in range(len(save[0])):
            item = save[i][j]
            if not item in blocknames:
                if not (item == 'S' or item == 'E'):
                    blocknames.append(item)
                elif item == 'S':
                    start = [i, j]
                elif item == 'E':
                    end = [i, j]
    if '-' in blocknames:
        blocknames.remove('-')
    if '' in blocknames:
        blocknames.remove('')
    return blocknames, start, end, len(save), len(save[0])
def second_classify(save, blocknames):
    locss = []
    for blockname in blocknames:
        locs = []
        for i in range(len(save)):
            for j in range(len(save[0])):
                item = save[i][j]
                if item == blockname:
                    locs.append((i, j))
        locss.append(locs)
    return tuple(locss)
def getnei(loc, direction):
    i, j=tuple(loc)
    global save
    global height
    global width
    if direction == 1:
        neiloc = [i-1, j]
    elif direction == 2:
        neiloc = [i+1, j]
    elif direction == 3:
        neiloc = [i, j-1]
    elif direction == 4:
        neiloc = [i, j+1]
    else:
        print("AttributeError: given direction '{}' not found".format(direction))
    if neiloc[0] >= height or neiloc[0] == -1 or neiloc[1] >= width or neiloc[1] == -1:
        return '-'
    else:
        i, j = neiloc
        nei = save[i][j]
        if nei in ('', 'S', 'E'):
            return ''
        elif nei == '-':
            return '-'
        else:
            global blocks
            for block in blocks:
                if block.name == nei:
                    return block
                    #break
    
#1=up, 2=down, 3=left, 4=right

class block:
    name = ''
    locs = []#同时存储一个块的位置和方向
    def __init__(self, name, locs):
        self.name = name
        self.locs = locs
    def can_move(self, direction, together=()):
        flag = True
        for loc in self.locs:
            nei = getnei(loc, direction)
            if nei == '-':
                flag = False
            elif nei in blocks:
                if nei in together:
                    flag = True
                    break
                elif not nei.can_move(direction, together=tuple(list(together)+[nei])):
                    flag = False
        return flag
    def getmovelist(self, direction, ret, together=()):
        global templist
        for loc in self.locs:
            templist.append(self.name)
            nei = getnei(loc, direction)
            if nei in together:
                break
            elif nei in blocks:
                nei.getmovelist(direction, together=tuple(list(together)+[nei]), ret=False)
        if ret == True:
            return templist
def initstage(save, height, width, init=False):
    turtle.clear()
    if init:
        turtle.setup(400, 400)
        turtle.screensize(650, 650)
        turtle.speed(0)
        turtle.colormode(255)
        turtle.setworldcoordinates(-max(height, width)/2, max(height, width)/2, max(height, width)/2, -max(height, width)/2)
    #turtle.setworldcoordinates(0, height, width, 0)
    s2 = bigger(save)
    turtle.speed(0)
    global color
    for i in range(len(s2)):
        for j in range(len(s2[0])):
            turtle.penup()
            turtle.setpos(j - len(s2[0])/2, i - len(s2)/2)
            if s2[i][j] in blocknames or s2[i][j] == '-':
                turtle.color(color[s2[i][j]])
                turtle.dot(20)
            elif s2[i][j] == 'S':
                turtle.color('black')
                turtle.dot(30)
            elif s2[i][j] == 'E':
                turtle.color('red')
                turtle.dot(30)
            elif not s2[i][j] == '':
                print("AttributeError: given color '{}' not found".format(s2[i][j]))

def bigger(save, element='-'):
    height, width = len(save), len(save[0])
    s2 = [['-']*(2 + width)]
    for i in save:
        s2.append(['-']+i+['-'])
    s2.append(s2[0])
    return s2


def move(save, block, direction):
    li = blocks[blocknames.index(block)].getmovelist(direction, ret=True) + ['S']
    movemap = []
    for i in range(len(save)):
        temp = []
        for j in range(len(save[0])):
            if save[i][j] in li:
                temp.append(save[i][j])
                save[i][j] = ''
            else:
                temp.append('UND')
        movemap.append(temp)
    for i in range(len(movemap)):
        for j in range(len(movemap[0])):
            if movemap[i][j] != 'UND':
                if direction == 1:
                    save[i-1][j] = movemap[i][j]
                elif direction == 2:
                    save[i+1][j] = movemap[i][j]
                elif direction == 3:
                    save[i][j-1] = movemap[i][j]
                elif direction == 4:
                    save[i][j+1] = movemap[i][j]
    return save

def moveplayer(save, direction):
    global start
    i, j = start
    save[i][j] = ''
    if direction == 1:
        save[i-1][j] = 'S'
        start = (i-1, j)
    elif direction == 2:
        save[i+1][j] = 'S'
        start = (i+1, j)
    elif direction == 3:
        save[i][j-1] = 'S'
        start = (i, j-1)
    elif direction == 4:
        save[i][j+1] = 'S'
        start = (i, j+1)
    return save

def oneplayer(save, start):
    s3 = []
    for i in range(len(save)):
        temp = []
        for j in range(len(save[0])):
            if save[i][j] == 'S' and tuple(start) != (i, j):
                temp.append('')
            else:
                temp.append(save[i][j])
        s3.append(temp)
    return s3
templist = []
color = {'-':(0, 0, 0), 'bl':(105, 250, 250), 'y':(250, 250, 45), 'br':(230, 100, 60), 'pu':(220, 60, 255), 'pi':(225, 135, 225)}
blocks = []#存储所有block类，以name和class为一对存储
blocknames, start, end, height, width = first_skim(save)
locss = second_classify(save, blocknames)
for i in range(len(blocknames)):
    blocks.append(block(blocknames[i], locss[i]))
initstage(save, height, width, True)
print('1=up, 2=down, 3=left, 4=right')
print('---------------------------------')
while not (start[0] == end[0] and start[1] == end[1]):
    save = oneplayer(save, start)
    op = input('To which direction do you wanna go?')
    if op == 'r':
        initstage(save, height, width)
    elif op == 'cheat':
        break
    elif not op in ['1', '2', '3', '4']:
        print('Error!!!')
    elif getnei(start, int(op)) == '':
        save = moveplayer(save, int(op))
        initstage(save, height, width)
    elif getnei(start, int(op)) == '-':
        print('You cant do this!!!Blocked!!!')
    elif getnei(start, int(op)).can_move(int(op)) == False:
        print('You cant do this!!!Blocked!!!')
    else:
        save = move(save, getnei(start, int(op)).name, int(op))
        initstage(save, height, width)
print('youwin!')
