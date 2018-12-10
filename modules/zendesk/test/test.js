var mod = require("../build/module");

const secret = {
        username:  process.env.ZENDESK_USERNAME,
        token:     process.env.ZENDESK_TOKEN,
        remoteUri: process.env.ZENDEK_REMOTEURI
};

const context = {
    getFullContext: () => context
};

(async () => {
    try {
        let result = await mod.getTicket({ "input": {}, "context": context }, { "ticketIsD": 123123123123, "writeToContext": false, "store": "zendesk", "secret": secret });
        console.log(JSON.stringify(result, undefined, 4));
    } catch (err) {
        console.log(err);
    }
})();

(async () => {
    let testTicket = {"ticket": {
        "subject":  "My printer is on fire!",
        "description": "It just started smoking after printing my Alexa song",
        "comment":  { "body": "The smoke is very colorful." },
        "priority": "urgent",
        "requester_id": 372568912132
      }}
    
      let testUser = {"user": {"name": "Han Solo", "email": "han@solo.com"} };
    try {
        let result = await createTicket({}, { "ticket": testTicket, "writeToContext": false, "store": "zendesk" });
        console.log(result);
    } catch (err) {
        console.log(err);
    }
});