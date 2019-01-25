const jsforce = require('jsforce');
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `soql` 1 The SOQL Query
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function SOQLQuery(input, args) {
    // Check if secret exists and contains correct parameters  
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.soql)
        return Promise.reject("No SOQL Query defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        var conn = new jsforce.Connection();
        conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
            if (err) {
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
            }
            else {
                conn.query(args.soql, function (err, res) {
                    if (err) {
                        if (args.stopOnError) {
                            reject(err.message);
                            return;
                        }
                        else
                            result = { "error": err.message };
                    }
                    else
                        result = res;
                    if (args.writeToContext)
                        input.context.getFullContext()[args.store] = result;
                    else
                        input.input[args.store] = result;
                    resolve(input);
                });
            }
        });
    });
}
// You have to export the function, otherwise it is not available
module.exports.SOQLQuery = SOQLQuery;
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to create
 * @arg {JSON} `info` The information as JSON
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function create_entity(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.info)
        return Promise.reject("No Account Name defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        var conn = new jsforce.Connection();
        conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
            if (err) {
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
            }
            else {
                // Single record creation
                conn.sobject(args.option).create(args.info, function (err, ret) {
                    if (err) {
                        if (args.stopOnError) {
                            reject(err.message);
                            return;
                        }
                        else
                            result = { "error": err.message };
                    }
                    else
                        result = res;
                    if (args.writeToContext)
                        input.context.getFullContext()[args.store] = result;
                    else
                        input.input[args.store] = result;
                    resolve(input);
                });
            }
        });
    });
}
// You have to export the function, otherwise it is not available
module.exports.create_entity = create_entity;
//# sourceMappingURL=module.js.map