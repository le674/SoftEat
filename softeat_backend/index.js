const mail = require('./mail.js');  
const sms = require('./sms.js'); 
exports.sendMail = mail.sendMail;  
exports.createTopic = sms.createTopic;
exports.subscribeClient = sms.subscribeClient;
exports.sendMessage = sms.sendMessage;