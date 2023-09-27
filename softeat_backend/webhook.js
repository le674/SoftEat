const functions = require("firebase-functions");
let sdk_token = require('api')('@deliveroo/v2.0#dkx619legywisx');
let sdk_sync = require('api')('@deliveroo/v2.0#ec9l11llqhk8ln');
//import du paquet cors pour les problème connections cross origines
const cors = require("cors");
const express = require('express');
//construction et configuration de l'application express
const AppWebhook = express();
AppWebhook.use(cors());
AppWebhook.use(express.json());
AppWebhook.post('/', (req, res) => {
    const id  = req.body.body.order.id;
    sdk_token.auth('5htgeb51pagm6k5es6dna9448b', '1vqot94lel5ks61ld4s537rvg247s13igtr9hjpgmjdfolbi6mut');
    sdk_token.server('https://auth-sandbox.developers.deliveroo.com');
    return sdk_token.getAccessToken({ grant_type: 'client_credentials' })
        .then(({ data }) => {
            sdk_sync.server('https://api-sandbox.developers.deliveroo.com');
            sdk_sync.auth(data.access_token);
            return sdk_sync.createSyncStatus({ order_id: id })
            .then(({ data }) => {F
                return res.status(200).send(data)
            })
            .catch(err => res.status(400).send("sync error"));
    });
});
/**  
 * Gestion des donnés transmises depuis deliveroo
*/
exports.webhook = functions.https.onRequest(AppWebhook);  