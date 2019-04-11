const axios = require('axios')

/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to query
 * @arg {CognigyScriptArray} `columns` The columns you want to show
 * @arg {Number} `limit` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GETFromTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, columns: string[], limit: number, stopOnError: boolean, store: string}): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password) return Promise.reject("Secret not defined or invalid.");
    if (!args.tableName) return Promise.reject("No table name defined.");

    return new Promise((resolve, reject) => {
        let result = {};

        axios.get(`https://dev66923.service-now.com/api/now/table/${args.tableName}?sysparm_fields=${args.columns}&sysparm_limit=${args.limit}`, {
            headers: {
                'Allow': 'application/json'
            },
            auth: {
                username: args.secret.username,
                password: args.secret.password
            }
        })
            .then(function (response) {
                result = response.data.result
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch(function (error) {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
    });
}

module.exports.GETFromTable = GETFromTable;

