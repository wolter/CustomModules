const JiraClient = require('jira-connector');


/**
 * Creates a Ticket in Jira
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `summary` The summary of the new ticket
 * @arg {CognigyScript} `projectId` The projectId of the new ticket
 * @arg {CognigyScript} `epicname` The epicname of the new ticket
 * @arg {CognigyScript} `description` The description of the new ticket
 * @arg {CognigyScript} `assignee` The assignee of the new ticket
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function createJiraTicket(input: IFlowInput, args: { secret: CognigySecret, summary: string, projectId: string, epicname: string, description: string, assignee?: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  /* validate node arguments */
  const { secret, summary, projectId, epicname, description, assignee, store, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (!summary) throw new Error("Summary not defined.");
  if (!projectId) throw new Error("Project Id not defined.");
  if (!epicname) throw new Error("Epicname not defined.");
  if (!description) throw new Error("Description not defined.");
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { username, password, domain } = secret;
  if (!username) throw new Error("Secret is missing the 'username' field.");
  if (!password) throw new Error("Secret is missing the 'password' field.");
  if (!domain) throw new Error("Secret is missing the 'domain' field.");

  return new Promise((resolve, reject) => {

    const jira = new JiraClient({
      host: domain,
      basic_auth: {
        username,
        password
      }
    });

    jira.issue.createIssue({
      fields: {
        summary,
        issuetype: {
          id: "10000"
        },
        project: {
          key: projectId
        },
        customfield_10011: epicname,
        description,
        assignee: {
          name: assignee || "admin"
        }
      }
    }, (error: any, issue: any) => {
      try {
        if (error) {
          const errorMessage = Array.isArray(error.errorMessages) ?
            error.errorMessages[0] : error.errorMessage;
          if (args.stopOnError) {
            reject(errorMessage);
            return;
          }
          input.actions.addToContext(store, { error: errorMessage }, 'simple');
          resolve(input);
        }
        input.actions.addToContext(store, issue, 'simple');
        resolve(input);
      } catch (err) {
        reject(err);
        return;
      }
    });
  });
}

module.exports.createJiraTicket = createJiraTicket;


/**
 * This function takes the input text and automatically extracts a ticket number (e.g. SB-2 or TIF-1234). You select where to store it.
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function extractTicket(input: IFlowInput, args: { store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  /* validate node arguments */
  const { store, stopOnError } = args;
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  try {
    const pattern = /[a-zA-Z]+-\d+/g;
    let match = await input.input.text.match(pattern);

    if (match) {
      input.actions.addToContext(store, match[0], 'simple');
    } else {
      input.actions.addToContext(store, 'No ticket found', 'simple');
    }
  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.addToContext(store, { error: error.message }, 'simple');
    }
  }

  return input;
}

module.exports.extractTicket = extractTicket;


/**
 * Returns the status of a given ticket (e.g. 'In progress')
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketStatus(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  /* validate node arguments */
  const { secret, ticket, store, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (!ticket) throw new Error("No ticket defined. Please define a ticket like AB-1234.");
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { username, password, domain } = secret;
  if (!username) throw new Error("Secret is missing the 'username' field.");
  if (!password) throw new Error("Secret is missing the 'password' field.");
  if (!domain) throw new Error("Secret is missing the 'domain' field.");

  return await processJiraIssue(input, args, "status");
}

module.exports.getTicketStatus = getTicketStatus;


/**
 * Returns the assignee of a given ticket (e.g. bob@bob.com).
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketAssignee(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  /* validate node arguments */
  const { secret, ticket, store, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (!ticket) throw new Error("No ticket defined. Please define a ticket like AB-1234.");
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { username, password, domain } = secret;
  if (!username) throw new Error("Secret is missing the 'username' field.");
  if (!password) throw new Error("Secret is missing the 'password' field.");
  if (!domain) throw new Error("Secret is missing the 'domain' field.");

  return await processJiraIssue(input, args, "assignee");
}

module.exports.getTicketAssignee = getTicketAssignee;


/**
 * Returns the priority of a given ticket (e.g. 'normal')
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketPriority(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  /* validate node arguments */
  const { secret, ticket, store, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (!ticket) throw new Error("No ticket defined. Please define a ticket like AB-1234.");
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { username, password, domain } = secret;
  if (!username) throw new Error("Secret is missing the 'username' field.");
  if (!password) throw new Error("Secret is missing the 'password' field.");
  if (!domain) throw new Error("Secret is missing the 'domain' field.");

  return await processJiraIssue(input, args, "priority");
}

module.exports.getTicketPriority = getTicketPriority;


