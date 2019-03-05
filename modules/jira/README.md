# Atlassian Jira Custom Module

Integrates Cognigy.AI with Jira (https://www.atlassian.com/software/jira) 

This module is based on the Jira Connector (https://github.com/floralvikings/jira-connector)

### Secret
This modules needs a CognigySecret to be defined and passed to the Nodes. The secret must have the following keys:

- Jira domain (e.g. my-domain.atlassian.net)
- Username (Your Jira account email address bob@sample.com)
- API token (Can be generated within your Jira Project. Click [here](https://confluence.atlassian.com/cloud/api-tokens-938839638.html) for instructions.)

**PLEASE NOTE:** 
*This package uses the term **"ticket"** as a generic term for any Jira issue. This can be  a UserStory, Issue, etc.*

 ## Node: extractTicket

This function can be used to dynamically extract tickets from any given text, which can then be used with e.g. the **getTicket function** (see below).

Some examples of tickets that will be recognized out of the box: 

| Example Ticket|
| ------------- |
| SB-1234       |
| ITEF-01       |
| USTORY-91234  |

This means that if the {{ci.text}} input text is something like this:

"What is the status of ticket ITI-1542?"

the extractTicket node will automatically extract **ITI-1542** and write it to the Cognigy Context for further use. 

## Node: getTicket*

This package provides several nodes to retrieve ticket information from Jira, using the **ticket** name like "SB-4": 

- status
- assignee
- priority
- resolution
- reporter
- comments
- watchers
- summery


Retrieves information on the ticket number and returns it in the following format: 


#### Response JSON Structure

```json
{
  "ticket": "US-1234",
  "title": "Create Login System",
  "Description": "This User Story describes how to setup a login system."
}
```

If you want to get the full Jira response, including all meta data you can use the node **getAllTicketInfo**.

