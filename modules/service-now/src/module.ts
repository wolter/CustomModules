const axios = require('axios');
const fs = require('fs');

/**
 * Gets the information of a chosen table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to query
 * @arg {CognigyScriptArray} `columns` The columns you want to show
 * @arg {Number} `limit` The limit of the shown results
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GETFromTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, columns: string[], limit: number, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.tableName) return Promise.reject("No table name defined.");

    return new Promise((resolve, reject) => {
        let result = {};

        axios.get(`${args.secret.instance}/api/now/table/${args.tableName}?sysparm_fields=${args.columns}&sysparm_limit=${args.limit}`, {
            headers: {
                'Allow': 'application/json'
            },
            auth: {
                username: args.secret.username,
                password: args.secret.password
            }
        })
            .then((response) => {
                result = response.data.result
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
    });
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
async function POSTToTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, data: JSON, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.tableName) return Promise.reject("No table name defined.");
    if (!args.data) return Promise.reject("No data to post defined.");

    return new Promise((resolve, reject) => {
        let result = {};

        axios.post(`${args.secret.instance}/api/now/table/${args.tableName}`,
            args.data, {
                headers: {
                    'Allow': 'application/json',
                    'Content-Type': 'application/json'
                },
                auth: {
                    username: args.secret.username,
                    password: args.secret.password
                },
            })
            .then((response) => {
                result = response.data.result
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
    });
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
async function PatchRecordInTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, data: JSON, sysId: JSON, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.tableName) return Promise.reject("No table name defined.");
    if (!args.data) return Promise.reject("No data to update defined.");
    if (!args.sysId) return Promise.reject("No sys id defined.");

    return new Promise((resolve, reject) => {
        let result = {};

        axios.patch(`${args.secret.instance}/api/now/table/${args.tableName}/${args.sysId}`,
            args.data
            , {
                headers: {
                    'Allow': 'application/json',
                    'Content-Type': 'application/json'
                },
                auth: {
                    username: args.secret.username,
                    password: args.secret.password
                },
            })
            .then((response) => {
                result = response.data.result;
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
    });
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
async function DeleteFromTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, sysId: JSON, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.tableName) return Promise.reject("No table name defined.");
    if (!args.sysId) return Promise.reject("No sys id defined.");

    return new Promise((resolve, reject) => {
        let result = {};

        axios.delete(`${args.secret.instance}/api/now/table/${args.tableName}/${args.sysId}`, {
            headers: {
                'Allow': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username: args.secret.username,
                password: args.secret.password
            },
        })
            .then(() => {
                result = "succefully deleted entry with id " + args.sysId;
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
    });
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
async function GETAttachments(input: IFlowInput, args: { secret: CognigySecret, limit: string, query: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");

    return new Promise((resolve, reject) => {
        let result = {};

        axios.get(`${args.secret.instance}/api/now/attachment?sysparm_limit=${args.limit}&sysparm_query=${args.query}`, {
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
                input.context.getFullContext()[args.store] = response.data.result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
    });
}

module.exports.GETAttachments = GETAttachments;


/**
 * Gets an attachment by Id
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `sysId` The id of the attachment you want to reach
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GETAttachmentById(input: IFlowInput, args: { secret: CognigySecret, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.sysId) return  Promise.reject("No sysId defined");

    return new Promise((resolve, reject) => {
        let result = {};

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
                input.context.getFullContext()[args.store] = response.data.result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
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
async function POSTAttachment(input: IFlowInput, args: { secret: CognigySecret, tableName: string, tableSysId: string, fileName: string, fileLocation: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.tableSysId) return  Promise.reject("No sysId defined");
    if (!args.fileName) return  Promise.reject("No fileName defined");
    if (!args.tableName) return  Promise.reject("No table defined");
    if (!args.fileLocation) return  Promise.reject("No file location defined");

    return new Promise((resolve, reject) => {
        let result = {};

        axios.post(`${args.secret.instance}/api/now/attachment/file?table_name=${args.tableName}&table_sys_id=${args.tableSysId}&file_name=${args.fileName}`, 
            fs.createReadStream(args.fileLocation)
        ,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            auth: {
                username: args.secret.username,
                password: args.secret.password
            },
        })
            .then((response) => {
                input.context.getFullContext()[args.store] = response.data.result;
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
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
async function DeleteAttachment(input: IFlowInput, args: { secret: CognigySecret, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.instance) return Promise.reject("Secret not defined or invalid.");
    if (!args.sysId) return  Promise.reject("No sysId defined");

    return new Promise((resolve, reject) => {
        let result = {};

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
                result = "succefully deleted attachment with id " + args.sysId;
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
    });
}

module.exports.DeleteAttachment = DeleteAttachment;