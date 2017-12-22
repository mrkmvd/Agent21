// engine.js

var _controller;


function init(controller) {
	_controller = controller;
	this.initDefaultResponses(_controller);
} 

function initDefaultResponses() {
	_controller.hears(
	  ['tax', 'payroll', 'state', 'federal'], ['direct_message', 'direct_mention', 'mention'],
	  function (bot, message) {
	      bot.reply(message, {attachments: [
	                                {
	                                    "fallback": "Mark: New ticket from Andrea Lee - Ticket #1943: Can't reset my password - https://groove.hq/path/to/ticket/1943",
	                                    "pretext": "New ticket from Andrea Lee",
	                                    "title": "Ticket #1943: Can't reset my password",
	                                    "title_link": "https://groove.hq/path/to/ticket/1943",
	                                    "text": "Help! I tried to reset my password but nothing happened!",
	                                    "color": "#7CD197"
	                                }
	                            ]

	                          });
	 });


	_controller.hears(
	  ['mic', 'test'], ['direct_message', 'direct_mention', 'mention'],
	  function (bot, message) {
	      bot.reply(message, {attachments:[
	                                        {
	                                          title: 'Sorry - I do not have the answer. Would you like me to file a ticket?',
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



}