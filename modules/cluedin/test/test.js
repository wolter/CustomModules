var mod = require("../build/module");

const input = {
	input: {},
	context: {
		getFullContext: () => input.context
	}
};

const query = `
query {
	search(query:"sitecore", pageSize: 1) {
		entries
		{
			id
			name
			entityType
		}
	}
}
`;

const secret = {
	url: process.env.CLUEDIN_URL,
	token: process.env.CLUEDIN_TOKEN
};

(async () => {
	try {
		let result = await mod.query(input, { "query": query, "writeToContext": false, "store": "cluedin", "secret": secret });
		console.log(JSON.stringify(result, undefined, 4));
	} catch (err) {
		console.log(err);
	}
})(); 