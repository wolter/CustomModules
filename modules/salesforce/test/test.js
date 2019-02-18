const mod = require("../module");

const input = {
	input: {},
	context: {
		getFullContext: () => input.context
	}
}

const secret = {
	username: process.env.SALESFORCE_USERNAME,
	password: process.env.SALESFORCE_PASSWORD,
	token: process.env.SALESFORCE_TOKEN
};

(async () => {
	try {
		let result = await mod.SOQLQuery(input, { "soql": "Select id, Accountid, Amount, Account.Name, Createddate, stageName From Opportunity WHERE Account.Name = 'Cognigy GmbH' ORDER BY Account.Name", "writeToContext": false, "store": "teststore", "secret": secret });
		console.log(JSON.stringify(result, undefined, 4));
	} catch (err) {
		console.log(err);
	}
})();