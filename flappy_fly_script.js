let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");
cvs.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto";
//load image
let fly = new Image();
let fg = new Image();
let bg = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();




fly.src = "images/fly.png";
fg.src = "images/fg.png";
bg.src = "images/bg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// qq var
constante = pipeNorth.height + 100;
let flyX = 10;
let flyY = 150;
let gravity = 1.5;
let score = 0;
let distance = 120;
let vitesse = 1;
let j = 0; // debut du tableau (sorte de suppression des pipe qui sorte de l'image)

// click
document.addEventListener("keydown",moveUp);
function moveUp(){
    gravity -= 10;
}
// pipe coord

let pipe = [];
pipe[0] = {
    x : cvs.width,
    y : 0,
    counted : 0,
    speed : vitesse,
    dist : 120
}

//draw
function draw(){
    ctx.drawImage(bg,0,0);
    for(let i =j; i < pipe.length; i++){
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y + constante);
        pipe[i].x -= pipe[i].speed;
        if(Math.floor(pipe[i].x) == pipe[i].dist){ //Spawn d'autre pipe 
            if(vitesse < 4){
            vitesse = (1 + score/20); 
            }
            distance = 288;
            while(distance >= 120){
                distance -= vitesse;
            }
            distance = Math.floor(distance);
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height) - pipeNorth.height,
                counted : 0,
                speed : vitesse,
                dist : distance
            });
        }  

        // colision

        if( flyX + fly.width >= pipe[i].x && flyX <= pipe[i].x + pipeNorth.width
            && (flyY <= pipe[i].y + pipeNorth.height || flyY +fly.height >= pipe[i].y + constante)
            || flyY + fly.height >= cvs.height-fg.height){
            location.reload();
        }
        if(Math.floor(pipe[i].x) <= flyX - fly.width && pipe[i].counted == 0){
            pipe[i].counted = 1;
            score++;
    
        }
        if(pipe[i].x < 0 - pipeNorth.width){//arrete l'actualisation de la variable et change pour ne plus la regarder (j) 
            j++;
        }
    }
    ctx.drawImage(fg,0,cvs.height-fg.height);
    ctx.drawImage(fly,flyX,flyY);
    flyY += gravity;
    gravity += 0.05;
    if(gravity < 1.5){
        gravity += 1;
    }
    if(gravity >2 && gravity < 2.5){
        gravity += 0.7;
    }


    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("grav : "+vitesse,20,480);
    ctx.fillText("Score : "+score,10,20);

    setTimeout(() =>{
        requestAnimationFrame(draw);
    },1)
}

draw();
