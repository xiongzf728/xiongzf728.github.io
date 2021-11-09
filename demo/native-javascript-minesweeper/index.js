const log = console.log.bind(console)

const f = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到, 选择器 ${selector} 错误`
        log(s)
        return null
    } else {
        return element
    }
}

const closestClass = function(element, className) {
    let e = element
    while (e !== null) {
        if (e.classList.contains(className)) {
            return e
        } else {
            e = e.parentElement
        }
    }
    return null
}

const closestId = function(element, idName) {
    let e = element
    while (e !== null) {
        if (e.id === idName) {
            return e
        } else {
            e = e.parentElement
        }
    }
    return null
}

const closestTag = function(element, tagName) {
    let e = element
    while (e !== null) {
        if (e.tagName.toUpperCase() === tagName.toUpperCase()) {
            return e
        } else {
            e = e.parentElement
        }
    }
    return null
}

const closest = function(element, selector) {
    console.log(element, selector)
    let c = selector[0]
    if (c === '.') {
        // class 选择器
        let className = selector.slice(1)
        return closestClass(element, className)
    } else if (c === '#') {
        // id 选择器
        let idName = selector.slice(1)
        return closestId(element, idName)
    } else {
        let tag = selector
        return closestTag(element, tag)
    }
}

// 随机算法
const shuffle = function (length) {
    let arr = createArr(length)
    const lastIndex = length - 1;
    for (let i = 0; i < lastIndex; i++) {
        const random = Math.floor(Math.random() * (lastIndex - i + 1)) + i;
        let temp = arr[random];
        arr[random] = arr[i];
        arr[i] = temp;
    }

    return arr
}

// 生成 [0, 1, 2, ... , length - 1]
const createArr = function (length) {
    let arr = []
    for (let i = 0; i < length; i++) {
        arr.push(i)
    }
    return arr
}

// 在空地图上生成雷
const createMines = function (game) {
    let minesSquare = game.minesSquare
    let mineNumber = game.mineNumber
    let mineList = []
    let number = 0
    let size = minesSquare.length

    while (number < mineNumber) {
        let xRange = shuffle(size)
        let xIndex = Math.floor(Math.random() * size)
        let yRange = shuffle(minesSquare.length)
        let yIndex = Math.floor(Math.random() * size)

        let x = xRange[xIndex]
        let y = yRange[yIndex]
        let mine = minesSquare[x][y]

        if (mine.value !== 9) {
            mine.value = 9
            number += 1
            mineList.push(mine.id)
        }
    }

    game.mineList = mineList
    return game
}

// cell 相邻格子遍历器
const aroundTraveler = function (square, i, j, handler) {
    i = parseInt(i)
    j = parseInt(j)
    for (let a = i - 1; a <= i + 1; a++) {
        if (a < 0 || a >= square.length) {
            continue
        }
        for (let b = j - 1; b <= j + 1; b++) {
            if (b < 0 || b >= square.length) {
                continue
            }
            handler(square, a, b)
        }
    }
}

// 标记 cell 周围雷数量
const markAround = function (square, i, j) {
    // 首先判断 square[i][j] 为 9 的情况
    if (square[i][j].value === 9) {
        return 9
    }

    let result = 0

    aroundTraveler(square, i, j, function (square, a, b) {
        if (square[a][b].value === 9) {
            result += 1
        }
    })

    return result
}

// 标记雷数量
const markedSquare = function(game) {
    let minesSquare = game.minesSquare
    for (let i = 0; i < minesSquare.length; i++) {
        let line = minesSquare[i]
        for (let j = 0; j < minesSquare.length; j++) {
            line[j].value = markAround(minesSquare, i, j)
        }
    }

    return game
}

// 生成空地图
const createEmptySquare = function (size) {
    let minesSquare = []
    for (let i = 0; i < size; i++) {
        let mineLine = []
        for (let j = 0; j < size; j++) {
            let cell = {
                id: '',
                row: 0,
                col: 0,
                value: 0,
                isMine: false,
                isFlagged: false,
                isOpened: false,
            }
            cell.value = 0
            cell.row = i
            cell.col = j
            cell.id = `${i}-${j}`
            mineLine.push(cell)
        }
        minesSquare.push(mineLine)
    }
    return minesSquare
}

// 生成地图数据
const createMinesSquare = function (game) {
    let size = game.size
    // 生成空地图
    let minesSquare = createEmptySquare(size)
    game.minesSquare = minesSquare

    // 在空地图上生成雷
    createMines(game)

    // 标记雷数量
    markedSquare(game)

    return game
}

// 生成游戏数据
const createGame = function () {
    return {
        isWin: false,
        minesSquare: [],
        score: 0,
        mineNumber: 10,
        size: 10,
        mineList: [],
        flagList: [],
        flagNumber: 0,
        cellWidth: 50,
    }
}

// 计算棋盘 container 宽度
const getContainerWidth = function (size, cellWidth) {
    let cellBorderWidth = 3
    let cellBoxWidth = cellWidth + 2 * cellBorderWidth
    // width = (cellWidth + cellBorderWidth * 2 + size + cellBorderWidth) * size
    let width = cellBoxWidth * size

    return width + ''
}

// 绘制地图
const drawGrid = function (game) {
    let isFirstClick = game.isFirstClick
    let minesSquare = game.minesSquare
    if (isFirstClick) {
        let gameHtml = ''
        let width = game.cellWidth
        for (let i = 0; i < minesSquare.length; i++) {
            let rowHtml = ''
            let cellHtml = ''
            for (let j = 0; j < minesSquare[i].length; j++) {
                cellHtml +=
                    `<div class="cell" ` +
                    // `<div class="cell cell-${minesSquare[i][j].value}" ` +
                    `id="cell-${i}-${j}" ` +
                    `style="width: ${width}px; height: ${width}px; line-height: ${width}px;" ` +
                    `data-x="${i}" ` +
                    `data-y="${j}" ` +
                    `data-y="${j}" >` +
                    // `${minesSquare[i][j].value}` +
                    `</div>`
            }
            rowHtml = `<div class="row clearfix">${cellHtml}</div>`
            gameHtml += rowHtml
        }
        let container = f('.container')
        let containerWidth = getContainerWidth(game.size, game.cellWidth)
        container.style.width = containerWidth + 'px'
        container.style.height = containerWidth + 'px'
        container.insertAdjacentHTML("beforeend", gameHtml)
    } else {
        for (let i = 0; i < minesSquare.length; i++) {
            for (let j = 0; j < minesSquare[i].length; j++) {
                let cell = f(`#cell-${i}-${j}`)
                cell.classList.add(`cell-${minesSquare[i][j].value}`)
                cell.innerHTML = `${minesSquare[i][j].value}`
            }
        }
    }
}

