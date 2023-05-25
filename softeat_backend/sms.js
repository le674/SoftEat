
//Import du paquet pour la création de fonctions https
const functions = require("firebase-functions");
//Import de firebase
const admin = require("firebase-admin");
const serviceAccount = require('./firebase-conf/key.json');
const app = admin.initializeApp({
  credential:  admin.credential.cert(serviceAccount), 
  databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com"
}, "sms")
//Import de fs pour la lecture et le parsing de fichiers JSON + lecture et parsing du fichier de config AWS
const fs = require('fs');
const configFile = fs.readFileSync("./aws-conf/config.json", 'utf-8');
const config = JSON.parse(configFile);
//Import du Aws-sdk pour amazon SNS, lecture du fichier des accès, configuration d'un client sns 
const { SNSClient, CreateTopicCommand, SubscribeCommand, PublishCommand} = require("@aws-sdk/client-sns");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const credentials = fromIni({ profile: "default", configFilepath: "./aws-conf/credentials" });
const snsClient = new SNSClient({
    region: config.region,
    credentials: credentials,
}); 
//Import de la librairie cors pour les requêtes Cross Origine
const cors = require("cors")({ origin: true });
/**  
 * Création d'un nouveau Topics pour l'envoie de SMS
 * @param {string} req.query.restaurant - restaurant auquel ont veut créer le topic
 * @param {string} req.query.prop - nom de l'enseigne auquel nous créeons le topic
 * @param {string} req.query.topic_name - nom du topic que l'on crée deux possibilités promotion et wast_prev(wast_prev correspond  aux alertes concernant le gaspisllage)    
 * @returns {void} ont crée un sujet/topic
*/
exports.createTopic = functions.https.onRequest((req, res) => {   
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
});


/**  
 * Mise en place d'un abonnement à un topic par les clients 
 * @param {string} req.query.restaurant - restaurant auquel ont veut que le client souscrit
 * @param {string} req.query.prop - nom de l'enseigne auquel le client souscrit
 * @param {string} req.query.num - numéro du client qui souscrit
 * @param {string} req.query.subject - sujet auquel le client souscrit deux topics existe, promotion et wast_prev(wast_prev correspond  aux alertes concernant le gaspisllage)    
 * @returns {void} ont abonne le client au topic
*/
exports.subscribeClient = functions.https.onRequest((req, res) => {
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
});

/**  
 * Envoie un message aux personnes abonnés à un topic
 * @param {string} req.query.restaurant - restaurant auquel ont veut que le client souscrit
 * @param {string} req.query.prop - nom de l'enseigne auquel le client souscrit
 * @param {string} req.query.msg - message que l'on envois aux personnes ayants souscrits au topic
 * @param {string} req.query.subject - sujet auquel le client souscrit deux topics existe, promotion et wast_prev(wast_prev correspond  aux alertes concernant le gaspisllage)    
 * @returns {void} ont envoie les messages aux clients
*/
exports.sendMessage = functions.https.onRequest((req, res) => {
  let sub = "";
  const client = new SNSClient(config);
  const restaurant = req.query.restaurant;
  const prop = req.query.prop;
  const msg = req.query.msg;
  const subject = req.query.subject;
  const topic = prop + '_' + restaurant + '_' + subject;
  const arn = 'arn:aws:sns:eu-west-3:395629972621:' + topic;
  if(subject == "promotion"){
    sub = "promotions"
  }
  if(subject == "wast_alertes_food"){
    sub = "promotions déstockage"
  }
  const input = { // PublishInput
    TopicArn: arn,
    Message: msg, // required
    Subject: `Information ${restaurant} : ${sub}`,
    MessageStructure: "STRING_VALUE"
  };
  const command = new PublishCommand(input);
  return client.send(command).then(() => {
    res.status(200).send(`Nous venons d'envoyer une campagne de message pour le restaurant ${restaurant} de l'enseigne ${prop}`)
  }).catch((e) => {
    res.status(404).send(`Nous ne somme pas parvenus à envoyer de message pour le restaurant ${restaurant} de l'enseigne ${prop}`)
  });
});  