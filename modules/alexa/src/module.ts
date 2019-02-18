import * as request_promise from 'request-promise';

function handleError(input: IFlowInput, error:Error, stopOnError:boolean, writeToContext:boolean, store:string): IFlowInput | {}  {

    input.actions.log("error", error.message);

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

function isAlexa(input: IFlowInput): Boolean  {
    // Check current channel...
    return (input.input.channel === "alexa");
}

/**
 * Create an "ask for permission consent" card using a list of permissions such as alexa::alerts:reminders:skill:readwrite, read::alexa:device:all:address etc.
 * 
 * @arg {CognigyScriptArray} `permissions` Permissions to confirm by the user. See documentation for possible values.
 */
async function respondWithPermissionCard(input: IFlowInput, args: {permissions: Array<string>}): Promise<IFlowInput | {}> {
    let jsonPayload:any = {
        _cognigy: {
            _alexa: {
                response: {
                    card:  {
                        type: "AskForPermissionsConsent",
                        permissions: args.permissions,
                    }
                }
            }
        }
    };
    input.actions.output(null,jsonPayload);
    return input;
}
module.exports.respondWithPermissionCard = respondWithPermissionCard;

/**
 * Call Alexa API.
 * 
 * @arg {String} `path` Alexa API path to call (something like "/v1/devices/${deviceId}/settings/address")
 * @arg {JSON} `payload` The payload to send to the Alexa API
 * @arg {Select[GET,POST,PUT,DELETE]} `method` The REST method to be used
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function callAlexaAPI(input: IFlowInput, args: { path:string, payload:any, method:string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // Check current channel...
    if (!isAlexa(input)) {
        const error:Error = new Error("Wrong channel. Channel must be Amazon Alexa.");
        return handleError(input, error, false, args.writeToContext, args.store);        
    }

    try {

        const token: string = input.data.context.System.user.permissions.consentToken;
        const deviceId: string = input.data.context.System.device.deviceId;
        const apiEndpoint: string = input.data.context.System.apiEndpoint;

        // Update these options with the details of the web service you would like to call
        const options: request_promise.OptionsWithUri = {
            uri: `${apiEndpoint}${args.path}`,
            json: true,
            body: args.payload,
            headers: { 'Authorization': `Bearer ${token}` }
        };

        let result:Request;
        // Handle request
        switch (args.method) {
            case "GET":     
                result = await request_promise.get(options);
                break;
            case "POST":
                result = await request_promise.post(options);
                break;
            case "PUT":
                result = await request_promise.put(options);
                break;                
            case "DELETE":
                result = await request_promise.delete(options);
                break;
            default:
                result = await request_promise.get(options);              
        }
        
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        return input;

    } catch (error) {
        return handleError(input, error.error, args.stopOnError, args.writeToContext, args.store); 
    }
}

module.exports.callAlexaAPI = callAlexaAPI;

/**
 * Get current's device address.
 * 
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getDeviceAddress(input: IFlowInput, args: { writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // Check current channel...
    if (!isAlexa(input)) {
        const error:Error = new Error("Wrong channel. Channel must be Amazon Alexa.");
        return handleError(input, error, false, args.writeToContext, args.store);        
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
 * Set a relative reminder and returns a confirmation.
 * 
 * @arg {String} `text` Reminder`s message text
 * @arg {Number} `offsetInSeconds` Time until reminding
 * @arg {Boolean} `pushNotification` Pushnotification enabled
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function setRelativeReminder(input: IFlowInput, args: { writeToContext: boolean, store: string, text: string, offsetInSeconds:number, pushNotification:boolean, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // Check current channel...
    if (!isAlexa(input)) {
        const error:Error = new Error("Wrong channel. Channel must be Amazon Alexa.");
        return handleError(input, error, false, args.writeToContext, args.store);        
    }

    try {

        const token: string = input.data.context.System.apiAccessToken;
        const apiEndpoint: string = input.data.context.System.apiEndpoint;
        
        const locale:string = input.data.request.locale;
        const requestTime:string = input.data.request.timestamp;    
        
       const body:any = {
            requestTime: requestTime,
            trigger: {
                type: "SCHEDULED_RELATIVE",
                offsetInSeconds: args.offsetInSeconds
            },
            alertInfo: {
                spokenInfo: {
                    content: [
                        {
                            locale: locale,
                            text: args.text
                        }
                    ]
                }
            },
            pushNotification: {
                status: args.pushNotification ? "ENABLED" : "DISABLED"
            }
        }

        // Update these options with the details of the web service you would like to call
        const options: request_promise.OptionsWithUri = {
            uri: `${apiEndpoint}/v1/alerts/reminders`,
            json: true,
            body: body,
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
 * Set an absolute reminder and returns a confirmation.
 * 
 * @arg {String} `text` Reminder`s message text
 * @arg {String} `scheduledTime` Scheduled time in valid ISO 8601 format without timezone
 * @arg {String} `timeZoneId` Timezone according to https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 * @arg {Select[ONCE,WEEKLY,DAILY]} `frequency` Frequency type of the recurrence (WEEKLY, DAILY)
 * @arg {Boolean} `sunday` Sunday
 * @arg {Boolean} `monday` Monday
 * @arg {Boolean} `tuesday` Tuesday
 * @arg {Boolean} `wednesday` Wednesday
 * @arg {Boolean} `thursday` Thursday
 * @arg {Boolean} `friday` Friday
 * @arg {Boolean} `saturday` Saturday
 * @arg {Boolean} `pushNotification` Pushnotification enabled
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function setAbsoluteReminder(input: IFlowInput, args: { 
    writeToContext: boolean, store: string, 
    text: string, 
    scheduledTime:string, timeZoneId:string, frequency:String, 
    monday:boolean, tuesday:boolean, wednesday:boolean, thursday: boolean, friday:boolean, saturday:boolean, sunday:boolean,    
    pushNotification:boolean, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // Check current channel...
    if (!isAlexa(input)) {
        const error:Error = new Error("Wrong channel. Channel must be Amazon Alexa.");
        return handleError(input, error, false, args.writeToContext, args.store);        
    }

    try {

        const token: string = input.data.context.System.apiAccessToken;
        const apiEndpoint: string = input.data.context.System.apiEndpoint;
        const days:Array<string> = new Array<string>();
        const locale:string = input.data.request.locale;
        const requestTime:string = input.data.request.timestamp;

        let recurrence:any;

        switch (args.frequency) {
            case "DAILY":
                recurrence = {                     
                    freq : args.frequency,         
                };
                break;
            case "WEEKLY":
                recurrence = {                     
                    freq : args.frequency,         
                    byDay: []
                };
                if (args.monday) recurrence.byDay.push("MO");
                if (args.tuesday) recurrence.byDay.push("TU");
                if (args.wednesday) recurrence.byDay.push("WE");
                if (args.thursday) recurrence.byDay.push("TH");
                if (args.friday) recurrence.byDay.push("FR");
                if (args.saturday) recurrence.byDay.push("SA");
                if (args.sunday) recurrence.byDay.push("SU");
                break;
            default:
                // nothing
        } 

        const body:any =  
        {
            requestTime : requestTime,
            trigger: {
                 type : "SCHEDULED_ABSOLUTE",
                 scheduledTime : args.scheduledTime,
                 timeZoneId : args.timeZoneId,
                 recurrence : recurrence,
            },
            alertInfo: {
                 spokenInfo: {
                     content: [{
                         locale: locale, 
                         text: args.text
                     }]
                 }
             },
             pushNotification : {                            
                  "status" : args.pushNotification?"ENABLED":"DISABLED"
             }
        };

        // Update these options with the details of the web service you would like to call
        const options: request_promise.OptionsWithUri = {
            uri: `${apiEndpoint}/v1/alerts/reminders`,
            json: true,
            body: body,
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

module.exports.setAbsoluteReminder = setAbsoluteReminder;