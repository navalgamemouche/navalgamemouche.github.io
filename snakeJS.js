const canvas = document.getElementById("SnakeCanvas");
const ctx = canvas.getContext("2d");
//---------------------<Paramètre-et-constante>-----------------------------
const DIR_UP=1;
const DIR_DOWN=2;
const DIR_LEFT=3;
const DIR_RIGHT=4;
const SNAKE_SECTION_SIZE=43;
const SNAKE_POS_INIT_X= 7;
const SNAKE_POS_INIT_Y= 5;
const SNAKE_POS_MIN_X=0;
const SNAKE_POS_MAX_X=(860/SNAKE_SECTION_SIZE)-1;
const SNAKE_POS_MIN_Y=0;
const SNAKE_POS_MAX_Y=(688/SNAKE_SECTION_SIZE)-1;
const SNAKE_INIT_LENGHT=5;
//---------------------</Paramètre-et-constante>-----------------------------

//---------------------<Initialisation-du-score-et-des-images>---------------
let score=0;
let bestScore=0
let imgSnake= new Image()
let imgMouche= new Image()
imgSnake.src="./img/snakeSnake.png"
imgMouche.src="./img/snakeFly.png"
//---------------------</Initialisation-du-score-et-des-images>--------------

let snake= new Snake();                                 //Initialisation du Serpent
let fly={PosX:3,PosY:3}                                 //Initialisation de la mouche 
let IdInterval=setInterval(refresh,80);                 //Permet de lancer la fonction refresh toutes les 80 ms

function drawFly(PosX,PosY){
    ctx.drawImage(imgMouche, 0, 0,512,512,PosX*SNAKE_SECTION_SIZE,PosY*SNAKE_SECTION_SIZE,SNAKE_SECTION_SIZE,SNAKE_SECTION_SIZE);
}

function refresh(){
    snake.eat(fly);                                     
    snake.move();
    if(snake.isDead()){
        clearInterval(IdInterval);                      //Permet d'arrêter de lancer la fonction refresh
        ctx.font = 'bold 20px Verdana, Arial, serif';
        ctx.fillText("Vous avez perdu",335,330);
        ctx.fillText("Appuyer sur R pour relancer une partie",210,370);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);   //Efface le serpent et la mouche du canvas
    drawFly(fly.PosX,fly.PosY)
    snake.draw();
    
}

window.addEventListener("keydown", function (event) {   //Fonction lancé quand une touche est enfoncée 
    //Test sur la touche pressé et si le déplacement conduit à une morsure 
    if (event.key==="ArrowUp"&&snake.Head.Next.PosY!=snake.Head.PosY-1){
        snake.Head.Direction=DIR_UP;
    } 
    else if (event.key==="ArrowDown"&&snake.Head.Next.PosY!=snake.Head.PosY+1) {
        snake.Head.Direction=DIR_DOWN;
    } 
    else if (event.key==="ArrowLeft"&&snake.Head.Next.PosX!=snake.Head.PosX-1) {
        snake.Head.Direction=DIR_LEFT;
    } 
    else if (event.key==="ArrowRight"&&snake.Head.Next.PosX!=snake.Head.PosX+1) {
        snake.Head.Direction=DIR_RIGHT;
    }
    //Condition pour relancer une partie 
    else if (event.key=="r"&&snake.isDead()){
        snake.destructor();
        snake=new Snake();
        score=0;
        document.getElementById("score").textContent=score;
        IdInterval=setInterval(refresh,80);
    }
});