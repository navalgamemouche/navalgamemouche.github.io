////////////////////////// DÉCLARATION DES VARIABLES

const grilleCartes = document.querySelector(".grille");
let images = []; // tableau vide qui contiendra toutes les images
let cartes = []; // tableau vide qui contiendra toutes les cartes (2x images)
let carte1; // première carte à être retournée
let carte2; // deuxième carte à être retournée
let clicVerouille = false; // variable qui verouille le clic pour ne pas pouvoir tourner plus de 2 cartes

// Audios utilisés
let flip = new Audio();
flip.src = "media/flip.mp3";
let demarrage = new Audio();
demarrage.src = "media/windowsxp.mp3";
let audiowin = new Audio();
audiowin.src = "media/dorawin.mp3";

images = [
    {
        "image": "media/cartes/gare.png",
        "nom": "gare"
    },
    {
        "image": "media/cartes/hommebleu.png",
        "nom": "hommebleu"
    },
    {
        "image": "media/cartes/beaublanc.png",
        "nom": "beaublanc"
    },
    {
        "image": "media/cartes/dussoubs.png",
        "nom": "dussoubs"
    },
    {
        "image": "media/cartes/gaylu.png",
        "nom": "gaylu"
    },
    {
        "image": "media/cartes/mairie.png",
        "nom": "mairie"
    },
    {
        "image": "media/cartes/rep.png",
        "nom": "rep"
    },
    {
        "image": "media/cartes/saintmartial.png",
        "nom": "saintmartial"
    },
    {
        "image": "media/cartes/vienne.png",
        "nom": "vienne"
    }
]

cartes = images.concat(images); // Les cartes contiennent 2 x chaque image

////////////////////////// PROGRAMME PRINCIPAL

melangeCartes();
afficherCartes();
demarrage.play(); 

////////////////////////// LES FONCTIONS

// Fonction pour génerer un nombre aléatoire entre deux bornes
function genererNombreAlea(min, max) {
    let nb = Math.random(); // un nombre  entre 0 et 1 exclus
    // on va "dénormaliser" + tronquer pour que le nombre soit un entier et dans la plage donnée
    nb = min + Math.floor(nb * (max - min));
    return nb;
}

// Fonction pour faire des paires d'images aléatoires 
function melangeCartes() {
    let indiceAlea;
    let indiceActu = 0;
    let temp;
    //on commence par la premiere carte et tant qu'on n'a pas atteint la derniere
    while (indiceActu !== cartes.length) {
        indiceAlea = genererNombreAlea(0, indiceActu); //on choisit une carte aléatoire
        temp = cartes[indiceActu]; //on permute la carte actuelle avec la carte choisie aléatoirement
        cartes[indiceActu] = cartes[indiceAlea];
        cartes[indiceAlea] = temp;
        indiceActu = indiceActu + 1; //on incrémente enfin pour le while
    }
}

// Fonction pour afficher les cartes dans la grille
function afficherCartes() {
    for (let carte of cartes) {
        // Crée un élément div pour représenter une carte
        const carteDiv = document.createElement("div");
        carteDiv.classList.add("carte"); // Ajoute la classe "carte" à l'élément div
        carteDiv.setAttribute("data-nom", carte.nom);
        carteDiv.innerHTML = `
      <div class="recto">
        <img class="recto-image" src=${carte.image} />
      </div>
      <div class="verso"></div>
    `;
        grilleCartes.appendChild(carteDiv); // ajoute la carte à la grille
        carteDiv.addEventListener("click", devoilerCarte); // clic sur la carte liée à la fct devoilerCarte()
    }
}

// Fonction pour dévoiler une carte lorsqu'elle est cliquée
function devoilerCarte()
{
    if (clicVerouille || this === carte1) {
        return; 
        // Vérifie si les clics sont verrouillés (rien faire si une carte est choisie)
        // Vérifie si la carte cliquée est la même que la première carte déjà dévoilée, dans ce cas rien faire non plus
    }
    
    this.classList.add("devoilee"); // Ajoute la classe "devoilee" à la carte cliquée
    flip.play() // son "flip" de la carte

    // Si aucune première carte n'a été sélectionnée, assigne la carte actuelle à la variable carte1
    if (!carte1) {
        carte1 = this;
    }
    else {
        carte2 = this; // Si une première carte est déjà sélectionnée, assigne la carte actuelle à la variable carte2
        clicVerouille = true; // Verrouille les clics, l'utilisateur peut pas ouvrir plus de 2 cartes en meme temps
        verifierMemeCartes(); // Vérifie si on gagne/perd
    }
}

// Fonction pour retourner les cartes dévoilées après un certain délai
function masquerCarte() {
    setTimeout(() => {
        carte1.classList.remove("devoilee"); // Retire la classe "devoilee" de la première carte
        carte2.classList.remove("devoilee"); // Retire la classe "devoilee" de la deuxième carte
        // L'utilisateur ne selectionne plus auccune carte
        carte1 = null;
        carte2 = null;
        // On peut de nouveau cliquer sur les cartes
        clicVerouille = false;
    }, 1000); // attendre une seconde avant de retourner les cartes
}

// Fonction pour vérifier si deux cartes sont identiques
function verifierMemeCartes() {
    let gagne = carte1.dataset.nom === carte2.dataset.nom; // Vérifie si les noms des deux cartes sont identiques
    if (gagne === true) {
        // On ne peut plus cliquer sur les cartes découvertes
        carte1.removeEventListener("click", devoilerCarte);
        carte2.removeEventListener("click", devoilerCarte);
        // L'utilisateur ne selectionne plus auccune carte
        carte1 = null;
        carte2 = null;
        // On peut de nouveau cliquer sur les (autres) cartes
        clicVerouille = false;
        audiowin.play(); // Joue le son de victoire (dora :p)
        confetti(); // Affiche des confettis si on a gagné ^^
    }
    else {
        masquerCarte();
    }
}

// Fonction pour recommencer le jeu, appelée lors de l'appui sur le bouton
function recommencer() {
    carte1 = null;
    carte2 = null;
    clicVerouille = false;
    demarrage.play(); // Joue le son de démarrage du jeu
    melangeCartes();
    grilleCartes.innerHTML = ""; // Efface le contenu actuel de la grille
    afficherCartes();
}
