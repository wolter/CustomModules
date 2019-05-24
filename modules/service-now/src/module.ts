import axios from 'axios';
import * as http from 'https';
import { networkInterfaces } from 'os';


/**
 * Gets the information of a chosen table
 * @arg {SecretSelect} `secret` 1 The configured secret to use
 * @arg {CognigyScript} `tableName` 1 The name of the table you want to query
 * @arg {CognigyScriptArray} `columns` The columns you want to show
 * @arg {Number} `limit` The limit of the shown results
 * @arg {Boolean} `stopOnError` 1 Whether to stop on error or continue
 * @arg {CognigyScript} `store` 1 Where to store the result
 */
async function GETFromTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, columns?: string[], limit?: number, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, store, stopOnError, columns, limit } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.get(`${instance}/api/now/table/${tableName}`, {
            headers: {
                'Accept': 'application/json'
            },
            auth: {
                username,
                password
            },
            params: {
                sysparm_fields: columns,
                sysparm_limit: limit
            }
        });

        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.GETFromTable = GETFromTable;

/**
 * Inserts a new row into the chosen Service Now table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to edit
 * @arg {JSON} `data` The data of the row you want to add
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function POSTToTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, data: any, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, data, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!data) throw new Error("Data to post not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.post(`${instance}/api/now/table/${tableName}`,
            data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                auth: {
                    username,
                    password
                },
            });

        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.POSTToTable = POSTToTable;


/**
 * Updates a row from the chosen Service Now table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to query
 * @arg {JSON} `data` The updated data for the chosen entry
 * @arg {CognigyScript} `sysId` The id of the entry you want to delete
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function PatchRecordInTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, data: any, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, data, sysId, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!data) throw new Error("Data to post not defined.");
    if (!sysId) throw new Error("Sys Id not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.patch(`${instance}/api/now/table/${tableName}/${sysId}`,
        data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username,
                password
            },
        });

        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.PatchRecordInTable = PatchRecordInTable;


/**
 * Deletes a row from the chosen Service Now table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to query
 * @arg {CognigyScript} `sysId` The id of the entry you want to delete
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function DeleteFromTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, sysId, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!sysId) throw new Error("Sys Id not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.delete(`${instance}/api/now/table/${tableName}/${sysId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username,
                password
            },
        });

        input.actions.addToContext(store, `succefully deleted entry with id: ${sysId}`, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.DeleteFromTable = DeleteFromTable;


/**
 * Gets attachments from Service Now
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `limit` How many results you want to show
 * @arg {CognigyScript} `query` A search query, e.g. 'file_name=attachment.doc'
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GETAttachments(input: IFlowInput, args: { secret: CognigySecret, limit?: string, query?: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.get(`${instance}/api/now/attachment`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username,
                password
            },
            params: {
                sysparm_limit: args.limit,
                sysparm_query: args.query
            }
        });

        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.GETAttachments = GETAttachments;


/**
 * Gets an attachment by Id
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `sysId` The id of the attachment you want to reach
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
function GETAttachmentById(input: IFlowInput, args: { secret: CognigySecret, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.sysId) return Promise.reject("No sysId defined");

    return new Promise((resolve, reject) => {

        axios.get(`${args.secret.instance}/api/now/attachment/${args.sysId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username: args.secret.username,
                password: args.secret.password
            },
        })
            .then((response) => {
                input.context.getFullContext()[args.store] = response.data.result;
                resolve(input);
            })
            .catch((error) => {
                if (args.stopOnError) {
                    reject(error.message); return;
                } else input.context.getFullContext()[args.store] = { "error": error.message };
                resolve(input);
            });
    });
}

module.exports.GETAttachmentById = GETAttachmentById;


/**
 * Posts an attachment to a specific entry in a specific table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to query
 * @arg {CognigyScript} `tableSysId` The id of the entry in the given table where the attachment will be stored
 * @arg {CognigyScript} `fileName` The full filename, e.g. attachment.docx
 * @arg {CognigyScript} `fileLocation` Where the file is stored now, e.g. AWS S3 bucket etc.

 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
function POSTAttachment(input: IFlowInput, args: { secret: CognigySecret, tableName: string, tableSysId: string, fileName: string, fileLocation: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.tableSysId) return Promise.reject("No sysId defined");
    if (!args.fileName) return Promise.reject("No fileName defined");
    if (!args.tableName) return Promise.reject("No table defined");
    if (!args.fileLocation) return Promise.reject("No file location defined");


    return new Promise((resolve, reject) => {

        // get file from location
        const request = http.get(args.fileLocation, (response) => {
            axios.post(`${args.secret.instance}/api/now/attachment/file`,
                response
                , {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    },
                    auth: {
                        username: args.secret.username,
                        password: args.secret.password
                    },
                    params: {
                        table_name: args.tableName,
                        table_sys_id: args.tableSysId,
                        file_name: args.fileName
                    }
                })
                .then((response) => {
                    input.context.getFullContext()[args.store] = response.data.result;
                    resolve(input);
                })
                .catch((error) => {
                    if (args.stopOnError) {
                        reject(error.message); return;
                    } else input.context.getFullContext()[args.store] = { "error": error.message };
                    resolve(input);
                });
        });
    });
}

module.exports.POSTAttachment = POSTAttachment;


/**
 * Deletes an attachment with specific id
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `sysId` The id of the attachment you want to delete
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
function DeleteAttachment(input: IFlowInput, args: { secret: CognigySecret, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.sysId) return Promise.reject("No sysId defined");

    return new Promise((resolve, reject) => {

        axios.delete(`${args.secret.instance}/api/now/attachment/${args.sysId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username: args.secret.username,
                password: args.secret.password
            },
        })
            .then(() => {
                input.context.getFullContext()[args.store] = `succefully deleted attachment with id ${args.sysId}`;
                resolve(input);
            })
            .catch((error) => {
                if (args.stopOnError) {
                    reject(error.message); return;
                } else input.context.getFullContext()[args.store] = { "error": error.message };
                resolve(input);
            });
    });
}

module.exports.DeleteAttachment = DeleteAttachment;