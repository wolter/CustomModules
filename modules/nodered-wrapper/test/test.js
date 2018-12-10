/*
const NODERED_NODE = "node-red-node-random";
const params = {
    low: 10,
    high: 100,
    inte: true
};


const nodered_package = require(`${__dirname}/../node_modules/${NODERED_NODE}/package.json`);
const EventEmitter = require('events');

class philred extends EventEmitter {
    constructor(credentials) {
        super();
        this.result = {};
        this.credentials = credentials;

        this.nodes = {
            registerType: (name, func) => { this.nodered_func = func; },
            createNode: (a, b) => { }
        };
        this.util ={
            setMessageProperty: (msg,property,value) => {
                this.result[property] = value;
            }
        };
        this.nodered_func = null;
    }

    bindEventListener(...params) {
        this.nodered_func.call(this, ...params);
    }

    send (msg) {
        console.log("SENT: " + JSON.stringify(this.result));
    }

    error ()
}

const RED = new philred();

let js = null;
Object.keys(nodered_package["node-red"].nodes).forEach((key) => {
    let result = nodered_package["node-red"].nodes[key];
    if (result.endsWith(".js"))
        js = result;
});
if (!js) process.exit(0);

const nodered_module = require(`${__dirname}/../node_modules/${NODERED_NODE}/${js}`);
nodered_module(RED);

RED.bindEventListener(params);
RED.emit("input", null);
//# sourceMappingURL=test.js.map
*/

var mod = require("../build/module");

const input = {
    input: {},
    context: {
        getFullContext: () => input.context
    }
};

const secret = {
    key: "98261a0a44b44014a3561386cf92b4a0"
};

const args = { 
    "operation": "keyphrases", 
    "payload": "I had a wonderful trip to Seattle and enjoyed seeing the Space Needle!", 
    "inte": true, 
    "writeToContext": true, 
    "store": "nodered", 
    "secret": secret 
};

/*
(async () => {
    try {
        let result = await mod.random(input, args);
        console.log(JSON.stringify(result, undefined, 4));
    } catch (err) {
        console.log(err);
    }
})(); 
*/


(async () => {
    try {
        let result = await mod.textanalytics(input, args);
        console.log(JSON.stringify(result, undefined, 4));
    } catch (err) {
        console.log(err);
    }
})();