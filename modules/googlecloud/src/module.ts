/**
 * translates a given text
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,zh-CN,zh-TW,co,hr,cs,da,nl,en,eo,et,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,hi,hmn,hu,is,ig,id,ga,it,ja,jw,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ny,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sq,sv,tl,tg,ta,te,th,tr,uk,ur,uz,vi,cy,xh,yi,yo,zu]} `language` to which language it should translate
 * @arg {CognigyScript} `text` to translate
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function translateText(input: IFlowInput, args: { secret: CognigySecret, language: string, text: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  /* validate node arguments */
  const { secret, language, text, writeToContext, store, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (!language) throw new Error("Language ist not defined.");
  if (!text) throw new Error("Text ist not defined.");
  if (writeToContext === undefined) throw new Error("Write to context flag not defined.");
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { key } = secret;
  if (!key) throw new Error("Secret is missing the 'key' field.");

  /* google translation package */
  const googleTranslate = require('google-translate')(key);

  return new Promise((resolve, reject) => {

    googleTranslate.translate(text, language, (err: any, translation: any) => {
      if (err) {
        if (stopOnError) { reject(err.message); return; }
        input.input[store] = { error: err.message };
        resolve(input);
      }
      if (writeToContext) input.actions.addToContext(store, translation.translatedText, 'simple');
      else input.input[store] = translation.translatedText;
      resolve(input);
    });
  });
}

module.exports.translateText = translateText;


/**
 * detects the language of a given sentence
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` to detect
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function detectLanguageInText(input: IFlowInput, args: { secret: CognigySecret, text: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  /* validate node arguments */
  const { secret, text, writeToContext, store, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (!text) throw new Error("Text ist not defined.");
  if (writeToContext === undefined) throw new Error("Write to context flag not defined.");
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { key } = secret;
  if (!key) throw new Error("Secret is missing the 'key' field.");

  /* google translation package */
  const googleTranslate = require('google-translate')(key);

  return new Promise((resolve, reject) => {

    googleTranslate.detectLanguage(text, (err: any, detection: any) => {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        input.input[store] = { error: err.message };
        resolve(input);
      }
      if (writeToContext) input.actions.addToContext(store, detection.language, 'simple');
      else input.input[store] = detection.language;
      resolve(input);
    });
  });
}

module.exports.detectLanguageInText = detectLanguageInText;