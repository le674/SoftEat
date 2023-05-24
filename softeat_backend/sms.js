const functions = require("firebase-functions");
const fs = require('fs');
 const { SNSClient, CreateTopicCommand } = require("@aws-sdk/client-sns");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const credentials = fromIni({ profile: "default", configFilepath: "./aws-conf/credentials" });
const configFile = fs.readFileSync("./aws-conf/config.json", 'utf-8');
const config = JSON.parse(configFile);
const serviceAccount = require('./firebase-conf/key.json');
const cors = require("cors")({ origin: true });
const app = admin.initializeApp({
    credential:  admin.credential.cert(serviceAccount), 
    databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com"
});
const snsClient = new SNSClient({
    region: config.region,
    credentials: credentials,
}); 
/**Création d'un nouveau Topics pour l'envoie de SMS **/
exports.createTopic = functions.https.onRequest((req, res) => {   
    let defaultDatabase = app.database();
    const ref_restaurants = defaultDatabase.ref(`restaurants_${enseigne}_${restaurant}/${enseigne}/${restaurant}`);
    const ref_get_num_top = defaultDatabase.ref(`restaurants_${enseigne}_${restaurant}/${enseigne}/${restaurant}/num_topics`);
    const restaurant = req.query.restaurant;
    const prop = req.query.prop;
    const topic_name = req.query.topic_name;
    const id = `${prop}_${restaurant}_${topic_name}`;
    const input = { // CreateTopicInput
        Name: topic_name, // required
        Tags: [ // TagList
          { // Tag
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
          })
        })
      }
    })
});


/**  Mise en place d'un abonnement des à un topic par les clients */
exports.subscribeClient = functions.https.onRequest((req, res) => {

});

/** Envoie e message aux personnes abonnés à un topic */
exports.sendMessage = functions.https.onRequest((req, res) => {

});  