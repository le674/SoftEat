const FIREBASE_PROD = false; 
//Import du paquet pour la création de fonctions https
const functions = require("firebase-functions");
//Import des librairies cors/express pour les requêtes Cross Origine
const cors = require("cors");
const express = require('express');
//Import de firebase
const admin = require("firebase-admin");
const serviceAccount = require('./firebase-conf/key.json');
const app = admin.initializeApp({
  credential:  admin.credential.cert(serviceAccount), 
  databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com"
}, "sms");

//Import de fs pour la lecture et le parsing de fichiers JSON + lecture et parsing du fichier de config AWS
const fs = require('fs');
const configFile = fs.readFileSync("./aws-conf/config.json", 'utf-8');
const config = JSON.parse(configFile);

//Import du Aws-sdk pour amazon SNS, lecture du fichier des accès, configuration d'un client sns 
const {SNSClient, CreateTopicCommand, SubscribeCommand, PublishCommand} = require("@aws-sdk/client-sns");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const credentials = fromIni({ profile: "default", configFilepath: "./aws-conf/credentials" });
const snsClient = new SNSClient({
    region: config.region,
    credentials: credentials,
}); 
// Configuration des middleware CORS avec les URL autorisées
let corsOptions;
if(FIREBASE_PROD){
  corsOptions = {
        origin: ["https://www.softeat.fr", "https://psofteat-65478545498421319564.web.app"]
    };
}
else{
    corsOptions = {
        origin: [ "http://localhost:4200"]
    };
}
//construction des différentes applications express
const AppcreateTopic = express();
const AppSubscribeClient = express();
const AppSendMessage = express();
//configuration des différentes applications express
AppcreateTopic.use(cors(corsOptions));
AppSubscribeClient.use(cors(corsOptions));
AppSendMessage.use(cors(corsOptions));


//Création d'un nouveau Topics pour l'envoie de SMS
AppcreateTopic.get('/', (req, res) => {
  let defaultDatabase = app.database();
  const restaurant = req.query.restaurant;
  const prop = req.query.prop;
  const topic_name = req.query.topic_name;
  const ref_restaurants = defaultDatabase.ref(`restaurants_${prop}_${restaurant}/${prop}/${restaurant}`);
  const ref_get_num_top = defaultDatabase.ref(`restaurants_${prop}_${restaurant}/${prop}/${restaurant}/num_topics`);
  const id = `${prop}_${restaurant}_${topic_name}`;
  const input = { 
      Name: id, // required
      Tags: [ 
        {
          Key: id, // required
          Value: topic_name, // required
        },
      ]
    };
 const command = new CreateTopicCommand(input);
 return ref_get_num_top.get().then((data) => {
    let num_topic = data.toJSON();
    if((num_topic === undefined) || (num_topic === null)){
      num_topic = 1;
    }
    else{
      num_topic = num_topic + 1;
    }
    return num_topic;
  }).then((num_topic) => {
    if(num_topic < 5){
      snsClient.send(command).then(() => {
        ref_restaurants.update({
          [`num_topics`]: num_topic
        }).then(() => {
          res.status(200).send('Arrêt de la fonction : ajout d un topic et augmentation du nombre de topics maximal');
          return;
        })
      })
    }
    else{
      res.status(500).send('Nombre maximal de topic atteint aucun nouveau topics ajouté dans la base de donnée');
    }
  })
})

//Mise en place d'un abonnement à un topic par les clients 
AppSubscribeClient.get('/', (req, res) => {
  const restaurant = req.query.restaurant;
  const prop = req.query.prop;
  const num = req.query.num;
  const subject = req.query.subject;
  const topic = prop + '_' + restaurant + '_' + subject;
  const arn = 'arn:aws:sns:eu-west-3:395629972621:' + topic;
  const input = { // SubscribeInput
    TopicArn: arn, // required
    Protocol: "sms", // required
    Endpoint: num
  };
  const command = new SubscribeCommand(input);
  return snsClient.send(command).then(() => {
    res.status(200).send(`Une demmande d inscription au numéro ${num} vient de se réaliser`)
  });
})

