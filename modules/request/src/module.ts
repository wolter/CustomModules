import * as rp from 'request-promise';

/**
 * Sends HTTP Requests
 * @arg {JSON} `options` Request options
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function request(input: IFlowInput, args: { options: any, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	// check if necessary arguments are present
	if (!args.options || typeof args.options !== "object" || !args.options.uri) return Promise.reject("No valid request options set.");

	// Always return a Promise
	return new Promise((resolve, reject) => {
		let result = {}

		// request
		rp(args.options)
			.then((res) => {
				result = res;
				return result;
			})
			.catch((err) => {
				if (args.stopOnError) { reject(err.message); return null; }
				else result = { "error": err.message };
				return result;
			})
			.then((x) => {
				if (x) {
					if (args.writeToContext) input.context.getFullContext()[args.store] = result;
					else input.input[args.store] = result;
					resolve(input);
				}
			});
	});
}

// You have to export the function, otherwise it is not available
module.exports.request = request;