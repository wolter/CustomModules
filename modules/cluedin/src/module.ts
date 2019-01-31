const GraphQL = require('graphql-client');

/**
 * Executes a query against Cluedin
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `query` The query to execute in GraphQL
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function query(input: IFlowInput, args: { secret: CognigySecret, query: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.secret || !args.secret.url || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
	if (!args.query) return Promise.reject("No graphQL query defined.");
	const client = new GraphQL({
		url: args.secret.url,
		headers: {
			Authorization: 'Bearer ' + args.secret.token
		}
	});

	return new Promise((resolve, reject) => {
		client.query(`${args.query}`, null, function (req, res) {
			if (res.status === 401) {
				if (args.stopOnError) { reject(res.statusText); return; }
				else {
					let result = { "error": "401 - " + res.statusText };
					if (args.writeToContext) input.context.getFullContext()[args.store] = result;
					else input.input[args.store] = result;
					resolve(input);
				}
			}
		})
			.then(function (res) {
				if (args.writeToContext) input.context.getFullContext()[args.store] = res;
				else input.input[args.store] = res;
				resolve(input);
			})
			.catch(function (err) {
				if (args.stopOnError) { reject(err); return; }
				else {
					let result = { "error": err };
					if (args.writeToContext) input.context.getFullContext()[args.store] = result;
					else input.input[args.store] = result;
					resolve(input);
				}
			});
	});
}

module.exports.query = query;