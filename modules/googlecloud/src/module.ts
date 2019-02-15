const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');

/*

Google Sheets methods

*/

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/*

End of helper methods

*/


/**
 * translates a given text
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,zh-CN,zh-TW,co,hr,cs,da,nl,en,eo,et,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,hi,hmn,hu,is,ig,id,ga,it,ja,jw,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ny,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sq,sv,tl,tg,ta,te,th,tr,uk,ur,uz,vi,cy,xh,yi,yo,zu]} `language` to which language it should translate
 * @arg {CognigyScript} `text` to translate
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function translation(input: IFlowInput, args: { secret: CognigySecret, language: string, text: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");
  if (!args.text) return Promise.reject("No text defined.");

  let googleTranslate = require('google-translate')(args.secret.key);

  return new Promise((resolve, reject) => {
    let result = {};

    googleTranslate.translate(args.text, args.language, function(err, translation) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        input.input[args.store] = result;
        resolve(input);
      }
      result = translation.translatedText;
      if (args.writeToContext) input.context.getFullContext()[args.store] = result;
      else input.input[args.store] = result;
      resolve(input);
    });


  });
}

// You have to export the function, otherwise it is not available
module.exports.translation = translation;


/**
 * detects the language of a given sentence
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` to detect
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function languageDetection(input: IFlowInput, args: { secret: CognigySecret, text: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");
  if (!args.text) return Promise.reject("No text defined.");

  let googleTranslate = require('google-translate')(args.secret.key);

  return new Promise((resolve, reject) => {
    let result = {};

    googleTranslate.detectLanguage(args.text, function(err, detection) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        input.input[args.store] = result;
        resolve(input);
      }
      result = detection.language;
      if (args.writeToContext) input.context.getFullContext()[args.store] = result;
      else input.input[args.store] = result;
      resolve(input);
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.languageDetection = languageDetection;


/**
 * detects the language of a given sentence
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `spreadsheetId` of the google sheet
 * @arg {CognigyScript} `range` of the data in the sheet
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getDataFromSheet(input: IFlowInput, args: { secret: CognigySecret, spreadsheetId: string, range: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");
  if (!args.spreadsheetId) return Promise.reject("No spreadsheet ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};

    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), (auth) =>{
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({
          spreadsheetId: args.spreadsheetId,
          range: args.range,
        }, (err, res) => {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            result = { "error": err.message };
            input.input[args.store] = result;
            resolve(input);
          }
          const rows = res.data.values;
          if (rows.length) {
            console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.

            let body = [];
            rows.map((row) => {
              // console.log(`${row[0]}`);
              body.push(`${row[0]}`)
            });
            result = body;
            if (args.writeToContext) input.context.getFullContext()[args.store] = result;
            else input.input[args.store] = result;
            resolve(input);
          } else {
            if (args.stopOnError) { reject(err.message); return; }
            result = { "error": 'No data found.'};
            input.input[args.store] = result;
            resolve(input);
          }
        });
      });
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.getDataFromSheet = getDataFromSheet;

