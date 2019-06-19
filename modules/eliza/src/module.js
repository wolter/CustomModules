const ElizaBot = require("./elizabot");
const model = require("./elizadata");

/**
 * Elize is a psychotherapist which transforms any input text to a reply. Use an empty input or "GET_STARTED" for an initial message.   
 * 
 * @arg {String} `store` Where to store Elizas memory inside Cognigy context
 */
async function transform(input, args) {

    // If something is wrong, simply reject
    if (!args.store) return Promise.reject("Store not defined or invalid.");

    // A custom node itself isn't persistent, therefore we have to restore the state     
    var eliza = new ElizaBot(false, model);
    eliza.reset();

    // ...restore Eliza's memory 
    var memory = input.context.getContext(args.store);
    if (memory) {
        eliza.mem = memory.mem;
        eliza.lastchoice = memory.lastchoice;
    }

    var reply;
    if (!input.input.text || input.input.text == "GET_STARTED") {
        reply = eliza.getInitial(); // eliza.transform(input.input.text);
    } else {
        reply = eliza.transform(input.input.text);
    }

    // ...remember Eliza's memory 
    memory = {
        mem: eliza.mem,
        lastchoice: eliza.lastchoice,
        reply: reply
    };
    input.context.setContext(args.store, memory);
    
    // ...talk back
    input.actions.say(reply);

    return input;
};

module.exports.transform = transform;