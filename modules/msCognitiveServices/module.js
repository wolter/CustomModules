let https = require('https');
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The text to check
 * @arg {Select[de-DE,en-US]} `language` The texts language
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
//# sourceMappingURL=module.js.map