const zendesk = require('node-zendesk');

/**
 * Executes a query against Zendesk
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `query` The query to execute
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function query(input: IFlowInput, args: { secret: CognigySecret, query: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.secret || !args.secret.username || !args.secret.token || !args.secret.remoteUri) return Promise.reject("Secret not defined or invalid.");
	if (!args.query) return Promise.reject("No query defined.");

	const client = zendesk.createClient({
		username: args.secret.username,
		token: args.secret.token,
		remoteUri: args.secret.remoteUri
	});

	return new Promise((resolve, reject) => {
		client.search.query(args.query, (err, statusCode, body, response, res) => {
			let result = {};
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = body;
			if (args.writeToContext) input.context.getFullContext()[args.store] = result;
			else input.input[args.store] = result;
			resolve(input);
		});
	});
}

/**
 * Retrieves a ticket from Zendesk
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Number} `ticketID` ID of the ticket to request
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getTicket(input: IFlowInput, args: { secret: CognigySecret, ticketID: number, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.secret || !args.secret.username || !args.secret.token || !args.secret.remoteUri) return Promise.reject("Secret not defined or invalid.");
	if (!args.ticketID) return Promise.reject("No ticketID defined.");

	const client = zendesk.createClient({
		username: args.secret.username,
		token: args.secret.token,
		remoteUri: args.secret.remoteUri
	});

	return new Promise((resolve, reject) => {
		client.tickets.show(args.ticketID, (err, statusCode, body, response, res) => {
			let result = {};
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = body;

			if (args.writeToContext) input.context.getFullContext()[args.store] = result;
			else input.input[args.store] = result;
			resolve(input);
		});
	});
}
/**
 * Updates a ticket in Zendesk
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Number} `ticketID` ID of the ticket to update
 * @arg {JSON} `ticket` JSON of the ticket to update
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function updateTicket(input: IFlowInput, args: { secret: CognigySecret, ticketID: number, ticket: any, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.secret || !args.secret.username || !args.secret.token || !args.secret.remoteUri) return Promise.reject("Secret not defined or invalid.");
	if (!args.ticketID) return Promise.reject("No ticketID defined.");
	if (!args.ticket) return Promise.reject("No ticket defined.");

	const client = zendesk.createClient({
		username: args.secret.username,
		token: args.secret.token,
		remoteUri: args.secret.remoteUri
	});

	return new Promise((resolve, reject) => {
		client.tickets.update(args.ticketID, args.ticket, (err, statusCode, body, response, res) => {
			let result = {};
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = body;

			if (args.writeToContext) input.context.getFullContext()[args.store] = result;
			else input.input[args.store] = result;
			resolve(input);
		});
	});
}

/**
 * Creates a ticket in Zendesk
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {JSON} `ticket` JSON of the ticket to create
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function createTicket(input: IFlowInput, args: { secret: CognigySecret, ticket: { ticket: { subject: string, description: string, comment: { body: string }, priority: string, requester_id: number } }, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.secret || !args.secret.username || !args.secret.token || !args.secret.remoteUri) return Promise.reject("Secret not defined or invalid.");
	if (!args.ticket) return Promise.reject("No ticket defined.");

	const client = zendesk.createClient({
		username: args.secret.username,
		token: args.secret.token,
		remoteUri: args.secret.remoteUri
	});

	// check if no requester has been set
	if (!args.ticket.ticket.requester_id) return Promise.reject("No requester defined for ticket");

	return new Promise((resolve, reject) => {
		client.tickets.create(args.ticket, (err, statusCode, body, response, res) => {
			let result = {};
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = res;

			if (args.writeToContext) input.context.getFullContext()[args.store] = result;
			else input.input[args.store] = result;
			resolve(input);
		});
	});
}

/**
 * Creates a user in Zendesk
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {JSON} `user` Data of the user to create
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function createUser(input: IFlowInput, args: { secret: CognigySecret, user: { "user": any }, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.secret || !args.secret.username || !args.secret.token || !args.secret.remoteUri) return Promise.reject("Secret not defined or invalid.");
	if (!args.user) return Promise.reject("No user defined.");

	const client = zendesk.createClient({
		username: args.secret.username,
		token: args.secret.token,
		remoteUri: args.secret.remoteUri
	});

	return new Promise((resolve, reject) => {
		client.users.create(args.user, (err, statusCode, body, response, res) => {
			let result = {};
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = body;

			if (args.writeToContext) input.context.getFullContext()[args.store] = result;
			else input.input[args.store] = result;
			resolve(input);
		});
	});
}

module.exports.query = query;
module.exports.getTicket = getTicket;
module.exports.updateTicket = updateTicket;
module.exports.createTicket = createTicket;
module.exports.createUser = createUser;