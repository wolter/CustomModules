const mod = require("../build/module");

const input = {
	input: {},
	context: {
		getFullContext: () => input.context
	}
}

const args = {
	"options": {
		method: 'POST',
		uri: 'http://requestbin.fullcontact.com/1hcuify1',
		body: {
			some: 'payload'
		},
		json: true // Automatically stringifies the body to JSON
	},
	"writeToContext": false,
	"store": "req",
	"stopOnError": true
};

(async () => {
	try {
		let result = await mod.request(input, args);
		console.log(JSON.stringify(result, undefined, 4));
	} catch (err) {
		console.log(err);
	}
})();