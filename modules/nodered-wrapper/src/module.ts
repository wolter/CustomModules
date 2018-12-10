import { CognigyREDWrapper, _instantiateModule, _handleREDModule } from './cognigyREDWrapper';

/**
 * Describes the function
 * @arg {Number} `low` Low boundary
 * @arg {Number} `high` High boundary
 * @arg {Boolean} `inte` Is Integer or not
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function random(input: IFlowInput, args: { low: number, high: number, inte: boolean, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // What NodeRED module was installed?
  const NODERED_MODULE = "node-red-node-random";

  // which function
  const NODERED_NODE = "random";

  // type name
  const NODERED_TYPE = "random";

  // Always return a Promise
  return new Promise((resolve, reject) => {
    _handleREDModule(NODERED_MODULE, NODERED_NODE, NODERED_TYPE, input, args, resolve, reject);
  });
}

/**
 * Microsoft Cognitive Services Sentiment Analysis
 * @arg {CognigySecret} `secret` Access key
 * @arg {select[detectlanguage,keyphrases,sentiment]} `operation` The Textanalytics Operation to execute
 * @arg {CognigyScript} `text` Text to analyse
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function textanalytics(input: IFlowInput, args: { secret: CognigySecret, operation: string, text: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");

  // What NodeRED module was installed?
  const NODERED_MODULE = "node-red-contrib-cognitive-services";

  // which function
  const NODERED_NODE = "textanalytics";

  // type name
  const NODERED_TYPE = "Text Analytics";

  // Always return a Promise
  return new Promise((resolve, reject) => {
    _handleREDModule(NODERED_MODULE, NODERED_NODE, NODERED_TYPE, input, args, resolve, reject);
  });
}

// You have to export the function, otherwise it is not available
module.exports.random = random;
module.exports.textanalytics = textanalytics;