var Botkit = require('botkit');
var fs = require('fs'); 
var apiai = require('apiai');
var aiapp = apiai("9a46701ea55849c3b17d23df1622f75b");

const engine = require('./engine/engine');

var controller = Botkit.slackbot({debug: false})

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
  controller
    .spawn({token: data})
    .startRTM(function (err) {
      if (err) {
        throw new Error(err)
      }
    })
})

// Implementation
  controller.on('direct_message',
    function (bot, message) {
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

        request.on('response', function(response) {
            console.log("api.ai success!")
            console.log(response);

            bot.reply(message, {attachments:[
                                              {
                                                title: response.result.fulfillment.speech,
                                                callback_id: '123',
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
                                                   }
                                                ]
                                              }
                                            ]
                              });   


            
        });

        request.on('error', function(error) {
            console.log("api.ai fail!")
            console.log(error);
        });

        request.end();
 });
