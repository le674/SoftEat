const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, update, child, set, push } = require("firebase/database");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const app = initializeApp(
    {
        apiKey: "AIzaSyDPJyOCyUMDl70InJyJLwNLAwfiYnrtsDo",
        authDomain: "psofteat-65478545498421319564.firebaseapp.com",
        databaseURL: "http://softeat-serveur/?ns=psofteat-65478545498421319564",
        projectId: "psofteat-65478545498421319564",
        storageBucket: "psofteat-65478545498421319564.appspot.com",
        messagingSenderId: "135059251548",
        appId: "1:135059251548:web:fb05e45e1d1631953f6199",
        measurementId: "G-5FBJE9WH0X"
    }
)

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
            if (erro) {
                return res.send(erro.toString());
            }
            else {
                res.send('sended');
            }
        });
    });
});

//===================== fonction de suppression de plat ds la base de données avec les ingrédients comprient ===================
exports.suppPlats = functions.https.onRequest((req, res) => {
    let db = getDatabase(app);
    const prop = req.query.prop;
    const restaurant = req.query.restaurant;
    const name = req.query.name;
    const quantity = req.query.quantity;

    const path_plat = `plat_${prop}_${restaurant}/${prop}/${restaurant}/${name}`;
    const path_ingredients = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}`;
    const path_consommables = `consommables_${prop}_${restaurant}/${prop}/${restaurant}`;

    const ref1 = ref(db, path_plat);
    const ref2 = ref(db, path_ingredients);
    const ref3 = ref(db, path_consommables);


    return get(ref1).then((snap_plat) => {
        let ings = [];
        let consos = [];
        let prepa = [];
        let full_prepa_ing = [];
        let full_prepa_conso = [];
        const plat = snap_plat.val()
        if ((plat.ingredients !== null) && (plat.ingredients !== undefined)) {
            ings = plat.ingredients.map((ing) => {
                return { name: ing.name, quantity: ing.quantity * quantity, quantity_unity: ing.quantity_unity, cost: ing.cost, vrac: ing.vrac, unity: ing.unity }
            });
        }
        if ((plat.consommables !== null) && (plat.consommables !== undefined)) {
            consos = plat.consommables.map((conso) => {
                return { name: conso.name, quantity: conso.quantity * quantity, unity: conso.unity, cost: conso.cost }
            });
        }
        if ((plat.preparations !== null) && (plat.preparations !== undefined)) {
            prepa = plat.preparations;
            full_prepa_ing = plat.preparations.map((preparation) => preparation.base_ing.map((base_ing) => {
                return { name: base_ing.name, quantity: base_ing.quantity * quantity, quantity_unity: base_ing.quantity_unity, cost: base_ing.cost, vrac: base_ing.vrac, unity: base_ing.unity }
            })).flat()
            full_prepa_conso = plat.preparations.map((preparation) => preparation.consommables.map((conso) => {
                return { name: conso.name, quantity: conso.quantity * quantity, unity: conso.unity, cost: conso.cost }
            })).flat()
        }
        const ingredients = ings.concat(full_prepa_ing);
        const consommables = consos.concat(full_prepa_conso);
        return { ingredients: ingredients, consommables: consommables, preparations: prepa }
    }).then((_supp) => {
        Promise.all([
            get(ref2),
            get(ref3)
        ])
            .then(([snap_ingredients, snap_consommables]) => {
                let arr_ingredients = [];
                let arr_consommables = [];
                let arr_preparations = [];
                let _preparations = snap_ingredients.val().preparation;
                let _ingredients = snap_ingredients.val();
                let _consommables = snap_consommables.val();

                // ont supprime les préparations des ingrédients
                delete _ingredients.preparation;

                // ont applatie l'objet en une liste 
                if ((_ingredients !== null) && (_ingredients !== undefined)) {
                    arr_ingredients = Object.entries(_ingredients).map((ingredients) => {
                        return { ...ingredients[1], name: ingredients[0] }
                    });
                }
                if ((_consommables !== null) && (_consommables !== undefined)) {
                    arr_consommables = Object.entries(_consommables).map((consommables) => {
                        return { ...consommables[1], name: consommables[0] }
                    });
                }
                if ((_preparations !== null) && (_preparations !== undefined)) {
                    arr_preparations = Object.entries(_preparations).map((preparations) => {
                        return { ...preparations[1], name: preparations[0] }
                    });
                }
                arr_ingredients = arr_ingredients.map((ingredient) => {
                    if ((_supp.ingredients !== null) && (_supp.ingredients !== undefined)) {
                        const _supp_ings = _supp.ingredients.filter((ing) => ing.name === ingredient.name);
                        if ((_supp_ings !== null) && (_supp_ings !== undefined)) {
                            for (let _ingredient of _supp_ings) {
                                // on récupère la quantitée /quantité unitée le nouveau coût à supprimer
                                if (ingredient.vrac === 'oui') {
                                    ingredient.quantity_unity = ingredient.quantity_unitaire - _ingredient.quantity;
                                    // on recalcul le coût pour la nouvelle quantitée d'ingrédient en vrac
                                    ingredient.cost = ingredient.cost * _ingredient.quantity / ingredient.quantity_unitaire;
                                }
                                else {
                                    ingredient.quantity = ingredient.quantity - _ingredient.quantity / ingredient.quantity_unitaire;
                                }
                            }
                        }
                    }
                    return ingredient;
                });
                arr_consommables = arr_consommables.map((consommable) => {
                    if ((_supp.consommables !== null) && (_supp.consommables !== undefined)) {
                        const _supp_consos = _supp.consommables.filter((conso) => conso.name === consommable.name);
                        if ((_supp_consos !== null) && (_supp_consos !== undefined)) {
                            for (let _consommable of _supp_consos) {
                                consommable.quantity = consommable.quantity - _consommable.quantity;
                                consommable.cost = consommable.cost * _consommable.quantity / consommable.quantity;
                            }
                        }
                    }
                    return consommable;
                });
                arr_preparations = arr_preparations.map((preparation) => {
                    if ((_supp.prepa !== null) && (_supp.prepa !== undefined)) {
                        const _supp_prepas = _supp.prepa.filter((prepa) => prepa.name === preparation.name);
                        if ((_supp_prepas !== null) && (_supp_prepas !== undefined)) {
                            for (let _preparation of _supp_prepas) {
                                // on récupère la quantitée /quantité unitée le nouveau coût à supprimer
                                if (preparation.vrac === 'oui') {
                                    preparation.quantity_unity = preparation.quantity_unity - _preparation.quantity;
                                    // on recalcul le coût pour la nouvelle quantitée d'ingrédient en vrac
                                    preparation.cost = preparation.cost * _preparation.quantity / preparation.quantity;
                                }
                                else {
                                    preparation.quantity = preparation.quantity - _preparation.quantity / preparation.quantity_unitaire;
                                }
                            }
                        }
                    }
                    return preparation;
                });
                return { new_ingredient: arr_ingredients, new_consommables: arr_consommables, new_preparations: arr_preparations }
            }).then((add) => {
                const db_ingredients = Object.assign({}, ...add.new_ingredient.map((ingredients) => {
                    const name = ingredients.name;
                    delete ingredients.name;
                    return {[name]:ingredients};
                }));
                const db_consommables = Object.assign({}, ...add.new_consommables.map((consommables) => {
                    const name = consommables.name;
                    delete consommables.name;
                    return {[name]:consommables};
                }));
                const db_preparations = Object.assign({}, ...add.new_preparations.map((preparations) => {
                    const name = preparations.name;
                    delete preparations.name;
                    return {[name]:preparations};
                }));
                set(ref2,  db_ingredients).then(() => {
                    set(child(ref2, '/preparation'), db_preparations).then(() => {
                        set(ref3, db_consommables).finally(() => {
                            res.send('donnée bien supprimé')
                        }).catch((error) => {
                            console.error(error);
                            res.status(500).send('Internal Server Error');
                        })
                    }).catch(error => {
                        console.error(error);
                        res.status(500).send('Internal Server Error');
                    });
                }).catch((error) => {
                    console.error(error);
                    res.status(500).send('Internal Server Error');
                });
            })
    })


})