//Envoie un message aux personnes abonnés à un topic
AppSendMessage.get('/', (req, res) => {
  let defaultDatabase = app.database();
  let sub = "";
  const client = new SNSClient(config);
  const restaurant = req.query.restaurant;
  const prop = req.query.prop;
  const msg = req.query.msg;
  const subject = req.query.subject;
  const topic = prop + '_' + restaurant + '_' + subject;
  const arn = 'arn:aws:sns:eu-west-3:395629972621:' + topic;
  const ref_restaurants = defaultDatabase.ref(`restaurants_${prop}_${restaurant}/${prop}/${restaurant}`);
  const ref_get_num_cam = defaultDatabase.ref(`restaurants_${prop}_${restaurant}/${prop}/${restaurant}/num_cam`);
  if(subject == "promotion"){
    sub = "promotions"
  }
  if(subject == "wast_prev"){
    sub = "promotions déstockage"
  }
  const input = { // PublishInput
    TopicArn: arn,
    Message: msg, // required
    Subject: `Information ${restaurant} : ${sub}`,
    MessageStructure: "STRING_VALUE"
  };
  const command = new PublishCommand(input);
  return ref_get_num_cam.get().then((data) => {
    let num_cam = data.toJSON();
    if((num_cam === undefined) || (num_cam === null)){
      num_cam = 1;
    }
    else{
      num_cam = num_cam + 1;
    }
    return num_cam;
  }).then((num_cam) => {
    if(num_cam < 3){
      client.send(command).then(() => {
        ref_restaurants.update({
          [`num_cam`]: num_cam
        }).then(() => {
          res.status(200).send('Arrêt de la fonction : ajout d une campagne et augmentation du nombre de campagne maximal');
          return;
        }).catch((e) => {
          res.status(404).send(`Nous ne somme pas parvenus à envoyer de message pour le restaurant ${restaurant} de l'enseigne ${prop}`)
        });
      })
    }
    else{
      res.status(500).send('Nombre maximal de campagnes atteintes aucune nouvelle camapgnes possible');
    }
  })
})
/**  
 * Création d'un nouveau Topics pour l'envoie de SMS
 * @param {string} req.query.restaurant - restaurant auquel ont veut créer le topic
 * @param {string} req.query.prop - nom de l'enseigne auquel nous créeons le topic
 * @param {string} req.query.topic_name - nom du topic que l'on crée deux possibilités promotion et wast_prev(wast_prev correspond  aux alertes concernant le gaspisllage)    
 * @returns {void} ont crée un sujet/topic
*/
exports.createTopic = functions.https.onRequest(AppcreateTopic);
/**  
 * Mise en place d'un abonnement à un topic par les clients 
 * @param {string} req.query.restaurant - restaurant auquel ont veut que le client souscrit
 * @param {string} req.query.prop - nom de l'enseigne auquel le client souscrit
 * @param {string} req.query.num - numéro du client qui souscrit
 * @param {string} req.query.subject - sujet auquel le client souscrit deux topics existe, promotion et wast_prev(wast_prev correspond  aux alertes concernant le gaspisllage)    
 * @returns {void} ont abonne le client au topic
*/
exports.subscribeClient = functions.https.onRequest(AppSubscribeClient);

/**  
 * Envoie un message aux personnes abonnés à un topic
 * @param {string} req.query.restaurant - restaurant auquel ont veut que le client souscrit
 * @param {string} req.query.prop - nom de l'enseigne auquel le client souscrit
 * @param {string} req.query.msg - message que l'on envois aux personnes ayants souscrits au topic
 * @param {string} req.query.subject - sujet auquel le client souscrit deux topics existe, promotion et wast_prev(wast_prev correspond  aux alertes concernant le gaspisllage)    
 * @returns {void} ont envoie les messages aux clients
*/
exports.sendMessage = functions.https.onRequest(AppSendMessage);  