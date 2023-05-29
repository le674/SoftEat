//FIREBASE_DATABASE_EMULATOR_HOST_1 = 'http://softeat-serveur:9000/?ns=psofteat-65478545498421319564'
//NODE_ENV = "development"
//Import du paquet pour la création de fonctions https
const functions = require("firebase-functions");

// import de firebase
const admin = require("firebase-admin");
const serviceAccount = require('./firebase-conf/key.json');
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com"
}, "mail")

// import de nodemailer
const nodemailer = require("nodemailer");

//import du paquet cors pour les problème connections cross origines
const cors = require("cors");
const express = require('express');
const corsOptions = {
    origin: ["https://www.softeat.fr", "https://psofteat-65478545498421319564.web.app"]
};
//construction et configuration de l'application express
const AppSendMail = express();
AppSendMail.use(cors(corsOptions));

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

//Permet d'envoyer des mail via nodeMailer
AppSendMail.get('/', (req, res) => {
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
        console.log(info);
        if (erro) {
            return res.send(erro.toString());
        }
        else {
            res.send('sended');
        }
    });
})

/**  
 * Permet d'envoyer des mail via nodeMailer
 * @param {string} req.query.from - personne qui envoie le message
 * @param {string} req.query.subj- sujet du message envoyer
 * @param {string} req.query.message - contenu du message envoyé
 * @returns {void} ont transmet un mail au client
*/
exports.sendMail = functions.https.onRequest(AppSendMail);
