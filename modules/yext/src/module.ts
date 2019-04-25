const axios = require('axios');


/**
 * Gets the information of a chosen table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[Locations,Events,Products,Assets,Entities,Folders,Menus,Bios]} `entity` The entity you want to get from Yext
 * @arg {CognigyScript} `api_version` The version you want to use, e.g. 20190424 (a date)
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GetEntity(input: IFlowInput, args: { secret: CognigySecret, entity: string, api_version: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.api_key) return Promise.reject("Secret not defined or invalid.");
    if (!args.entity) return Promise.reject("No entity defined.");

    let version = args.api_version || "20190424"

    return new Promise((resolve, reject) => {
        let result = {};
        
        axios.get(`https://api.yext.com/v2/accounts/me/${args.entity.toLowerCase()}?api_key=${args.secret.api_key}&v=${version}`, {
            headers: {
                'Allow': 'application/json'
            }
        })
            .then((response) => {
                result = response.data
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else input.context.getFullContext()[args.store] = { "error": error.message }
                resolve(input)
            })
    });
}

module.exports.GetEntity = GetEntity;


/**
 * Gets the information of a chosen table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[Locations,Events,Products,Assets,Entities,Folders,Menus,Bios]} `entity` The entity you want to get from Yext
 * @arg {CognigyScript} `entity_id` The entitie's id you want to get from Yext
 * @arg {CognigyScript} `api_version` The version you want to use, e.g. 20190424 (a date)
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GetEntityById(input: IFlowInput, args: { secret: CognigySecret, entity: string, entity_id: string, api_version: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.api_key) return Promise.reject("Secret not defined or invalid.");
    if (!args.entity) return Promise.reject("No entity defined.");

    let version = args.api_version || "20190424"

    return new Promise((resolve, reject) => {
        let result = {};
        
        axios.get(`https://api.yext.com/v2/accounts/me/${args.entity.toLowerCase()}/${args.entity_id}?api_key=${args.secret.api_key}&v=${version}`, {
            headers: {
                'Allow': 'application/json'
            }
        })
            .then((response) => {
                input.actions.output("", response.data);
                result = response.data
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else input.context.getFullContext()[args.store] = { "error": error.message }
                resolve(input)
            })
    });
}

module.exports.GetEntityById = GetEntityById;


/**
 * Gets the information of a chosen table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {JSON} `filters` The filters to use for this search
 * @arg {CognigyScript} `api_version` The version you want to use, e.g. 20190424 (a date)
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GetLocationsByFilter(input: IFlowInput, args: { secret: CognigySecret, filters: string, api_version: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.api_key) return Promise.reject("Secret not defined or invalid.");

    let version = args.api_version || "20190424"

    return new Promise((resolve, reject) => {
        let result = {};
        
        axios.get(`https://api.yext.com/v2/accounts/me/locationsearch?api_key=${args.secret.api_key}&v=${version}`, {
            headers: {
                'Allow': 'application/json'
            },
            params: {
                filters: JSON.stringify(args.filters)
            }  
        })
            .then((response) => {
                result = response.data
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else input.context.getFullContext()[args.store] = { "error": error.message }
                resolve(input)
            })
    });
}

module.exports.GetLocationsByFilter = GetLocationsByFilter;