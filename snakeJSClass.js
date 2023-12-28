//---------------------<Déclaration-et-implémentation-classe-section>--------
class Section{  //Liste doublement Chainées
    //------<Attributs>------
    Prev;           //Section précedente (NULL si c'est la première)
    Next;           //Section element (NULL si c'est la dernière)
    Direction;      //int(utilisation des 4 constantes de directions) 
    PosX;           //Position en x de la section sur la grille 
    PosY;           //Position en y de la section sur la grille
    //------</Attributs>------

    //------<Méthodes>------
    constructor(Prev,Next,Direction,PosX,PosY){
        if(Prev)Prev.Next=this;
        if(Next)Next.Prev=this;
        this.Prev=Prev;
        this.Next=Next;
        this.PosX=PosX;
        this.PosY=PosY;
        this.Direction=Direction;
    }
    destructor(){
        if(this.Prev){
            if(this.Next){
                this.Prev.Next=this.Next;
                this.Next.Prev=this.Prev;
            }
            else{
                this.Prev.Next=null;
            }
        }
        else if(this.Next){
            this.Next.Prev=null;
        }

    }
    isOnCell(x,y){
        return x==this.PosX&&y==this.PosY;
    }
    //------</Méthodes>------
}
//---------------------</Déclaration-et-implémentation-classe-section>-------


//---------------------</Déclaration-et-implémentation-classe-snake>---------
class Snake{
    //------<Attributs>------
    Head;           //Première section 
    Tail;           //Dernière section
    nbSection;      //Nombre de section
    //------</Attributs>------

