/**  
* const signature = generateSignature(object)
*
* object    = 
**/

const crypto = require("crypto");
const variables = require("../variables");
const parameterStoreService = require("../utilities/parameterStore");


exports.generateSignature = async object => {
    let private_key;
    if (!private_key) {
      private_key = await parameterStoreService.getParameter(
        variables.onepayPrivateKeyLocation
      );
    }

    console.log(private_key);

    let paramString = objectToParamString(object);
    const signer = crypto.createSign("RSA-SHA1");
    signer.update(paramString);
    signer.end();

    console.log(paramString);
    const signature = signer.sign(private_key, "base64");
    const buffer = Buffer.from(signature);
    const signature_hex = buffer.toString("hex");
    
    return signature_hex;


};

const objectToParamString = requestObj => {
    const paramString = Object.entries(requestObj)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
    return paramString;
};

exports.objectToParamString = objectToParamString;
