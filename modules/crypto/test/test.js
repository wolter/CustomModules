const mod = require("../build/module");

const input = {
	input: {},
	context: {
		getFullContext: () => input.context
	}
};

(async () => {
	try {
		let result = await mod.encrypt(input, { "algorithm": "aes-192-cfb", "key": "heltewig", "text": "philipp", "writeToContext": false, "store": "encrypted" });
		let result2 = await mod.decrypt(result, { "algorithm": "aes-192-cfb", "key": "heltewig", "text": input.input.encrypted.result, "writeToContext": false, "store": "decrypted" });
		let result3 = await mod.createHash(result2, { "algorithm": "md5", "key": "heltewig", "text": input.input.decrypted.result, "writeToContext": true, "store": "hash" });
		console.log(JSON.stringify(result3, undefined, 4));
	} catch (err) {
		console.log(err);
	}
})();