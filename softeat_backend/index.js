const mail = require('./mail.js');  
const sms = require('./sms.js'); 
const webhook = require('./webhook.js'); 
exports.sendMail = mail.sendMail;  
exports.createTopic = sms.createTopic;
exports.subscribeClient = sms.subscribeClient;
exports.sendMessage = sms.sendMessage;
exports.webhook = webhook.webhook; 