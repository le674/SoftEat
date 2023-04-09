// on contruit un type mutualisé pour l'utilisation de la fonction
//Attention pour TextItem le point (x0, y0) représente le point dans le coin en bas à gauche du mots
// alors que pour (x0, y0) dans le cadre de TextImg c'est le point en haut à gauche. Cependant cela ne change 
// en rien les traitment qui vont suivre coilà pourquoi l'on construit 
export type TextShared = {
    text:string;
    coordinates: Array<number>
}


// text indique le text de l'item
// coordinate représente les quatres coordonnées de l'item
export type TextImg = {
    text:string;
    coordinates: Array<number>
}