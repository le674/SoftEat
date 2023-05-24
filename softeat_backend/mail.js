//FIREBASE_DATABASE_EMULATOR_HOST_1 = 'http://softeat-serveur:9000/?ns=psofteat-65478545498421319564'
//NODE_ENV = "development"
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const serviceAccount = require('./firebase-conf/key.json');
const cors = require("cors")({ origin: true });
const app = admin.initializeApp({
    credential:  admin.credential.cert(serviceAccount), 
    databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com"
})
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

/**Permet d'envoyer des mail via nodeMailer  **/
exports.sendMail = functions.https.onRequest((req, res) => {
    res.setHeader("Access-Control-Allow-Origin","https://psofteat-65478545498421319564.web.app");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
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
            console.log(info);
            if (erro) {
                return res.send(erro.toString());
            }
            else {
                res.send('sended');
            }
        });
    });
});
