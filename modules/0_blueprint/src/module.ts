/**
 * Describes the function
 * @arg {JSON} `secret` The configured secret to use
 * @arg {CognigyScript} `arg1` An argument of type CognigyScript
 * @arg {select[option1,option2,option3]} `arg2` An argument of type Select (=Dropdown)
 * @arg {Number} `arg3` An argument of type Number
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function function1(input: IFlowInput, args: { secret: CognigySecret, arg1: string, arg2: string, arg3: number, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	// Check if secret exists and contains correct parameters  
	if (!args.secret || !args.secret.token) return Promise.reject("Secret not defined or invalid.");

	// check if necessary arguments are present
	if (!args.arg1 || !args.arg2) return Promise.reject("Arg1 or Arg2 not provided.");

	// Always return a Promise
	// A resolved Promise MUST return the input object
	// A rejected Promise will stop Flow execution and show an error in the UI, but not the channel
	return new Promise((resolve, reject) => {
		let result = {}
		// if there is an error, handle it according to the best practice guide
		if (args.arg1 === "error") {
			// here we're emulating an error. Usually this would come from a third party service or function
			const err = new Error("An error");
			// depending on whether the Flow editor wants to stop on error or not, either reject a Promise
			// or write the error to the result buffer
			if (args.stopOnError) { reject(err); return; }
			else result = { "error": err.message };
		} else {
			result = {
				arg1: args.arg1,
				arg2: args.arg2,
				arg3: args.arg3
			};
		}

		// if not rejected before, write the result buffer to the Context or Input object
		if (args.writeToContext) input.context.getFullContext()[args.store] = result;
		else input.input[args.store] = result;
		resolve(input);
	});
}

// You have to export the function, otherwise it is not available
module.exports.function1 = function1;