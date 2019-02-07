import * as request_promise from 'request-promise';

function handleError(input: IFlowInput, error:Error, stopOnError:boolean, writeToContext:boolean, store:string): IFlowInput | {}  {

    if (writeToContext) {
        input.context.getFullContext()[store] = { "error": error };
    } else {
        input.input[store] = { "error": error };
    }

    if (stopOnError) {
        return Promise.reject(error.message);
    } else {
        return input;
    }

}

/**
 * Just for testign purpose.
 * 
 * @arg {CognigyScript} `key` input parameter - as args.key
 * @arg {CognigyScript} `anotherKey` another input paramter
 */
async function test(input: IFlowInput, args: { key: string, anotherKey: string }): Promise<IFlowInput | {}> {
    input.context.getFullContext()[args.key] = args.anotherKey;
    return input;
}

module.exports.test = test;


/**
 * Gets current's device address depending on the settings in a format of
 * {
 *  "addressLine1":"string or null",
 *  "addressLine2":"string or null",
 *  "addressLine3":"string or null",
 *  "districtOrCounty":"string or null",
 *  "stateOrRegion":"string or null",
 *  "city":"string or null",
 *  "countryCode":"string or null",
 *  "postalCode":"string or null"
 * }
 * 
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getDeviceAddress(input: IFlowInput, args: { writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // Check current channel
    if (input.input.channel !== "alexa") {
        const error:Error = new Error("Wrong channel. Channel must be Amazon Alexa.");
        return handleError(input, error, args.stopOnError, args.writeToContext, args.store);
    }

    try {

        const token: string = input.data.context.System.user.permissions.consentToken;
        const deviceId: string = input.data.context.System.device.deviceId;
        const apiEndpoint: string = input.data.context.System.apiEndpoint;

        // Update these options with the details of the web service you would like to call
        const options: request_promise.OptionsWithUri = {
            uri: `${apiEndpoint}/v1/devices/${deviceId}/settings/address`,
            json: true,
            headers: { 'Authorization': `Bearer ${token}` }
        };

        // Handle request
        const result = await request_promise.get(options);
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        return input;

    } catch (error) {
        return handleError(input, error.error, args.stopOnError, args.writeToContext, args.store); 
    }
}

module.exports.getDeviceAddress = getDeviceAddress;

/**
 * Set a relative reminder and gets a confirmation in a format of
 * {
 *  "alertToken": "string",
 *  "createdTime": "2018-08-14T15:40:55.002Z",
 *  "updatedTime": "2018-08-14T15:40:55.002Z",
 *  "status": "ON",
 *  "version": "string",
 *  "href": "string"
 * }
 * 
 * @arg {String} `text` Reminder`s message text
 * @arg {Number} `offsetInSeconds` Time until reminding
 * @arg {Boolean} `pushNotification` Pushnotification enabled
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function setRelativeReminder(input: IFlowInput, args: { writeToContext: boolean, store: string, text: string, offsetInSeconds:number, pushNotification:boolean, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // Check current channel
    if (input.input.channel !== "alexa") {
        const error:Error = new Error("Wrong channel. Channel must be Amazon Alexa.");
        return handleError(input, error, args.stopOnError, args.writeToContext, args.store);
    } // else if "adminconsole"({
        // debug out
    //}

    try {

        const token: string = input.data.context.System.apiAccessToken;
        const apiEndpoint: string = input.data.context.System.apiEndpoint;
        
        const locale:string = input.data.request.locale;
        const requestTime:string = input.data.request.timestamp;      
        const bodyAsJson:JSON = JSON.parse( 
        `{
            "requestTime": "${requestTime}",
            "trigger": {
                "type": "SCHEDULED_RELATIVE",
                "offsetInSeconds": "${args.offsetInSeconds.toString()}"
            },
            "alertInfo": {
                "spokenInfo": {
                    "content": [
                        {
                            "locale": "${locale}",
                            "text": "${args.text}"
                        }
                    ]
                }
            },
            "pushNotification": {
                "status": "${args.pushNotification?"ENABLED":"DISABLED"}"
            }
        }`);

        // Update these options with the details of the web service you would like to call
        const options: request_promise.OptionsWithUri = {
            uri: `${apiEndpoint}/v1/alerts/reminders`,
            json: true,
            body: bodyAsJson,
            headers: { 'Authorization': `Bearer ${token}` }
        };

        // Handle request
        const result = await request_promise.post(options);
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        return input;

    } catch (error) {
        return handleError(input, error.error, args.stopOnError, args.writeToContext, args.store); 
    }
}

module.exports.setRelativeReminder = setRelativeReminder;

/**
 * Create an "ask for permission consent" card:
 * 
 * Reminders (https://developer.amazon.com/docs/smapi/alexa-reminders-overview.html)
 *  Full reminder access: alexa::alerts:reminders:skill:readwrite
 * 
 * Device Address (https://developer.amazon.com/docs/custom-skills/device-address-api.html)
 *  Full address: read::alexa:device:all:address
 *  Country/Region and postal code: read::alexa:device:all:address:country_and_postal_code
 * 
 * Lists Read and Lists Write
 * 
 * Location
 * 
 * Customer Settings
 * 
 * Customer Contact Information (https://developer.amazon.com/docs/custom-skills/request-customer-contact-information-for-use-in-your-skill.html)
 *  Full Name: alexa::profile:name:read
 *  Given Name (First Name): alexa::profile:given_name:read
 *  Email Address: alexa::profile:email:read
 *  Phone Number: alexa::profile:mobile_number:read
 * 
 * @arg {CognigyScriptArray} `permissions` Permissions to confirm by the user. See documentation for possible values.
 */
async function respondWithPermissionCard(input: IFlowInput, args: {permissions: Array<string>}): Promise<IFlowInput | {}> {
    let jsonPayload:any = {
        "_cognigy": {
            "_alexa": {
                "response": {
                    "card":  {
                        "type": "AskForPermissionsConsent",
                        "permissions": args.permissions,
                    }
                }
            }
        }
    };
    input.actions.output(null,jsonPayload);
    return input;
}
module.exports.respondWithPermissionCard = respondWithPermissionCard;