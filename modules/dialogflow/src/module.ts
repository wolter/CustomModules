import * as dialogFlow from 'apiai';

/**
 * Retrieves NLP Output from DialogFlow
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The text to pass to DialogFlow
 * @arg {select[overwrite,input,context]} `mode` 0 Whether to overwrite the input object or write to Input/Context
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function textRequest(input: IFlowInput, args: { secret: CognigySecret, text: string, mode: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters  
  if (!args.secret || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  
  // check if necessary arguments are present
  if (!args.text ) return Promise.reject("Text not provided.");

  // Always return a Promise
  return new Promise((resolve, reject) => {
    let result = {}
    
    try {
      const app = dialogFlow(args.secret.token);
 
      const request = app.textRequest(args.text, {
        sessionId: input.input.sessionId
      });
   
      request.on('response', function(res) {
        switch (args.mode) {
          case "context": 
            input.context.getFullContext()[args.store] = res;
            break;
          case "input": 
            input.input[args.store] = res;
            break;
          case "overwrite": 
            input.input.intent = res && res.result && res.result.metadata && res.result.metadata.intentName ? res.result.metadata.intentName : '';
            input.input.intentScore = res && res.result && res.result.score ? res.result.score : '';
            input.input.slots = res && res.result && res.result.parameters;
            break;
        }
        
        resolve(input);
      });
   
      request.on('error', function(err) {
        if (args.stopOnError) { reject(err.message); return; }
        else result = { "error": err.message };
  
        if (args.mode === "context") input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      });

      request.end();
    } catch (err) {
      if (args.stopOnError) { reject(err.message); return; }
      else result = { "error": err.message };

      if (args.mode === "context") input.context.getFullContext()[args.store] = result;
      else input.input[args.store] = result;
      resolve(input);
    }
  });
}

// You have to export the function, otherwise it is not available
module.exports.textRequest = textRequest;