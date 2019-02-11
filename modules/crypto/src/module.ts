import * as crypto from 'crypto';

/**
 * Encrypts text using a given algorithm
 * @arg {select[CAST-cbc,aes-128-cbc,aes-128-cbc-hmac-sha1,aes-128-cfb,aes-128-cfb1,aes-128-cfb8,aes-128-ctr,aes-128-ecb,aes-128-gcm,aes-128-ofb,aes-128-xts,aes-192-cbc,aes-192-cfb,aes-192-cfb1,aes-192-cfb8,aes-192-ctr,aes-192-ecb,aes-192-gcm,aes-192-ofb,aes-256-cbc,aes-256-cbc-hmac-sha1,aes-256-cfb,aes-256-cfb1,aes-256-cfb8,aes-256-ctr,aes-256-ecb,aes-256-gcm,aes-256-ofb,aes-256-xts,aes128,aes192,aes256,bf,bf-cbc,bf-cfb,bf-ecb,bf-ofb,blowfish,camellia-128-cbc,camellia-128-cfb,camellia-128-cfb1,camellia-128-cfb8,camellia-128-ecb,camellia-128-ofb,camellia-192-cbc,camellia-192-cfb,camellia-192-cfb1,camellia-192-cfb8,camellia-192-ecb,camellia-192-ofb,camellia-256-cbc,camellia-256-cfb,camellia-256-cfb1,camellia-256-cfb8,camellia-256-ecb,camellia-256-ofb,camellia128,camellia192,camellia256,cast,cast-cbc,cast5-cbc,cast5-cfb,cast5-ecb,cast5-ofb,des,des-cbc,des-cfb,des-cfb1,des-cfb8,des-ecb,des-ede,des-ede-cbc,des-ede-cfb,des-ede-ofb,des-ede3,des-ede3-cbc,des-ede3-cfb,des-ede3-cfb1,des-ede3-cfb8,des-ede3-ofb,des-ofb,des3,desx,desx-cbc,id-aes128-GCM,id-aes192-GCM,id-aes256-GCM,idea,idea-cbc,idea-cfb,idea-ecb,idea-ofb,rc2,rc2-40-cbc,rc2-64-cbc,rc2-cbc,rc2-cfb,rc2-ecb,rc2-ofb,rc4,rc4-40,rc4-hmac-md5,seed,seed-cbc,seed-cfb,seed-ecb,seed-ofb]} `algorithm` The encryption algorithm to use
 * @arg {CognigyScript} `text` The text to encrypt
 * @arg {CognigyScript} `key` The key to use
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function encrypt(input: IFlowInput, args: { algorithm: string, text: string, key: string, secret: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.text) return Promise.reject("No text defined.");
	if (!args.key) return Promise.reject("No key defined.");
	if (!args.algorithm) return Promise.reject("No algorithm defined.");

	return new Promise((resolve, reject) => {
		let result = {}
		try {
			const cipher = crypto.createCipher(args.algorithm, args.key)
			let crypted = cipher.update(args.text, 'utf8', 'hex')
			crypted += cipher.final('hex');
			result = { "result": crypted };
		} catch (err) {
			if (args.stopOnError) { reject(err); return; }
			else result = { "error": err.message };
		}
		// if not rejected before, write the result buffer to the Context or Input object
		if (args.writeToContext) input.context.getFullContext()[args.store] = result;
		else input.input[args.store] = result;
		resolve(input);
	});
}

/**
 * Decrypts text using a given algorithm
 * @arg {select[CAST-cbc,aes-128-cbc,aes-128-cbc-hmac-sha1,aes-128-cfb,aes-128-cfb1,aes-128-cfb8,aes-128-ctr,aes-128-ecb,aes-128-gcm,aes-128-ofb,aes-128-xts,aes-192-cbc,aes-192-cfb,aes-192-cfb1,aes-192-cfb8,aes-192-ctr,aes-192-ecb,aes-192-gcm,aes-192-ofb,aes-256-cbc,aes-256-cbc-hmac-sha1,aes-256-cfb,aes-256-cfb1,aes-256-cfb8,aes-256-ctr,aes-256-ecb,aes-256-gcm,aes-256-ofb,aes-256-xts,aes128,aes192,aes256,bf,bf-cbc,bf-cfb,bf-ecb,bf-ofb,blowfish,camellia-128-cbc,camellia-128-cfb,camellia-128-cfb1,camellia-128-cfb8,camellia-128-ecb,camellia-128-ofb,camellia-192-cbc,camellia-192-cfb,camellia-192-cfb1,camellia-192-cfb8,camellia-192-ecb,camellia-192-ofb,camellia-256-cbc,camellia-256-cfb,camellia-256-cfb1,camellia-256-cfb8,camellia-256-ecb,camellia-256-ofb,camellia128,camellia192,camellia256,cast,cast-cbc,cast5-cbc,cast5-cfb,cast5-ecb,cast5-ofb,des,des-cbc,des-cfb,des-cfb1,des-cfb8,des-ecb,des-ede,des-ede-cbc,des-ede-cfb,des-ede-ofb,des-ede3,des-ede3-cbc,des-ede3-cfb,des-ede3-cfb1,des-ede3-cfb8,des-ede3-ofb,des-ofb,des3,desx,desx-cbc,id-aes128-GCM,id-aes192-GCM,id-aes256-GCM,idea,idea-cbc,idea-cfb,idea-ecb,idea-ofb,rc2,rc2-40-cbc,rc2-64-cbc,rc2-cbc,rc2-cfb,rc2-ecb,rc2-ofb,rc4,rc4-40,rc4-hmac-md5,seed,seed-cbc,seed-cfb,seed-ecb,seed-ofb]} `algorithm` The encryption algorithm to use
 * @arg {CognigyScript} `text` The text to encrypt
 * @arg {CognigyScript} `key` The key to use
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function decrypt(input: IFlowInput, args: { algorithm: string, text: string, key: string, secret: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.text) return Promise.reject("No text defined.");
	if (!args.key) return Promise.reject("No key defined.");
	if (!args.algorithm) return Promise.reject("No algorithm defined.");

	return new Promise((resolve, reject) => {
		let result = {}
		try {
			const decipher = crypto.createDecipher(args.algorithm, args.key)
			let decrypted = decipher.update(args.text, 'hex', 'utf8')
			decrypted += decipher.final('utf8');
			result = { "result": decrypted };
		} catch (err) {
			if (args.stopOnError) { reject(err); return; }
			else result = { "error": err.message };
		}
		// if not rejected before, write the result buffer to the Context or Input object
		if (args.writeToContext) input.context.getFullContext()[args.store] = result;
		else input.input[args.store] = result;
		resolve(input);
	});
}

/**
 * Creates a hash from text
 * @arg {select[md5,sha,sha1,sha256,sha384]} `algorithm` The hashing algorithm to use
 * @arg {CognigyScript} `text` The text to encrypt
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function createHash(input: IFlowInput, args: { algorithm: string, text: string, secret: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.text) return Promise.reject("No text defined.");
	if (!args.algorithm) return Promise.reject("No algorithm defined.");

	return new Promise((resolve, reject) => {
		let result = {}
		try {
			const hash = crypto.createHash(args.algorithm).update(args.text).digest('hex')
			result = { "result": hash };
		} catch (err) {
			if (args.stopOnError) { reject(err); return; }
			else result = { "error": err.message };
		}
		// if not rejected before, write the result buffer to the Context or Input object
		if (args.writeToContext) input.context.getFullContext()[args.store] = result;
		else input.input[args.store] = result;
		resolve(input);
	});
}

// You have to export the function, otherwise it is not available
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.createHash = createHash;