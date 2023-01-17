const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({origin: true});
admin.initializeApp();


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
