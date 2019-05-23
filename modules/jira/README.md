# Atlassian Jira Custom Module

Integrates Cognigy.AI with Jira (https://www.atlassian.com/software/jira) 

This module is based on the Jira Connector (https://github.com/floralvikings/jira-connector)

### Secret
This modules needs a CognigySecret to be defined and passed to the Nodes. The secret must have the following keys:

- domain (e.g. my-domain.atlassian.net)
- username (Your Jira account email address bob@sample.com)
- password (Can be generated within your Jira Project. Click [here](https://confluence.atlassian.com/cloud/api-tokens-938839638.html) for instructions.)

**PLEASE NOTE:** 
*This package uses the term **"ticket"** as a generic term for any Jira issue. This can be  a UserStory, Issue, etc.*



## List of Nodes / Operations

- extractTicket
- getTicketSummary
- getAllTicketInfo
- getTicketStatus
- getTicketAssignee
- getTicketPriority
- getTicketResolution
- getTicketReporter
- getTicketComments
- getTicketWatchers
- createTicket


 ## Node: extractTicket

This function can be used to dynamically extract tickets from any given text, which can then be used with e.g. the **getTicket function** (see below).

Some examples of tickets that will be recognized out of the box: 

| Example Ticket Formats|
| ----------------------|
| SB-1234               |
| ITEF-01               |
| USTORY-91234          |

This means that if the {{ci.text}} input text is something like this:

"What is the status of ticket **ITI-1542?**"

the extractTicket node will automatically extract **ITI-1542** and write it to the Cognigy Context for further use. 

You will then be able to use this ticket dynamically using the Cognigy Context object **cc**. This can be accessed as follows:

```json
{{cc.ticket}}
```

You would typically use the extractTicket node, in combination with other nodes, as can be seen in the following example:

![Jira Flow Example](https://s3.eu-central-1.amazonaws.com/tempbucket-waanders/JIRA/flow.JPG)

The Say node can then be configured as follows:

![Jira Flow Example](https://s3.eu-central-1.amazonaws.com/tempbucket-waanders/JIRA/say-node.jpg)


## Node: getTicketSummary

This is a convenience function that returns a quick summary of a given ticket. 

#### Required Input

- **secret** --> Select the secret that contains username, password and domain.
- **ticket** --> Enter a ticket, either hardcoded or dynamic (e.g. {{ cc.ticket }} )
- **store** --> Whether to store the API Response under the Cognigy Context or Input Object
- **stopOnError** --> Whether to stop or continue on error

#### Response JSON Structure

```json
"summary": {
    "ticket": "CI-10",
    "type": "Epic",
    "project": "Customer Issues",
    "status": "To Do",
    "assignedTo": "a.teusz@cognigy.com",
    "reportedBy": "t.waanders@cognigy.com",
    "resolution": null,
    "comments": []
  }
```

If you want to get the full Jira response, including all meta data you can use the node 
**getAllTicketInfo**.





## Node: createTicket

Use this node to create a new ticket. 

#### Required Input

- **secret** --> Select the secret that contains username, password and domain.
- **summary** --> Expects a summary for the ticket
- **issueTypeId** --> This is filled by default. Only fill out if you know what you are doing.
- **projectId** --> The ID of the project. This is typically the first part of the ticket format. 

If ticket format is **CIT-2341**, the projectId is  **CIT** 

- **epicname** --> The name of the Epic this ticket is part of (optionally)
- **description** --> The full ticket description (e.g. problem description in case of an issue or user story description in case of a user story)
- **stopOnError** --> Whether to stop or continue on error

#### Response JSON Structure

```json
"summary": {
    "ticket": "CI-10",
    "type": "Epic",
    "project": "Customer Issues",
    "status": "To Do",
    "assignedTo": "a.teusz@cognigy.com",
    "reportedBy": "t.waanders@cognigy.com",
    "resolution": null,
    "comments": []
  }
```

If you want to get the full Jira response, including all meta data you can use the node 
**getAllTicketInfo**.
