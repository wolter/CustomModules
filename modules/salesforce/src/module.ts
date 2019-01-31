<<<<<<< HEAD

const jsforce = require('jsforce');

/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `soql` 1 The SOQL Query
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function SOQLQuery(input: IFlowInput, args: { secret: CognigySecret, soql: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters  
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.soql) return Promise.reject("No SOQL Query defined.");
  
  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) { 
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {
        conn.query(args.soql, function(err, res) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message };
          } else result = res;
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.SOQLQuery = SOQLQuery;

/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to create
 * @arg {JSON} `info` The information as JSON
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function createEntity(input: IFlowInput, args: { secret: CognigySecret, option: string, info: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.info) return Promise.reject("No Info defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        // Single record creation
        conn.sobject(args.option).create(args.info, function(err, apiResult) {
          if (err) { 
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message};
          } else result = apiResult;
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.createEntity = createEntity;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to retrieve
 * @arg {String} `entity_id` of the entitity to retrieve
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function retrieveEntity(input: IFlowInput, args: { secret: CognigySecret, option: string, entity_id: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entity_id) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        conn.sobject(args.option).retrieve(args.entity_id, function(err, apiResult) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message};
          } else result = apiResult;

          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.retrieveEntity = retrieveEntity;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to delete
 * @arg {String} `entity_id` of the entitity to delete
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function deleteEntity(input: IFlowInput, args: { secret: CognigySecret, option: string, entity_id: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entity_id) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        conn.sobject(args.option).destroy(args.entity_id, function(err, apiResult) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message};
          } else result = apiResult;

          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.deleteEntity = deleteEntity;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to retrieve
 * @arg {String} `entityId` of the entitity to retrieve
 * @arg {JSON} `valuesToChange` of the entitity to retrieve
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function updateEntity(input: IFlowInput, args: { secret: CognigySecret, option: string, entityId: string, valuesToChange: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entityId) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();


    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        // let valuesToChangeParsed = JSON.parse(args.valuesToChange);

        if (typeof args.valuesToChange === "object"){
          const options = Object.assign({ Id : args.entityId }, args.valuesToChange);
          conn.sobject(args.option).update(options, function(err, apiResult) {
            if (err) {
              if (args.stopOnError) { reject(err.message); return; }
              else result = { "error": err.message};
            } else result = apiResult;

            if (args.writeToContext) input.context.getFullContext()[args.store] = result;
            else input.input[args.store] = result;
            resolve(input);
          });
        }else {
          if (args.stopOnError) { reject(err.message); return; }
          result = { "error": err.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.updateEntity = updateEntity;
=======
const jsforce = require('jsforce');

/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `soql` 1 The SOQL Query
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function SOQLQuery(input: IFlowInput, args: { secret: CognigySecret, soql: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters  
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.soql) return Promise.reject("No SOQL Query defined.");
  
  return new Promise((resolve, reject) => {
    let result = {};
    var conn = new jsforce.Connection();
    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) { 
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {
        conn.query(args.soql, function(err, res) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message };
          } else result = res;
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.SOQLQuery = SOQLQuery;

/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to create
 * @arg {JSON} `info` The information as JSON
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function createEntity(input: IFlowInput, args: { secret: CognigySecret, option: string, info: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.info) return Promise.reject("No Info defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    var conn = new jsforce.Connection();


    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        // Single record creation
        conn.sobject(args.option).create(args.info, function(err, apiResult) {
          if (err) { 
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message};
          } else result = apiResult;
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });

  });
}

// You have to export the function, otherwise it is not available
module.exports.createEntity = createEntity;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to retrieve
 * @arg {String} `entity_id` of the entitity to retrieve
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function retrieveEntity(input: IFlowInput, args: { secret: CognigySecret, option: string, entity_id: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entity_id) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    var conn = new jsforce.Connection();


    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        conn.sobject(args.option).retrieve(args.entity_id, function(err, apiResult) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message};
          } else result = apiResult;

          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });

  });
}

// You have to export the function, otherwise it is not available
module.exports.retrieveEntity = retrieveEntity;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to delete
 * @arg {String} `entity_id` of the entitity to delete
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function deleteEntity(input: IFlowInput, args: { secret: CognigySecret, option: string, entity_id: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entity_id) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    var conn = new jsforce.Connection();


    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        conn.sobject(args.option).destroy(args.entity_id, function(err, apiResult) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message};
          } else result = apiResult;

          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });

  });
}


// You have to export the function, otherwise it is not available
module.exports.deleteEntity = deleteEntity;


// TODO: Starts an endless loop.
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to retrieve
 * @arg {String} `entityId` of the entitity to retrieve
 * @arg {JSON} `valuesToChange` of the entitity to retrieve
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function updateEntity(input: IFlowInput, args: { secret: CognigySecret, option: string, entityId: string, valuesToChange: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  input.actions.output(JSON.stringify(args),undefined);

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entityId) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();


    conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        // let valuesToChangeParsed = JSON.parse(args.valuesToChange);

        if (typeof args.valuesToChange === "object"){
          const options = Object.assign({ Id : args.entityId }, args.valuesToChange);
          conn.sobject(args.option).update(options, function(err, apiResult) {
            if (err) {
              if (args.stopOnError) { reject(err.message); return; }
              else result = { "error": err.message};
            } else result = apiResult;

            if (args.writeToContext) input.context.getFullContext()[args.store] = result;
            else input.input[args.store] = result;
            resolve(input);
          });
        }else {
          if (args.stopOnError) { reject(err.message); return; }
          result = { "error": err.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }

      }
    });

  });
}

// You have to export the function, otherwise it is not available
module.exports.updateEntity = updateEntity;
>>>>>>> d656d1c2ebfc9acfd92b0d10c25db2f576e3337e
