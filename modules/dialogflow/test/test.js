var mod = require("../build/module");

const input = {
    input: {
        "sessionId": "cognigysession" + Math.round((Math.random()*10000000000)).toString()
    },
    context: {
        getFullContext: () => input.context
    }
}

const secret = {
    token: process.env.DIALOGFLOW_TOKEN
};

(async () => {
    try {
        let result = await mod.textRequest(input, { "text": "I want to order a coffee and a coke", "mode": "overwrite", "store": "teststore", "secret": secret });
        console.log(JSON.stringify(result, undefined, 4));
    } catch (err) {
        console.log(err);
    }
})(); 