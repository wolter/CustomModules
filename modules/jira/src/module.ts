
const JiraClient = require('jira-connector');

/**
 * This function takes the input text and automatically extracts a ticket number (e.g. SB-2 or TIF-1234). You select where to store it. 
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `storeTicket` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function extractTicket(input: IFlowInput, args: {  secret: CognigySecret, writeToContext: boolean, storeTicket: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  
  return new Promise((resolve, reject) => {

    const pattern = /[a-zA-Z]+-\d+/g;

    let match = input.input.text.match(pattern);
    

    if(match) {
        if (args.writeToContext) input.context.getFullContext()[args.storeTicket] = match[0];
        else input.input[args.storeTicket] = match[0];
        resolve(input);
    } else {
        if (args.writeToContext) input.context.getFullContext()[args.storeTicket] = "No Ticket Found";
        else input.input[args.storeTicket] = "No Ticket Found";
        resolve(input);
    }
  });
}

module.exports.extractTicket = extractTicket;


/**
 * Returns the status of a given ticket (e.g. 'In progress')
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketStatus(input: IFlowInput, args: { secret: CognigySecret, ticket: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password  || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");
  
  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient( {
      host: args.secret.domain,
      basic_auth: {
          username: args.secret.username,
          password: args.secret.password
        }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function(error, issue) {
        if(error) {
          if (args.stopOnError) { reject(error.message); return; }
          result = { "error": error.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        } else {

          //

          let result = { 
            ticket: issue.key,
            status: issue.fields.status
          }
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }
    });
  });
}

module.exports.getTicketStatus = getTicketStatus;


/**
 * Returns the assignee of a given ticket (e.g. bob@bob.com). 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketAssignee(input: IFlowInput, args: { secret: CognigySecret, ticket: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password  || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");
  
  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient( {
      host: args.secret.domain,
      basic_auth: {
          username: args.secret.username,
          password: args.secret.password
        }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function(error, issue) {
        if(error) {
          if (args.stopOnError) { reject(error.message); return; }
          result = { "error": error.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        } else {

          //

          let result = { 
            ticket: issue.key,
            status: issue.fields.assignee
          }
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }
    });
  });
}

module.exports.getTicketAssignee = getTicketAssignee;


/**
 * Returns the priority of a given ticket (e.g. 'normal')
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketPriority(input: IFlowInput, args: { secret: CognigySecret, ticket: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password  || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");
  
  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient( {
      host: args.secret.domain,
      basic_auth: {
          username: args.secret.username,
          password: args.secret.password
        }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function(error, issue) {
        if(error) {
          if (args.stopOnError) { reject(error.message); return; }
          result = { "error": error.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        } else {

          //

          let result = { 
            ticket: issue.key,
            status: issue.fields.priority
          }
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }
    });
  });
}

module.exports.getTicketPriority = getTicketPriority;


/**
 * Returns the resolution if the ticket has one
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketResolution(input: IFlowInput, args: { secret: CognigySecret, ticket: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password  || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");
  
  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient( {
      host: args.secret.domain,
      basic_auth: {
          username: args.secret.username,
          password: args.secret.password
        }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function(error, issue) {
        if(error) {
          if (args.stopOnError) { reject(error.message); return; }
          result = { "error": error.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        } else {

          //

          let result = { 
            ticket: issue.key,
            status: issue.fields.resolution
          }
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }
    });
  });
}

module.exports.getTicketResolution = getTicketResolution;


/**
 * Returns the reporter of the ticket (e.g. bob@bob.com)
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketReporter(input: IFlowInput, args: { secret: CognigySecret, ticket: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password  || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");
  
  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient( {
      host: args.secret.domain,
      basic_auth: {
          username: args.secret.username,
          password: args.secret.password
        }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function(error, issue) {
        if(error) {
          if (args.stopOnError) { reject(error.message); return; }
          result = { "error": error.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        } else {

          //

          let result = { 
            ticket: issue.key,
            status: issue.fields.reporter
          }
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }
    });
  });
}

module.exports.getTicketReporter = getTicketReporter;


/**
 * Returns a list (array) of people watching the ticket. 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketWatchers(input: IFlowInput, args: { secret: CognigySecret, ticket: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password  || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");
  
  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient( {
      host: args.secret.domain,
      basic_auth: {
          username: args.secret.username,
          password: args.secret.password
        }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function(error, issue) {
        if(error) {
          if (args.stopOnError) { reject(error.message); return; }
          result = { "error": error.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        } else {

          //

          let result = { 
            ticket: issue.key,
            status: issue.fields.watches
          }
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }
    });
  });
}

module.exports.getTicketWatchers = getTicketWatchers;


/**
 * Returns the full JIRA response, including ALL meta data. Use this if you need more info. 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getAllTicketInfo(input: IFlowInput, args: { secret: CognigySecret, ticket: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password  || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");
  
  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient( {
      host: args.secret.domain,
      basic_auth: {
          username: args.secret.username,
          password: args.secret.password
        }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function(error, issue) {
        if(error) {
          if (args.stopOnError) { reject(error.message); return; }
          result = { "error": error.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        } else {
          if (args.writeToContext) input.context.getFullContext()[args.store] = issue;
          else input.input[args.store] = issue;
          resolve(input);
        }
    });
  });
}

module.exports.getAllTicketInfo = getAllTicketInfo;





