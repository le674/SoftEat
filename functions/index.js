const { initializeApp } = require("firebase/app");
const { getDatabase, ref} = require("firebase/database");
const environement = require('../src/environments/environment'); 
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");



const cors = require("cors")({origin: true});
admin.initializeApp();
const app = initializeApp(environement)

/**
* Here we're using Gmail to send depuis 2022-05-02 on utilise une app password au lieu du mot de passe du compte
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'softeat.contact@gmail.com',
        pass: 'puhrqkirfohpmzfx'
    }
});

/** l'url de la fonction get à utiliser est example : https://us-central1-project-firebase-44cfe.cloudfunctions.net/sendMail?from=adamakkouche42@yahoo.fr&subj=suppression%20de%20compte&message=je%20souhaite%20supprimer%20le%20compte%20adam */
exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const from = req.query.from;
        const subj = req.query.subj;
        const message = req.query.message;
        const mailOptions = {
            from: from,
            to: 'softeat.contact@gmail.com',
            subject: subj,
            html: message

        };
        //on retourne le résultat de l'envoie de mail
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            else{
                res.send('sended');
            }
        });
    });
});

//===================== fonction de suppression de plat ds la base de données avec les ingrédients comprient ====================
exports.suppPlats = functions.https.onRequest((req, res) => {
    let db = getDatabase(app);
    const prop = req.query.prop;
    const restaurant = req.query.restaurant;
    const name = req.query.name;
    const quantity = req.query.quantity;
    
    const path_plat = `plat_${prop}_${restaurant}/${prop}/${restaurant}/${name}`;
    const path_ingredients = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}`;
    const path_consommables = `consommables_${prop}_${restaurant}/${prop}/${restaurant}`;
    
    const ref1 = ref(db,path_plat);
    const ref2 = ref(db,path_ingredients);
    const ref3 = ref(db,path_consommables);
    
    ref1.once().then((snap_plat) => {
      let ings = []; 
      let consos = [];
      let prepa = [];
      let full_prepa_ing = [];
      let full_prepa_conso = [];
      const plat = snap_plat.val()
      if(plat.ingredients !== null){
         ings = plat.ingredients.map((ing) => {
            return {name: ing.name, quantity:ing.quantity*quantity ,quantity_unity: ing.quantity_unity, cost: ing.cost, vrac: ing.vrac, unity:ing.unity}
        });
      }
      if(plat.consommables !== null){
         consos = plat.consommables.map((conso) => {
            return {name:conso.name, quantity:conso.quantity*quantity, unity:conso.unity, cost: conso.cost}
         });
      }
      if(plat.preparations !== null){
        prepa = plat.preparations;
        full_prepa_ing = plat.preparations.map((preparation) => preparation.base_ing.map((base_ing) => {
            return {name: base_ing.name, quantity:base_ing.quantity*quantity, quantity_unity: base_ing.quantity_unity, cost: base_ing.cost, vrac:base_ing.vrac, unity:base_ing.unity}
        })).flat()
        full_prepa_conso = plat.preparations.map((preparation) => preparation.consommables.map((conso) => {
            return {name: conso.name, quantity:conso.quantity*quantity, unity:conso.unity, cost: conso.cost}
        })).flat()
      }
      const ingredients = ings.concat(full_prepa_ing);
      const consommables = consos.concat(full_prepa_conso);
      return {ingredients: ingredients, consommables: consommables, preparations: prepa}
    }).then((_supp) => {
      Promise.all([
        ref2.once(),
        ref3.once()
      ])
      .then(([snap_ingredients, snap_consommables]) => {
        let _preparations =  snap_ingredients.val().preparation;
        let _ingredients = snap_ingredients.val();
        delete _ingredients.preparation;
        let _consommables = snap_consommables.val();
        _ingredients = _ingredients.map((ingredient) => {
        const _supp_ings = _supp.ingredients.filter((ing) => ing.name === Object.keys(ingredient));
        if((_supp_ings !== null) && (_supp_ings !== undefined)){
                for(let _ingredient of _supp_ings) {
                    // on récupère la quantitée /quantité unitée le nouveau coût à supprimer
                    if(ingredient.vrac === 'oui'){
                        ingredient.quantity_unity = ingredient.quantity_unity - _ingredient.quantity;
                        // on recalcul le coût pour la nouvelle quantitée d'ingrédient en vrac
                        ingredient.cost = ingredient.cost* _ingredient.quantity/ingredient.quantity;
                    }
                    else{
                        ingredient.quantity =  ingredient.quantity - _ingredient.quantity/ingredient.quantity_unity;
                    }
                }             
           }
           return ingredient;
        });
        _consommables = _consommables.map((consommable) => {
            const _supp_consos = _supp.consommables.filter((conso) => conso.name ===  Object.keys(consommable));
            if((_supp_consos !== null) && (_supp_consos !== undefined)){
                for(let _consommable of _supp_consos){
                    consommable.quantity = consommable.quantity - _consommable.quantity;
                    consommable.cost = consommable.cost*_consommable.quantity/consommable.quantity;
                }
            } 
        });
        _preparations = _preparations.map((preparation) => {
            const _sup_prepas = _supp.prepa.filter((prepa) => prepa)
            const _supp_prepa = _supp_prepa
        })       

      })  
    }).catch(error => {
        console.error(error);
        res.status(400).send('unauthrized acces');
        res.status(401).send('unauthrized acces');
        res.status(500).send('Internal Server Error');
      });


 })