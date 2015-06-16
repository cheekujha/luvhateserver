module.exports = (function(){
	var gcm = require('node-gcm');
	var NotificationService = {
		sendNotification : sendNotification
	};

	function sendNotification(receiverId, callback){
		var message = new gcm.Message();
 
		//API Server Key
		var sender = new gcm.Sender('AIzaSyCOfCDtLqax46n90EqlLoDu5SYIGkOShJg');
		var registrationIds = [];
		 
		// Value the payload data to send...\
		message.addData('message',"But Which One???");
		// message.addData('message',"\u270C Peacadase, Love \u2764 and PhoneGap \u2706!");
		message.addData('title','Yeah! Count Increased....' );
		message.addData('msgcnt','3'); // Shows up in the notification in the status bar
		// message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
		// message.collapseKey = 'demo';
		message.delayWhileIdle = false; //Default is false
		message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
		// message.dryRun = true;
		// At least one reg id required
		// registrationIds.push(receiverId);
		registrationIds = receiverId;
		console.log("......................................",registrationIds);
		/**
		 * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
		 */
		sender.send(message, registrationIds, 4, function (err, result) {
			if(err){
				callback && callback(false, false);
			}else{
				if(result.canonical_ids){
					callback && callback(true, true, result.results, receiverId);
				}else{
					callback && callback(true, false, result.results, receiverId);
				}
				
			}
	    console.log(result);
		});
	} 

	return NotificationService;
}());