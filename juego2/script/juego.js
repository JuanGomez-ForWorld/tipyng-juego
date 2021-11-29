'use stric'
const canvas = document.querySelector(".juego")
const ctx = canvas.getContext("2d")

// const 

const alphabet = 
["A","B","C","D","E","F","G","H","I","J","K","L","M",
"N","O","P","Q","R","S","T","U","V","W","X","Y","Z",]


// arrow fanction
let numbar = [0, 0]
const lettersAlphabet = (p) => {
    let num = 0
    alphabet.map( x => {
        if(letters[p].l == x ) {
            numbar[p] = num
        }
        num++
    })
}

const imagenes = (url, x, y, w, h) =>{
    let img = new Image()
    img.src = url
    ctx.drawImage(img, x, y, w, h)
}

const random = (min,max) => (Math.floor(Math.random()*(max - min)) + min);

const place = (l) => { 
    if (l == "q" || l == "a" || l == "z") {return 20}
    if (l == "w" || l == "s" || l == "x") {return 110}
    if (l == "e" || l == "d" || l == "c") {return 210}
    if (l == "r" || l == "f" || l == "v") {return 310}
    if (l == "t" || l == "g" || l == "b") {return 310}
    if (l == "y" || l == "h" || l == "n") {return 410}
    if (l == "u" || l == "j" || l == "m") {return 410}
    if (l == "i" || l == "k") {return 510}
    if (l == "o" || l == "l" ) {return 610}
    if (l == "p" || l == "ñ" ) {return 710}
    else{return 810}
}

// create new letters 

const createLetter = (Id, posX, letter) => {
    letters.push({ 
        id: Id, 
        l: letter.toUpperCase(),
        x: posX,
        y: -70,
        w: 70,
        h: 70,
    })
}

const letters = []

function newWord(dato) {
    const array = dato.split("")
    let numberId = letters.length 

    array.map( x => {
        createLetter(numberId, place(x),  x)
        numberId++
    })
}

function clearLetter(cls){
    letters.splice(cls, 1)

    let numberId = 0 
    letters.map(x => {
        x.id = numberId
        numberId++
    })
}

// draw the letters in canvas

function drawInCanvas() {
    const write = (x) => {
        ctx.fillStyle = "#fff"
        ctx.font="bold italic 40px arial";
        ctx.fillText(x.l, x.x+20, x.y+50, x.w-10, x.h-10)
    } 

    letters.map(x => {
        ctx.fillStyle = "#777"
        ctx.fillRect(x.x, x.y, x.w, x.h)
        write(x)
    })
}

function drawFinish() {
    const posX = [20, 110, 210, 310, 410, 510, 610, 710]
    const pos = []
   
    posX.map( x => {
        ctx.fillStyle = "#fff"
        ctx.fillRect(x, 820, 70, 120)
        imagenes("script/img/piano.png", x-10, 820, 90, 110)
        pos.push({x: x, y: 840, w: 70, h: 100})
    })

    return pos
}

// all the ecenes of game 
let lac = "count"
function eceneOfTheGmae() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    imagenes("script/img/fondo.png", 0, 0, canvas.width, canvas.height)
     
    drawFinish()
    drawInCanvas()

    // movement of the letters in the window of game
    letters.map( x => {
        if (x.id == 0) { x.y += 4 }
        if (x.id !== 0 && x.y + x.h <= letters[x.id-1].y - 80 ) {
            x.y += 4
        }     
    })

    // add plus word
    if (lac !== "") { newWord(lac);  lac = "" }

    if (letters.length <= 20) {
        lac = verbIregulares[random(0, verbIregulares.length-1)]
        drowCounter2 = 0   
    }

    // remove tha letter 
    letters[0].y >= canvas.height ? clearLetter(0) : false
    
}



function eceneOfStart() {
    imagenes("script/img/fondo.png", 5, 5, canvas.width-10, canvas.height-10)
    

    function draw() {
        const tipyng = ["T","I","P","Y","N","G"]
        let lugar = 170
        const write = (x) => {
            ctx.fillStyle = "#fff"
            ctx.font="bold italic 40px arial";
            ctx.fillText(x, lugar+20, 100+50, 80-10, 80-10)
        } 
    
        tipyng.map(x => {
            ctx.fillStyle = "#777"
            ctx.fillRect(lugar, 100, 70, 70)
            write(x)
            lugar += 75
        })
    }
    draw()

    ctx.fillStyle = "#fff"
    ctx.font="bold italic 80px arial";
    ctx.fillText("PLAY", 300, 800, 200, 200)

}
// update the canvas

let lastTime = 0,
    drowCounter = 0,
    drowInterval = 1000,
    playTipyng = false

function update(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time


    if (!playTipyng) {
        drowCounter += deltaTime;
        if (drowCounter >= drowInterval / 30) {
            eceneOfStart()
            drowCounter = 0
        }
    } else {
        drowCounter += deltaTime;
        if (drowCounter >= drowInterval / 30) {
            eceneOfTheGmae()
            drowCounter = 0
        }
    }
    

    requestAnimationFrame(update)
}

// collider 

function collider(n) {
    const posF = drawFinish()

    if (letters[n].y >= posF[0].y-20 && letters[n].y + letters[n].h <= posF[0].y + posF[0].h) {
          return true  
    }
    return false
}

// events and interaction of the player

document.addEventListener("keydown", eventKeyboard)

function eventKeyboard(e) {

    // console.log(e.keyCode);
    if (e.keyCode && playTipyng == true) {
        lettersAlphabet(0)
        lettersAlphabet(1)
        lettersAlphabet(2)
        
        if( collider(0) && e.keyCode-65 == numbar[0]) {
            clearLetter(0)
            point()
        }; 
        if( collider(1) && e.keyCode-65 == numbar[1]) {
            clearLetter(1)
            point()
        };  
    }

    if (e.keyCode === 13) {
        playTipyng = true
        setInterval(time, 1000)
    }
    
}

// point and time
let countPoint = 0
function point() {
    const point = document.querySelector(".point span")
    countPoint++
    point.innerHTML = countPoint
}

let countTime = [0, 0]
function time() {
    const time = document.querySelector(".time span")
    if( countTime[1] == 60 ) {
        countTime[0]++ 
        countTime[1] = 0
    }
    time.innerHTML = countTime[0] + ":" + countTime[1]
    countTime[1]++
    
}
// start
update()