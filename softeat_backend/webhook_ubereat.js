const functions = require("firebase-functions");
//import du paquet cors pour les problème connections cross origines
const cors = require("cors");
const express = require('express');
const crypto = require('crypto');
//construction et configuration de l'application express
const AppWebhook = express();
AppWebhook.use(cors());
AppWebhook.use(express.json());
AppWebhook.post('/', (req, res) => {
    const event_id = req.body.event_id;
    console.log(event_id);
    return res.status(200).send("data get");
});
/**  
 * Gestion des donnés transmises depuis deliveroo
*/
exports.webhook = functions.https.onRequest(AppWebhook);  