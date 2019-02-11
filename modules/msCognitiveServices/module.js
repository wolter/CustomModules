let https = require('https');
/**
 * finds spelling mistakes and predicts the correct word
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The text to check
 * @arg {Select[ar,zh-CN,zh-HK,zh-TW,da,nl-BE,nl-NL,en-AU,en-CA,en-IN,en-ID,en-MY,en-NZ,en-PH,en-ZA,en-GB,en-US,fi,fr-BE,fr-CA,fr-FR,fr-CH,de-AT,de-DE,de-CH,it,ja,ko,no,pl,pt-BR,pt-PT,ru,es-AR,es-CL,es-MX,es-ES,es-US,sv,tr]} `language` The texts language
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function spellCheck(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.text)
        return Promise.reject("No text defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        let host = 'api.cognitive.microsoft.com';
        let path = '/bing/v7.0/spellcheck';
        // NOTE: Replace this example skey with a valid subscription key (see the Prequisites section above). Also note v5 and v7 require separate subscription keys.
        let key = args.secret.key;
        let mkt = args.language;
        let mode = "proof";
        let text = args.text;
        let query_string = "?mkt=" + mkt + "&mode=" + mode;
        let request_params = {
            method: 'POST',
            hostname: host,
            path: path + query_string,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': text.length + 5,
                'Ocp-Apim-Subscription-Key': key,
            }
        };
        let response_handler = function (response) {
            let body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                result = JSON.parse(body);
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            });
            response.on('error', function (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            });
        };
        let req = https.request(request_params, response_handler);
        req.write("text=" + text);
        req.end();
    });
}
// You have to export the function, otherwise it is not available
module.exports.spellCheck = spellCheck;
/**
 * recognize the language of the given sentence
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The text to check
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function recognizeLanguage(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.text)
        return Promise.reject("No text defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;
        // You must use the same region in your REST API call as you used to obtain your access keys.
        // For example, if you obtained your access keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        // NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
        // a free trial access key, you should not need to change this region.
        let uri = 'westus.api.cognitive.microsoft.com';
        let path = '/text/analytics/v2.0/languages';
        let response_handler = function (response) {
            let body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                // let body__ = JSON.stringify (body_, null, '  ');
                result = JSON.parse(body);
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            });
            response.on('error', function (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            });
        };
        let get_language = function (documents) {
            let body = JSON.stringify(documents);
            let request_params = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };
            let req = https.request(request_params, response_handler);
            req.write(body);
            req.end();
        };
        let documents = { 'documents': [
                { 'id': '1', 'text': args.text }
            ] };
        get_language(documents);
    });
}
// You have to export the function, otherwise it is not available
module.exports.recognizeLanguage = recognizeLanguage;
/**
 * extracts keyphrases from a given sentence
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[en,es,de]} `language` The texts language
 * @arg {CognigyScript} `text` The text to check
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function extractKeyphrases(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.text)
        return Promise.reject("No text defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;
        // You must use the same region in your REST API call as you used to obtain your access keys.
        // For example, if you obtained your access keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        // NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
        // a free trial access key, you should not need to change this region.
        let uri = 'westus.api.cognitive.microsoft.com';
        let path = '/text/analytics/v2.0/keyPhrases';
        let response_handler = function (response) {
            let body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                result = JSON.parse(body);
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            });
            response.on('error', function (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            });
        };
        let get_key_phrases = function (documents) {
            let body = JSON.stringify(documents);
            let request_params = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };
            let req = https.request(request_params, response_handler);
            req.write(body);
            req.end();
        };
        let documents = { 'documents': [
                { 'id': '1', 'language': args.language, 'text': args.text }
            ] };
        get_key_phrases(documents);
    });
}
// You have to export the function, otherwise it is not available
module.exports.extractKeyphrases = extractKeyphrases;
/**
 * finds entities in a given sentence
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[en,es,de]} `language` The texts language
 * @arg {CognigyScript} `text` The text to check
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function namedEntityRecognition(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.text)
        return Promise.reject("No text defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;
        // You must use the same region in your REST API call as you used to obtain your access keys.
        // For example, if you obtained your access keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        // NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
        // a free trial access key, you should not need to change this region.
        let uri = 'westus.api.cognitive.microsoft.com';
        let path = '/text/analytics/v2.1-preview/entities';
        let response_handler = function (response) {
            let body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                result = JSON.parse(body);
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            });
            response.on('error', function (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            });
        };
        let get_entities = function (documents) {
            let body = JSON.stringify(documents);
            let request_params = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };
            let req = https.request(request_params, response_handler);
            req.write(body);
            req.end();
        };
        let documents = { 'documents': [
                { 'id': '1', 'language': args.language, 'text': args.text }
            ] };
        get_entities(documents);
    });
}
// You have to export the function, otherwise it is not available
module.exports.namedEntityRecognition = namedEntityRecognition;
//  * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
/**
 * searches in the bing web search engine. The entire result is stored in the CognigyInput.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `query` The text to check
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function bingWebSearch(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.query)
        return Promise.reject("No query defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;
        https.get({
            hostname: 'api.cognitive.microsoft.com',
            path: '/bing/v7.0/search?q=' + encodeURIComponent(args.query),
            headers: { 'Ocp-Apim-Subscription-Key': accessKey },
        }, res => {
            let body = '';
            res.on('data', part => body += part);
            res.on('end', () => {
                result = JSON.parse(body);
                // if (args.writeToContext) input.actions.addToContext(args.store, result, "simple");
                input.input[args.store] = result;
                resolve(input);
            });
            res.on('error', err => {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                //if (args.writeToContext) input.context.getFullContext()[args.store] = result;
                input.input[args.store] = result;
                resolve(input);
            });
        });
    });
}
// You have to export the function, otherwise it is not available
module.exports.bingWebSearch = bingWebSearch;
//# sourceMappingURL=module.js.map