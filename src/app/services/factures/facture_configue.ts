/**
 * Objet personnalisé représentant une entité spécifique.
 * @typedef {Object} configue_facture_parser
 * @property {string} error_row_dist - permet de determiner la distance minimum à partir de laquelle si deux ligne son à distance plus petite que celle-ci on ne considère la pas la ligne suivante comme une nouvelle ligne du tableau
 * @property {number} same_pourcent - pourcentage de similitude entre deux mots que l'on accepte dans le cas du parsing d'une image
*/
export const configue_facture_parser = {
    error_row_dist: 20,
    same_pourcent: 70
}