// 翻开 cell
const openAroundCell = function (minesSquare, cellX, cellY) {
    let clickedCell = minesSquare[cellX][cellY]
    if (clickedCell.value === 0 && !clickedCell.isOpened) {
        aroundTraveler(minesSquare, cellX, cellY, function (minesSquare, x, y) {
            clickedCell.isOpened = true

            let cell = f(`#cell-${x}-${y}`)
            cell.classList.add('open')

            openAroundCell(minesSquare, x, y)

        })

    }
}

// 结束游戏
const overGame = function (game) {
    if (!game.isWin) {
        let mineList = game.mineList
        for (let mineStr of mineList) {
            let mineArr = mineStr.split('-')
            let mineX = mineArr[0]
            let mineY = mineArr[1]
            let mineDom = f(`#cell-${mineX}-${mineY}`)
            mineDom.classList.add('open')
            mineDom.innerHTML = '<span class="iconfont icon-boom"></span>'
        }
        let faceImg = f('.face-img')
        faceImg.src = './image/cry.png'
        game.isLose = true
        setTimeout(() => {
            alert(`游戏结束！`)
        }, 200)
    }
    cancelBindAllEvents()
}

// 点击 cell
const cellClicked = function (game, cellX, cellY) {
    let minesSquare = game.minesSquare
    let cell = minesSquare[cellX][cellY]
    let value = Number(cell.value)

    if (value === 9) {
        overGame(game)
    } else if (value === 0) {
        openAroundCell(minesSquare, cellX, cellY)
    }
    let cellDom = f(`#cell-${cellX}-${cellY}`)
    cellDom.classList.add('open')
}

// 检查是否游戏胜利
const checkWin = function (game) {
    let mineNumber = game.mineNumber
    let flagNumber = game.flagNumber
    if (mineNumber === flagNumber) {
        let flagList = game.flagList
        let mineList = game.mineList
        for (let i = 0; i < mineList.length; i++) {
            if (!flagList.includes(mineList[i])) {
                return false
            }
        }
        game.isWin = true
        overGame(game)
        setTimeout(() => {
            alert('游戏胜利！')
        }, 200)
    }
}

