var firebase = require('firebase')

module.exports = {

init : function() {

	 var config={
	    apiKey: "AIzaSyAgyMw1Hr-q5-v3cd5klal0luRAwpcCyug",
	    authDomain: "agent21-165007.firebaseapp.com",
	    databaseURL: "https://agent21-165007.firebaseio.com",
	    projectId: "agent21-165007",
	    storageBucket: "agent21-165007.appspot.com",
	      messagingSenderId: "482518908870",
	};

	firebase.initializeApp(config);
	return firebase;

},

writeUserData:function (userInfo,userType) {
  console.log(userInfo.userId);
  firebase.database().ref('users/' + userInfo.userId).set({
    email: userInfo.email,
    avatar : userInfo.profileImage,
    teamId:userInfo.teamId,
    userId:userInfo.userId,
    name:userInfo.displayName,
    userType:userType
  });
},

storeMessage:function(message){
	console.log(message);
	var messageData={
		createdBy :message['user'],
		text :message['text'],
		timeStamp :message['ts'],
		teamId:message['team'],
	};

	var messageKey =firebase.database().ref('messages/').push().key;
	messageData.originalMessageId=messageKey;
	var newMessage={};
	newMessage['messages/'+messageKey]= messageData;
	firebase.database().ref().update(newMessage);
	return messageKey;

},

storeAPIAIResponseToMessage(response,originalMessageId,userId){
	var responseData={
		text:response.result.fulfillment.speech,
		isBotReply:true,
		originalMessageId:originalMessageId,
		createdBy:userId
	};
	console.log(originalMessageId);
	var responseKey = firebase.database().ref('messages/').push().key;

	var reply = {};
	reply['messages/'+responseKey]=responseData;
	firebase.database().ref().update(reply);

}



};

