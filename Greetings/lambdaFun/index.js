// this is the handler function which handles the user input 
// you pass it an event which in context passes or fails (line 15)

exports.handler = function(event, context) {
// the event is linked to event.json file

    var request = event.request;
// within the event, you made a request which can be either a launch request which opens the app, an intent which askes Alexa something/to do something or a session ended request which closes the app 
// event.json has a request

    if (request.type === "LaunchRequest") {

        // here you are building the options object to pass into buildResponse in line 32

        let options = {}; // we pass these options into line 32
        options.speechText = "Welcome to Greetings skill. Go ahead and greet your guests.", // we need this in line 44
        // amazon asks you to explain here to the user what they need to do - usually ask them a question or prompt them to do something, otherwise they will need to be reprompted to interact with the skill
        options.repromptText = "Who do you want to say hello to?" // needed in line 52 - not essential
        options.endSession = false;

         // we need to check if the event in context means something to the skill.  If it does it goes onto build the response with the options set up
        context.succeed(buildResponse(options));

    } else if (request.type === "IntentRequest") {

        let options = {};

        if (request.intent.name === "HelloIntent") {
            
            let name = request.intents.slots.FirstName.value;
            // gets the name stored in the slot from the request
            options.speechText = "Hello " + name + ". ";

            // alter the greeting depending on the time of day
            options.speechText += getWish(); 
            options.endSession = true;
            // closes app after this exchange

            context.succedd(buildResponse(options));
        } else {
            // this skill only has one intent - HelloIntent
            context.fail("Unknown intent") 
        }

    } else (request.type === "SessionEndedRequest") {

    } else {
        context.fail("Unknown intent type")
    }
}

function getWish() {
    var myDate = new Date();
    var hours = myDate.getHours();

    if (hours < 0) {
        hours = hours + 24;
        // corrects for 24 hour clock
    }

    if (hours < 12) {
        return "Good Morning. ";
    } else if (hours < 18) {
        return "Good afternoon. ";
    } else {
        return "Good evening. ";
    }
}

function buildResponse(options) {
// this is the function where you determine how the request that has just come in will be handled
// the response object can be found in response.json

    var response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: options.speechText
                // this will refer to the text passed into request as an option - line 14
            },
            shouldEndSession: options.endSession
        }
    };

    if(options.repromptText) {
        response.response.reprompt = {
            // this comes from the response file in the response object, labelled reprompt

        }
    }
}