var Botkit = require('botkit');
var fs = require('fs'); 
var apiai = require('apiai');
var aiapp = apiai("9a46701ea55849c3b17d23df1622f75b");
var firebase = require('./firebase.js');
const engine = require('./engine/engine');
var controller = Botkit.slackbot({debug: false});
var SLACKTOKEN="";

/*if (!process.env.slack_token_path) {
  console.log('Error: Specify slack_token_path in environment')
  process.exit(1)
}*/

//fs.readFile(process.env.slack_token_path, function (err, data) {
fs.readFile("slack-token", function (err, data) {  
  if (err) {
    console.log('Error: Specify token in slack_token_path file')
    process.exit(1)
  }
  data = String(data)
  data = data.replace(/\s/g, '')
  SLACKTOKEN=data;
  controller
    .spawn({token: data})
    .startRTM(function (err) {
      if (err) {
        throw new Error(err)
      }
    })
})
initFireBase();

function initFireBase(){

  firebase.init();
  firebase.writeUserData(getBotUserInfo(),"A");
  
}


function getBotUserInfo(){
  return {
    'userId':'Agent21',
    'teamId':'teamId',
    'email':'email',
    'profileImage':'profileImage',
    'displayName':'Agent21'
  };
}


function printObject(object){
  var properties = Object.keys(object);
        for(var i=0; i < properties.length; i++) {
          var prop = properties[i];
          console.log('property: ' + prop + ' | value: '  + object[prop]);
        }
};

function getUserInfo(apiResponse){
  var profile = apiResponse.user.profile
  var userId = apiResponse.user.id;
  var teamId = apiResponse.user.team_id;
  var email = profile.email;
  var profileImage = profile.image_192;
  var displayName = profile.display_name;
  return {
    'userId':userId,
    'teamId':teamId,
    'email':email,
    'profileImage':profileImage,
    'displayName':displayName,
  };
}

// Implementation
  controller.on('direct_message',
    function (bot, message) {

      /*

        A few things need to be done to handle greetings. Hi/Halo/ I am so and so etc. 

      */


        console.log("message: " + message);
        
        // Debug info
        var properties = Object.keys(message);
        for(var i=0; i < properties.length; i++) {
          var prop = properties[i];
          console.log('property: ' + prop + ' | value: '  + message[prop]);
        }

        var request = aiapp.textRequest(message.text, {
            sessionId: 'dc8561d8540244f5a9bf5c7a8983b085'
        });
        console.log(message['user']);
        var messageKey = firebase.storeMessage(message);
        bot.api.users.info({"token":SLACKTOKEN,"user":message['user']},function(err,response){
          var userInfo = getUserInfo(response);

          //Should not always make a write call maybe expensive??
          firebase.writeUserData(userInfo,"E");
         
        });

          
        request.on('response', function(response) {
            console.log("api.ai success!")
            console.log(response);

            bot.reply(message, {text:response.result.fulfillment.speech,attachments:[
                                              {
                                                title: response.result.fulfillment.speech,
                                                callback_id: messageKey,
                                                attachment_type: 'default',
                                                actions: [
                                                   {
                                                      name:'yes',
                                                      text: 'Yes',
                                                      value: 'yes',
                                                      type: 'button',
                                                   },
                                                   {
                                                       name:'no',
                                                       text: 'No',
                                                       value: 'no',
                                                       type: 'button',
                                                   },{
                                                    name:'Start conversation',
                                                    text:'Start Conversation',
                                                    value:'Start conversation',
                                                    type:'button',
                                                   }
                                                ]
                                              }
                                            ]
                              });   
            // Import Admin SDK
            //Write the response back to the firebase.
            console.log(printObject(bot.config));
            firebase.storeAPIAIResponseToMessage(response,messageKey,'Agent21');
            //We will need which system the question came from

        });

        request.on('error', function(error) {
            console.log("api.ai fail!")
            console.log(error);
        });

        request.end();
 });

  