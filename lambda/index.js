var AWS = require('aws-sdk');
var auth = require('./google-auth-library');
var google = require('./googleapis');

exports.handler = function( event, context ) {
    var say = "";
    var endsession = false;
    var sessionAttributes = {};
    var myText = "";
    var messagesObject = {}
    var messageArray = [];
    
    /*var clientId = '1075751505142-qcq442ge0iacdg2ftce68hsirin6v4bg.apps.googleusercontent.com'
    var apiKey = 'AIzaSyBpvIyuGkTHHVZPjA87g15bbKha1xz9H3o';
    var scopes = 'https://www.googleapis.com/auth/gmail.readonly';
    
    var loadGmailApi2 = function () {
        gapi.client.load('gmail', 'v1', handleClientLoad);
        console.log('loadGmailApi2');

        var handleClientLoad = function () {
        gapi.client.setApiKey(apiKey);
        checkAuth()
        console.log('handleClientLoad');

            var checkAuth = function () {
                gapi.auth.authorize({
                    client_id: clientId,
                    scope: scopes,
                    immediate: true
                }, handleAuthResult);
                console.log('checkAuth');

                var handleAuthResult = function (authResult) {
                    if(authResult && !authResult.error) {
                        loadGmailApi();
                        $('#authorize-button').remove();
                        $('.table-inbox').removeClass("hidden");
                    }
                    console.log('handleAuthResult');

                    var loadGmailApi = function () {
                        gapi.client.load('gmail', 'v1', displayInbox);
                        console.log('loadGmailApi');

                        var displayInbox = function () {
                            var request = gapi.client.gmail.users.messages.list({
                                'userId': 'cjdellomes@gmail.com',
                                'q': 'label:inbox label:unread category:primary ',
                                'maxResults': 10
                            });
                        
                            request.execute(function(response) {
                                messagesObject = response;
                                response.messages.forEach(function() {
                                    var messageRequest = gapi.client.gmail.users.messages.get({
                                        'userId': 'cjdellomes@gmail.com',
                                        'id': this.id
                                    });
                                    
                                    
                                    messageRequest.execute(function(response) {
                                        
                                        console.log(response);
                                        messageArray.push(response);
                                        
                                        
                                    });
                                });
                            });
                            console.log('displayInbox');

                            Respond(  // Respond with normal speech only
                                function() {context.succeed( {sessionAttributes: sessionAttributes, response: response } ); }
                            );
                        }
                    }
                }
            }
        }
    }*/

    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }

    if (event.request.type === "LaunchRequest") {
 
        say = "Welcome! You have 1 new messages.";
        
    } else {
        var IntentName = event.request.intent.name;
        
        switch(IntentName) {
            
            case "ReadMailIntent":
                say = "Email from Peyton Cross sent June 12. Subject, AngelHack. Message: Are we meeting up for AngelHack 2016?";
                break;
            
            case "ReplyIntent":
                say = "Ok. What would you like to say?";
                break;
                
            case "StarIntent":
                myText  = event.request.intent.slots.Word.value;
                say = "Message sent. Continue reading messages?";
                break;
                
            case "DashboardIntent":
                say = "You have 0 new emails";
                break;
            
            case "EndIntent":
                say = "Goodbye.";
                endsession = true;
                break;
            
            default:
                say = "I'm sorry. I didn't understand you."
            
        }

        if (IntentName === "ISeeIntent") {

            if(event.request.intent.slots.Color.value && event.request.intent.slots.Animal.value) {

                myColor  = event.request.intent.slots.Color.value;
                myAnimal = event.request.intent.slots.Animal.value;

                if (!sessionAttributes.myList)  {sessionAttributes.myList = []; }

                sessionAttributes.myList.push(myColor + " " + myAnimal);

                say = myColor + " " + myAnimal + ", " + myColor + " " + myAnimal +  ", what do you see? ";

            } else {
                say = "you can say things like, I see a red bird looking at me";
            }

        }
    }

    var response = {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + say + "</speak>"
        },
        reprompt: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>Please try again. " + say + "</speak>"
            }
        },
        card: {
            type: "Simple",
            title: "My Card Title",
            content: "My Card Content, displayed on the Alexa Companion mobile App or alexa.amazon.com"
        },

        shouldEndSession: endsession
    };



    Respond(  // Respond with normal speech only
        function() {context.succeed( {sessionAttributes: sessionAttributes, response: response } ); }
    );


    // --------- Uncomment for AWS SQS Integration -------------------------------------------------
    //RespondSendSqsMessage(  // use this to send a new message to an SQS Queue
    //    {
    //        MessageBody:  "https://www.google.com/search?tbm=isch&q=" + myColor + "%20" + myAnimal  // Message Body (Image Search URL)
    //    },
    //     function() {context.succeed( {sessionAttributes: sessionAttributes, response: response } ); }
    //);


    // --------- Uncomment for AWS IOT Integration -------------------------------------------------
    //RespondUpdateIotShadow(  // use this to update an IoT device state
    //    {
    //        IOT_THING_NAME: "MyDevice",
    //        IOT_DESIRED_STATE: {"pump":1}  // or send spoken slot value detected
    //    },
    //    function() {context.succeed( {sessionAttributes: sessionAttributes, response: response } ); }
    //);


};

// -----------------------------------------------------------------------------

function Respond(callback) {
    callback();
}

function RespondSendSqsMessage(sqs_params, callback) {

    sqs_params.QueueUrl = "https://sqs.us-east-1.amazonaws.com/333304289684/AlexaQueue";

    var sqs = new AWS.SQS({region : 'us-east-1'});


    sqs.sendMessage(sqs_params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log("success calling sqs sendMessage");

            callback();  // after performing SQS send, execute the caller's context.succeed function to complete
        }
    });

}


function RespondUpdateIotShadow(iot_config, callback) {

    iot_config.IOT_BROKER_ENDPOINT      = "https://A2ESHRCP6U0Y0C.iot.us-east-1.amazonaws.com".toLowerCase();
    iot_config.IOT_BROKER_REGION       = "us-east-1";


    var iotData = new AWS.IotData({endpoint: iot_config.IOT_BROKER_ENDPOINT});

    //Set the pump to 1 for activation on the device
    var payloadObj={ "state":
    { "desired":
    iot_config.IOT_DESIRED_STATE // {"pump":1}
    }
    };

    //Prepare the parameters of the update call
    var paramsUpdate = {
        "thingName" : iot_config.IOT_THING_NAME,
        "payload" : JSON.stringify(payloadObj)
    };
    // see results in IoT console, MQTT client tab, subscribe to $aws/things/YourDevice/shadow/update/delta

    //Update Device Shadow
    iotData.updateThingShadow(paramsUpdate, function(err, data) {
        if (err){
            console.log(err.toString());
        }
        else {
            console.log("success calling IoT updateThingShadow");
            callback();  // after performing Iot action, execute the caller's context.succeed function to complete
        }
    });



}