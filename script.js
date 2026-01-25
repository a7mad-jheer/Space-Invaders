let boxSize = 30;
let cols = 20;
let rows = 20;

//board :
let board;
let boardWidth = boxSize * cols;
let boardHeight = boxSize * rows;
let context;

//Ship :
let shipWidth = boxSize*2;
let shipHeight = boxSize;
let shipX = boardWidth/2 - boxSize;
let shipY = boardHeight - boxSize*2;
let shipImage;

let ship = {
    x : shipX ,
    y : shipY ,
    width : shipWidth ,
    height : shipHeight
}

//ship Physics :
let shipVelocityX = boxSize;

//eniemes :
let eniemesArray = [];
let eniemesWidth = boxSize*2;
let eniemesHeight = boxSize;
let eniemesImage;

//eniemes Physics :
let eniemesCols = 3;
let eniemesRows = 2;
let eniemesVelocityX = 1;
let eniemesCount;

//shoots :
let shootsArray = [];
let shootsVelocityY = -10;


window.onload = function () {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height =boardHeight;

    context = board.getContext('2d');

    //ship :
    shipImage = new Image ();
    shipImage.src = './image/banzer.png';

    shipImage.onload = function () {
        context.drawImage(shipImage , ship.x , ship.y , ship.width , ship.height)
    }

    //Eniemes :
    eniemesImage = new Image ();
    eniemesImage.src = './image/Enime.png';
    createEniemes()

    //shoots :



    requestAnimationFrame(update);
    document.addEventListener('keyup' , createShoots);
    document.addEventListener('keydown' , shipMove)
}

function update() {
    requestAnimationFrame(update);

    //clear All Of The Canvas :
    context.clearRect(0 , 0 , boardWidth , boardHeight);

    //Ship :
    context.drawImage(shipImage , ship.x , ship.y , ship.width , ship.height)

    //Eniemes :
    for (let i = 0 ; i < eniemesArray.length ; i++){
        let eniemes = eniemesArray[i];

        if(eniemes.alive) {
        eniemes.x += eniemesVelocityX;

        if (eniemes.x + eniemes.width >= boardWidth || eniemes.x <= 0){
            eniemesVelocityX *= -1;
            eniemes.x += eniemesVelocityX*2;

            for(let j = 0 ; j < eniemesArray.length ; j++){
                eniemesArray[j].y += eniemesHeight;
            }
        }

        context.drawImage(eniemesImage , eniemes.x , eniemes.y , eniemes.width , eniemes.height);
    }
}

    //Shoots :
    for(let i = 0 ; i < shootsArray.length ; i++ ){
        let shoots = shootsArray[i];
        shoots.y += shootsVelocityY;
        context.fillStyle = 'white';
        context.fillRect(shoots.x , shoots.y , shoots.width , shoots.height);

        for(let j = 0 ; j < eniemesArray.length ; j++){
            let eniemes = eniemesArray[j];
            if(!shoots.used && eniemes.alive && detectCollision(shoots , eniemes)){
                shoots.used = true;
                eniemes.alive = false;
                eniemesCount --;
            }
        }
    }

    // clear shootsArray
    while(shootsArray.length > 0 && (shootsArray[0].y < 0 || shootsArray[0].used) ) {
        shootsArray.shift();
    }

    //new Level :
    if (eniemesCount == 0){
        eniemesCols = Math.min(eniemesCols +1 , cols/2 -2);
        eniemesRows = Math.min(eniemesRows +1 , rows -4);
        eniemesVelocityX += .2;
        eniemesArray = [];
        shootsArray = [];
        createEniemes()
    }

}

function shipMove (e) {
    if (e.code == 'ArrowRight' && ship.x + ship.width + shipVelocityX <= boardWidth) {
        ship.x += shipVelocityX;
    }
    else if (e.code == 'ArrowLeft' && ship.x - shipVelocityX >= 0){
        ship.x -= shipVelocityX;
    }
}

function createEniemes(){
    for(c = 0 ; c < eniemesCols ; c++){
        for(r = 0 ; r < eniemesRows ; r++){
            let eniemes = {
                x : boxSize + c*eniemesWidth ,
                y : boxSize + r*boxSize ,
                width : eniemesWidth , 
                height : eniemesHeight ,
                alive : true
            }
            eniemesArray.push (eniemes);
            
        }
    }
    eniemesCount = eniemesArray.length;
}

function createShoots(e) {
    if (e.code == 'Space') {
        let shoots = {
            x : ship.x + shipWidth *15/32 ,
            y : ship.y ,
            width : boxSize/8 ,
            height : boxSize/2 ,
            used : false
        }
        shootsArray.push(shoots);
    }
}

function detectCollision (a , b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
}