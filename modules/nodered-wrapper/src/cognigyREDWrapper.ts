import * as EventEmitter from 'events';

/**
 * Cognigy Wrapper Class for NodeRed base object
 */
export class CognigyREDWrapper extends EventEmitter {
    private credentials: any; // equal to Cognigy Secrets
    private result: any; // sink for the results
    private nodes: any;
    private util: any;
    private nodered_func: any;
    private funcs: Map<string, any>;

    constructor(credentials) {
      super();
      this.result = {};
      this.credentials = credentials;
      this.funcs = new Map();

      this.nodes = {
          registerType: (name, func) => { this.funcs.set(name, func) },
          createNode: (a, b) => { }
      };
      this.util ={
          setMessageProperty: (msg,property,value) => {
              this.result[property] = value;
          }
      };
      this.nodered_func = null;
  }

  bindEventListener(name, ...params) {
      try {
          this.funcs.get(name).call(this, ...params);
      } catch (err) {
          this.emit("cognigyError", err);
      }
  }

  // final function called by NodeRED modules. Sends output back to Cognigy
  send (msg) {
      if (msg.payload && !this.result.payload) this.result.payload = msg.payload;
      if (msg.detail && !this.result.detail) this.result.detail = msg.detail;
      this.emit("cognigyOutput", this.result);
  }

  // called when NodeRED finds an error
  error(err) {
      this.emit("cognigyError", err);
  }

  status() { }
}

/**
 * Finds a module and instantiates it
 * @param NODERED_MODULE The name of the module
 * @param NODERED_NODE The name of the node (in case there are several)
 * @param RED An instance of the wrapper class
 */
export function _instantiateModule(NODERED_MODULE, NODERED_NODE, RED) {
  const nodered_package = require(`${__dirname}/../node_modules/${NODERED_MODULE}/package.json`);
  let js = null;
  
  Object.keys(nodered_package["node-red"].nodes).forEach((key) => {
    if (key === NODERED_NODE) js = nodered_package["node-red"].nodes[key];
  });
  if (!js) process.exit(0);

  const nodered_module = require(`${__dirname}/../node_modules/${NODERED_MODULE}/${js}`);
  nodered_module(RED);
}

/**
 * Executes the call
 * @param NODERED_MODULE The name of the module
 * @param NODERED_NODE The name of the node (in case there are several)
 * @param NODERED_TYPE The type of the call (name of the registered Node)
 * @param input Cognigy Input Object
 * @param args Cognigy Node Args
 * @param resolve Promise.resolve of Cognigy Module
 * @param reject Promise.reject of Cognigy Module
 */
export function _handleREDModule(NODERED_MODULE, NODERED_NODE, NODERED_TYPE, input, args, resolve, reject) {
    // Instantiate Cognigy NodeRed Wrapper
    const RED = new CognigyREDWrapper(args.secret);

    // try to instantiate it
    _instantiateModule(NODERED_MODULE, NODERED_NODE, RED);

    let result = {}

    // bind args to the function
    RED.bindEventListener(NODERED_TYPE, args);

    // handle output when it arrives
    RED.on("cognigyOutput", function(output) {
      if (output.error) {
        if (args.stopOnError) { reject(output.error); return; }
        else result = { "error": output.error };
      } else {
        result = output;
      }
  
      // if not rejected before, write the result buffer to the Context or Input object
      if (args.writeToContext) input.context.getFullContext()[args.store] = result;
      else input.input[args.store] = result;
      resolve(input);
    });

    // handle errors
    RED.on("cognigyError", function(output) {
      if (args.stopOnError) { reject(output.message); return; }
      else result = { "error": output.message };
      
      // if not rejected before, write the result buffer to the Context or Input object
      if (args.writeToContext) input.context.getFullContext()[args.store] = result;
      else input.input[args.store] = result;
      resolve(input);
    });

    // simulate input
    RED.emit("input", args);
}