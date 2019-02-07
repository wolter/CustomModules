/**
 * Logs a message with the given level (see project's log). 
 * @arg {Select[info,error,debug]} `level` log level
 * @arg {CognigyScript} `message` log message
 * @arg {CognigyScript} `console` log to browser console if channel is webchat (experimental use on your own risk)
 */
async function log(input: IFlowInput, args: { level: string, message: string, console: string}): Promise<IFlowInput | {}> {  
    
    input.actions.log(args.level, args.message);

    // Hacky way of using the browser console for debugging.
    if (input.input.channel === "webchat" && args.console) {
        input.actions.output("<iframe style='display: none;' srcdoc='<html><head><script>console.log(" + args.console + ");</script></head></html>' />", null);
    }

    return input;
}
module.exports.log = log;