/**
 * Returns the resolution if the ticket has one
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketResolution(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return await processJiraIssue(input, args, "resolution");
}

module.exports.getTicketResolution = getTicketResolution;


/**
 * Returns the reporter of the ticket (e.g. bob@bob.com)
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketReporter(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return await processJiraIssue(input, args, "reporter");
}

module.exports.getTicketReporter = getTicketReporter;


/**
 * Returns comments on this ticket, if it has any.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketComments(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return await processJiraIssue(input, args, "comment");
}

module.exports.getTicketComments = getTicketComments;


/**
 * Returns a list (array) of people watching the ticket.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketWatchers(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return await processJiraIssue(input, args, "watches");
}

module.exports.getTicketWatchers = getTicketWatchers;

/**
 * Returns basic summary of the ticket, including: type, project, status, assignedTo, reportedBy, resolution and comments.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketSummary(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result: any = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, (error: any, issue: any) => {
      if (error && error.errorMessages) {
        const errorMessage = Array.isArray(error.errorMessages) ?
          error.errorMessages[0] : error.errorMessage;

        if (args.stopOnError) {
          reject(errorMessage);
          return;
        }

        const result = { "error": errorMessage };
        input.context.getFullContext()[args.store] = result;
        resolve(input);

      } else if (error) {
        input.actions.log("error", "JIRA API has changed");
        reject("Error while getting Jira issue.");
      } else {
        if (!issue || typeof issue !== "object" || Object.keys(issue).length === 0) {
          Promise.reject("Error while getting Jira issue. No issue was found");
        }

        try {
          result.ticket = issue.key || null;

          result.type = issue.fields && issue.fields.issuetype &&
            issue.fields.issuetype.name || null;

          result.project = issue.fields && issue.fields.project &&
            issue.fields.project.name || null;

          result.status = issue.fields && issue.fields.status &&
            issue.fields.status.name || null;

          result.assignedTo = issue.fields && issue.fields.assignee &&
            issue.fields.assignee.emailAddress || null;

          result.reportedBy = issue.fields && issue.fields.reporter &&
            issue.fields.reporter.emailAddress || null;

          result.resolution = issue.fields && issue.fields.resolution &&
            issue.fields.resolution.name || null;

          result.comments = issue.fields && issue.fields.comment &&
            issue.fields.comment.comments || null;

        } catch (err) {
          input.actions.log(`Error while getting ticket summary. Error was: ${err}`, undefined);
          Promise.reject("Error while getting ticket summary");
        }

        input.context.getFullContext()[args.store] = result;
        resolve(input);
      }
    });
  });
}

module.exports.getTicketSummary = getTicketSummary;


/**
 * Returns the full JIRA response, including ALL meta data. Use this if you need more info.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getAllTicketInfo(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, (error: any, issue: any) => {
      if (error && error.errorMessages) {
        const errorMessage = Array.isArray(error.errorMessages) ?
          error.errorMessages[0] : error.errorMessage;

        if (args.stopOnError) {
          reject(errorMessage);
          return;
        }

        const result = { "error": errorMessage };
        input.context.getFullContext()[args.store] = result;
        resolve(input);

      } else if (error) {
        input.actions.log("error", "JIRA API has changed");
        reject("Error while getting Jira issue.");
      } else {
        if (!issue) {
          reject("Error while getting Jira issue. No issue was found");
        }
        input.context.getFullContext()[args.store] = issue;
        resolve(input);
      }
    });
  });
}

module.exports.getAllTicketInfo = getAllTicketInfo;


async function processJiraIssue(input: IFlowInput, args: { [key: string]: any; }, fieldName: string): Promise<IFlowInput | {}> {

  const jira = new JiraClient({
    host: args.secret.domain,
    basic_auth: {
      username: args.secret.username,
      password: args.secret.password
    }
  });
  return new Promise((resolve, reject) => {

    jira.issue.getIssue({
      issueKey: args.ticket
    }, (error: any, issue: any) => {
      try {
        if (error && error.errorMessages) {
          const errorMessage = Array.isArray(error.errorMessages) ?
            error.errorMessages[0] : error.errorMessage;

          if (args.stopOnError) {
            reject(errorMessage);
            return;
          }

          const result = { "error": errorMessage };
          input.context.getFullContext()[args.store] = result;
          resolve(input);

        } else if (error) {
          input.actions.log("error", "JIRA API has changed");
          reject("Error while getting Jira issue.");
        } else {
          if (!issue) {
            reject("Error while getting Jira issue. No issue was found");
          }

          const result = {
            ticket: issue.key || null,
            status: issue.fields && issue.fields[fieldName] || null
          };

          input.context.getFullContext()[args.store] = result;
          resolve(input);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}