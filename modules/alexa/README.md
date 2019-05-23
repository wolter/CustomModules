Adds [Amazon Alexa](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html) specific features as Flow Nodes to Cognigy.AI

Please note, you still need to set add needed interfaces and  permissions for a Alexa Skill in the Alexa Skills Kit Developer Console and to make sure the user gave his consent using the Permissions-Node.

Using Alexa one can't debug the conversation's context in Cognigy directly. Therefore, for testing purpose we recommend to either log debug information manually (`actions.log("debug", info);`) or to send those info back to Alexa via temporary Say-Nodes.

## Node: respondWithPermissionCard

Create an **ask for permission consent** card.

### Permissions

Supported parameters for the permissions list are for instance:

#### [Reminders](https://developer.amazon.com/docs/smapi/alexa-reminders-overview.html)
- Full reminder access: `alexa::alerts:reminders:skill:readwrite`
#### [Device Address](https://developer.amazon.com/docs/custom-skills/device-address-api.html)
- Full address: `read::alexa:device:all:address`
- Country/Region and postal code: `read::alexa:device:all:address:country_and_postal_code`
#### [Lists Read and Lists Write](https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html)
- Lists Read: `read::alexa:household:list`
- List Write: `write::alexa:household:list`
#### [Location](https://developer.amazon.com/docs/custom-skills/location-services-for-alexa-skills.html)
- Geolocation: `alexa::devices:all:geolocation:read`
#### [Customer Settings](https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html)
#### [Customer Contact Information](https://developer.amazon.com/docs/custom-skills/request-customer-contact-information-for-use-in-your-skill.html)
- Full Name: `alexa::profile:name:read`
- Given Name (First Name): `alexa::profile:given_name:read`
- Email Address: `alexa::profile:email:read`
- Phone Number: `alexa::profile:mobile_number:read`
#### [Amazon Pay](https://developer.amazon.com/docs/amazon-pay/integrate-skill-with-amazon-pay-v2.html)
- Payment: `payments:autopay_consent`

## Node: callAlexaAPI

Call Alexa API in a generic manner and set the authentication token implicitly (using the Alexa API access token `ci.data.context.System.apiAccessToken`). Mainly for testing purpose.

## Node: getDeviceAddress

Get current's device address depending on the settings in a format of

```json
{
    "addressLine1":"string or null",
    "addressLine2":"string or null",
    "addressLine3":"string or null",
    "districtOrCounty":"string or null",
    "stateOrRegion":"string or null",
    "city":"string or null",
    "countryCode":"string or null",
    "postalCode":"string or null"
 }

```

The result will be stored in either the Cognigy context (`cc.STORE`) or input object (`ci.STORE`) using the store name givin in the node's settings.

Handles implicitly the authentication (using the Alexa consent token `input.data.context.System.user.permissions.consentToken`).

Errors are in a format of 

```json
{
    "type": "TYPE",
    "message": "message"
}
```

In case of an error, this is stored in either the Cognigy context (`cc.STORE.error`) or input object (`ci.STORE.error`). 


Usage is explained in the  **Alexa Skills Kit** developer [documentation](https://developer.amazon.com/docs/custom-skills/device-address-api.html).

## Node: setAbsoluteReminder

Set an absolute reminder and get a confirmation in a format of

```json
{
    "alertToken": "string",
    "createdTime": "2018-08-14T15:40:55.002Z",
    "updatedTime": "2018-08-14T15:40:55.002Z",
    "status": "ON",
    "version": "string",
    "href": "string"
}
```

The result will be stored in either the Cognigy context (`cc.STORE`) or input object (`ci.STORE`) using the store name givin in the node's settings.

Setting the timezone can be done with [moment.js](https://momentjs.com/), which is available in CognigyScript like `scheduled_reminder = moment('2019-02-18T20:00:00').format('YYYY-MM-DD[T]HH:mm:ss');`. Furthermore, you find the supported timezones at https://en.wikipedia.org/wiki/List_of_tz_database_time_zones. It's also good to know you can set a onetime reminder with ONCE (or "none"), a daily one with DAILY, or a WEEKLY reminder. Setting a weekly reminder also requires to activate at least one weekday.

Handles implicitly the authentication (using the Alexa API access token `input.data.context.System.apiAccessToken`).

Errors are in a format of 

```json
{
    "code": "CODE",
    "message": "message"
}
```

In case of an error, this is stored in either the Cognigy context (`cc.STORE.error`) or input object (`ci.STORE.error`). 

Usage is explained in the  **Alexa Skills Kit** developer [documentation](https://developer.amazon.com/docs/smapi/alexa-reminders-overview.html).


## Node: setRelativeReminder

Set a realtive reminder and get a confirmation in a format of

```json
{
    "alertToken": "string",
    "createdTime": "2018-08-14T15:40:55.002Z",
    "updatedTime": "2018-08-14T15:40:55.002Z",
    "status": "ON",
    "version": "string",
    "href": "string"
}
```

The result will be stored in either the Cognigy context (`cc.STORE`) or input object (`ci.STORE`) using the store name givin in the node's settings.

Handles implicitly the authentication (using the Alexa API access token `input.data.context.System.apiAccessToken`).

Errors are in a format of 

```json
{
    "code": "CODE",
    "message": "message"
}
```

In case of an error, this is stored in either the Cognigy context (`cc.STORE.error`) or input object (`ci.STORE.error`). 

Usage is explained in the  **Alexa Skills Kit** developer [documentation](https://developer.amazon.com/docs/smapi/alexa-reminders-overview.html).