// 取消 flag
const cancleFlag = function (game, x, y) {
    let cell = game.minesSquare[x][y]
    let cellDom = f(`#cell-${x}-${y}`)

    game.flagNumber -= 1
    cell.isFlagged = false
    let index = game.flagList.indexOf(`${x}-${y}`)
    game.flagList.splice(index, 1)
    cellDom.innerHTML = cell.value + ''
    cellDom.classList.toggle('flagged')
}


// 标记 flag
const setFlag = function (game, x, y) {
    let cell = game.minesSquare[x][y]
    let cellDom = f(`#cell-${x}-${y}`)

    game.flagNumber += 1
    cell.isFlagged = true
    game.flagList.push(`${x}-${y}`)
    cellDom.innerHTML = '<span class="iconfont icon-flag"></span>'
    cellDom.classList.toggle('flagged')
}

// 自动翻开可以翻开的 cell
const autoOpen = function (game, x, y) {
    let cellDom = f(`#cell-${x}-${y}`)
    if (cellDom.classList.contains('open')) {
        let minesAroundNumber = 0
        let markedMinesArundNumber = 0
        aroundTraveler(game.minesSquare, x, y, function (square, a, b) {
            let cell = square[a][b]
            if (cell.value === 9) {
                minesAroundNumber += 1
            }
            if (cell.isFlagged) {
                markedMinesArundNumber += 1
            }
        })

        if (minesAroundNumber === markedMinesArundNumber) {
            aroundTraveler(game.minesSquare, x, y, function (square, a, b) {
                if (square[a][b].value !== 9) {
                    cellClicked(game, a, b)
                }
            })
        }
    }
}

// 取消事件绑定
const cancelBindAllEvents = function () {
    let container = f('.container')
    container.removeEventListener('click', clickEvent)
    document.oncontextmenu = function (event) {
        return false
    }
}

// 点击事件
const clickEvent = function (event) {
    let self = event.target
    let x = self.dataset.x
    let y = self.dataset.y
    let game = window.game

    let isFirstClick = game.isFirstClick
    if (isFirstClick) {
        let clickCell = game.minesSquare[x][y]
        if (clickCell.value !== 0) {
            let square = createMinesSquare(game).minesSquare
            while (square[x][y].value !== 0){
                square = createMinesSquare(game).minesSquare
            }
            game.minesSquare = square
        }
        game.isFirstClick = false
        drawGrid(game)
    }
    if (self.classList.contains('cell')) {
        if (self.classList.contains('open')) {
            autoOpen(game, x, y)
        }
        if (self.classList.contains('flagged')) {
            return true
        } else {
            cellClicked(game, x, y)
        }
    }
}

const bindAllEvents = function (game) {
    let container = f('.container')
    let face = f('.face-img')

    face.addEventListener('click', function (event) {
        // 刷新页面
        location.reload()
    })

    // 左键事件
    container.addEventListener('click', clickEvent)

    // 右键事件
    document.oncontextmenu = function(e){
        let self = e.target
        if (!self || !self.classList) {
            return false
        }
        if (self.tagName === 'SPAN') {
            // 点击的如果是 div 里面的 span
            self = closest(self, '.cell')
        }
        if (self.classList.contains('cell') && !self.classList.contains('open')) {
            let x = self.dataset.x
            let y = self.dataset.y
            let cell = game.minesSquare[x][y]

            if (cell.isFlagged) {
                cancleFlag(game, x, y)
            } else {
                setFlag(game, x, y)
            }

            checkWin(game)
        }
        // 阻止浏览器的默认弹窗行为
        return false;
    }
}

// 初始化
const init = function () {
    let game = {
        isWin: false,
        isLose: false,
        minesSquare: [],
        score: 0,
        mineNumber: 10,
        size: 9,
        mineList: [],
        flagList: [],
        flagNumber: 0,
        cellWidth: 25,
        isFirstClick: true,
    }

    let minesSquare = createMinesSquare(game).minesSquare
    game.minesSquare = minesSquare

    let minesMap = []
    for (let row of game.minesSquare) {
        let rowData = []
        for (let cell of row){
            rowData.push(cell.value)
        }
        minesMap.push(rowData)
    }
    game.minesMap = minesMap

    window.game = game
    // 绘制地图
    drawGrid(game)

    // 绑定事件
    bindAllEvents(game)
}

const __main = function () {
    init()
}

__main()