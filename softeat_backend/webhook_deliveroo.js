const functions = require("firebase-functions");
let sdk_token = require('api')('@deliveroo/v2.0#dkx619legywisx');
let sdk_sync = require('api')('@deliveroo/v2.0#ec9l11llqhk8ln');
//import du paquet cors pour les problème connections cross origines
const cors = require("cors");
const express = require('express');
const crypto = require('crypto');
//construction et configuration de l'application express
const AppWebhook = express();
AppWebhook.use(cors());
AppWebhook.use(express.json());
AppWebhook.post('/', (req, res) => {
    const secret = "qoqsd_PCWggf6V0fJHkCbkwy-PBts1ZcIDDdJlFLwqFYMbP9GAC8Rj-Tlv2e_o4LB0bmE7cLPcZP_Wf8Pr8yEA";
    const commande = req.body.body.order.id;
    const guid = req.headers["x-deliveroo-sequence-guid"];
    const hash = req.headers["x-deliveroo-hmac-sha256"];
    const payload = `${guid} ${JSON.stringify(req.body)}`;
    const _hashed_data = crypto.createHmac('SHA256', secret).update(payload).digest('hex');
    if(_hashed_data === hash){
        const id  = commande.split(":")[1];
        const status = req.body.body.order.status;
        sdk_token.auth('5htgeb51pagm6k5es6dna9448b', '1vqot94lel5ks61ld4s537rvg247s13igtr9hjpgmjdfolbi6mut');
        sdk_token.server('https://auth-sandbox.developers.deliveroo.com');
            return sdk_token.getAccessToken({ grant_type: 'client_credentials' })
            .then(({ data }) => {
                sdk_sync.auth(data.access_token);
                sdk_sync.server('https://api-sandbox.developers.deliveroo.com');
                sdk_sync.createSyncStatus({order_id:id}).then(({data}) => {
                    return res.status(200).send(data);
                }).catch((err) => {
                    console.error(err)
                    return res.status(err.status).send(err.data);
                })
            });
    }
    else{
        throw new Error("sended data not from this webhook");
    }
});
/**  
 * Gestion des donnés transmises depuis deliveroo
*/
exports.webhook = functions.https.onRequest(AppWebhook);  