    //------<Méthodes>------
    constructor(){
        this.Head=new Section(null,null,DIR_RIGHT,SNAKE_POS_INIT_X,SNAKE_POS_INIT_Y);
        this.Tail=this.Head;
        this.nbSection=1;
        let k=1;
        while(this.nbSection!=SNAKE_INIT_LENGHT){
            this.Tail=new Section(this.Tail,null,DIR_RIGHT,SNAKE_POS_INIT_X-k,SNAKE_POS_INIT_Y);
            this.nbSection++;
            k++;
        }
    }
    destructor(){
        let scan=this.Tail;
        while(this.Tail){
            this.Tail=scan.Prev;
            scan.destructor();
            scan=this.Tail;
            this.nbSection--;
        }
    }
    move(){
        let scan=this.Head
        while(scan){                //Déplacement de chaque section en fonction de leur direction
            switch(scan.Direction){
                case DIR_UP:
                    scan.PosY--;
                    break;
                case DIR_DOWN:
                    scan.PosY++;
                    break;
                case DIR_LEFT:
                    scan.PosX--;
                    break;
                case DIR_RIGHT:
                    scan.PosX++;
                    break;
                default:
            }
            scan=scan.Next;
        }
        scan=this.Tail;
        while(scan && scan.Prev){   //Chaque section prend la direction de la précédente
            scan.Direction=scan.Prev.Direction
            scan=scan.Prev
        }
        
    }
    draw(){
        let scan=this.Head
        let imgPosX=0;             //Position en x de la partie de l'image à afficher  
        let imgPosY=0;             //Position en y de la partie de l'image à afficher  
        //------------------Affichage-de-la-tête------------------
        switch(scan.Direction){ //Choix de la partie à afficher en fonction de la direction de la tête
            case DIR_UP:
                imgPosX=3;
                imgPosY=0;
                break;
            case DIR_DOWN:
                imgPosX=4;
                imgPosY=1;
                break;
            case DIR_LEFT:
                imgPosX=3;
                imgPosY=1;         
                break;
            case DIR_RIGHT:
                imgPosX=4;
                imgPosY=0;
                break;
            default:
        }
        ctx.drawImage(imgSnake, imgPosX*64, imgPosY*64, 64, 64,scan.PosX*SNAKE_SECTION_SIZE,scan.PosY*SNAKE_SECTION_SIZE,SNAKE_SECTION_SIZE,SNAKE_SECTION_SIZE);
        //--------------------------------------------------------
        
        //------------------Affichage-du-corps--------------------
        scan=scan.Next;
        while(scan!=this.Tail){ //Choix de la partie à afficher en fonction de la direction de la section et de la direction de la section suivante
            switch(scan.Next.Direction){
                case DIR_UP:
                    if(scan.Direction==DIR_LEFT){imgPosY=0;imgPosX=2;}
                    if(scan.Direction==DIR_RIGHT){imgPosY=0;imgPosX=0;}
                    if(scan.Direction==DIR_UP){imgPosY=1;imgPosX=2;}
                    break;
                case DIR_DOWN:
                    if(scan.Direction==DIR_LEFT){imgPosY=2;imgPosX=2;}
                    if(scan.Direction==DIR_DOWN){imgPosY=1;imgPosX=2;}
                    if(scan.Direction==DIR_RIGHT){imgPosY=1;imgPosX=0;}
                    break;
                case DIR_LEFT:
                    if(scan.Direction==DIR_LEFT){imgPosY=0;imgPosX=1;}
                    if(scan.Direction==DIR_UP){imgPosY=1;imgPosX=0;}
                    if(scan.Direction==DIR_DOWN){imgPosY=0;imgPosX=0;}       
                    break;
                case DIR_RIGHT:
                    if(scan.Direction==DIR_RIGHT){imgPosY=0;imgPosX=1;}
                    if(scan.Direction==DIR_UP){imgPosY=2;imgPosX=2;}
                    if(scan.Direction==DIR_DOWN){imgPosY=0;imgPosX=2;}
                    break;
                default:
            }
            ctx.drawImage(imgSnake, imgPosX*64, imgPosY*64, 64, 64,scan.PosX*SNAKE_SECTION_SIZE,scan.PosY*SNAKE_SECTION_SIZE,SNAKE_SECTION_SIZE,SNAKE_SECTION_SIZE);
            scan=scan.Next
        }
        //--------------------------------------------------------

        //------------------Affichage-de-la-Queue-----------------
        switch(scan.Direction){ //Choix de la partie à afficher en fonction de la direction de la queue
            case DIR_UP:
                imgPosX=3;
                imgPosY=2;
                break;
            case DIR_DOWN:
                imgPosX=4;
                imgPosY=3;
                break;
            case DIR_LEFT:
                imgPosX=3;
                imgPosY=3;         
                break;
            case DIR_RIGHT:
                imgPosX=4;
                imgPosY=2;
                break;
            default:
        }
        ctx.drawImage(imgSnake, imgPosX*64, imgPosY*64, 64, 64,scan.PosX*SNAKE_SECTION_SIZE,scan.PosY*SNAKE_SECTION_SIZE,SNAKE_SECTION_SIZE,SNAKE_SECTION_SIZE);
        //--------------------------------------------------------
    }
    eat(fly){
        if(this.Head.PosX==fly.PosX&&this.Head.PosY==fly.PosY){ //Test si la tête du serpent est sur la mouche 
            this.growUp();                                      //Si oui on fais grandir le serpent
            //-------------Actualisation-du-score------------------
            score++;                        
            document.getElementById("score").textContent=score;
            if(score>bestScore){
                bestScore++;
                document.getElementById("bestScore").textContent=bestScore;
            }
            //----------------------------------------------------

            //-------------Relocalisation-de-la-mouche------------
            while(this.isOnCell(fly.PosX,fly.PosY)){        //Cette boucle empêche la mouche de se situer sur le serpent
                fly.PosX=Math.floor(Math.random()*(SNAKE_POS_MAX_X));
                fly.PosY=Math.floor(Math.random()*(SNAKE_POS_MAX_Y));
            }
            //----------------------------------------------------
        }
    }
    isOnCell(PosX,PosY){
        let scan=this.Head
        while(scan){
            if(scan.isOnCell(PosX,PosY))return 1;
            scan=scan.Next
        }
        return 0;
    }
    growUp(){
        switch (this.Tail.Direction){ //La nouvelle section est située derrière la queue en fonction de sa direction  
            case DIR_DOWN:
                this.Tail=new Section(this.Tail,null,this.Tail.Direction,this.Tail.PosX,this.Tail.PosY-1);
                break;
            case DIR_LEFT:
                this.Tail=new Section(this.Tail,null,this.Tail.Direction,this.Tail.PosX+1,this.Tail.PosY);
                break;
            case DIR_RIGHT:
                this.Tail=new Section(this.Tail,null,this.Tail.Direction,this.Tail.PosX-1,this.Tail.PosY);
                break;
            case DIR_UP:
                this.Tail=new Section(this.Tail,null,this.Tail.Direction,this.Tail.PosX,this.Tail.PosY+1);
                break;
            default:
        }
        this.nbSection++;
    }
    isDead(){
        //-------Test si le serpent est dans le cadre---------
        if(this.Head.PosX>SNAKE_POS_MAX_X||this.Head.PosX<SNAKE_POS_MIN_X)return 1;
        if(this.Head.PosY>SNAKE_POS_MAX_Y||this.Head.PosY<SNAKE_POS_MIN_Y)return 1;
        //----------------------------------------------------

        //-------Test si le serpent se mord-------------------
        let scan=this.Head.Next;
        while(scan){
            if(scan.isOnCell(this.Head.PosX,this.Head.PosY))return 1;
            scan=scan.Next;
        }
        //----------------------------------------------------
        return 0;
    }
    //------</Méthodes>------
}
//---------------------</Déclaration-et-implémentation-classe-snake>---------