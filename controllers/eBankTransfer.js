
const transactionMapper = require("../mappers/transaction");
const errorResponseHandler = require("../utilities/pc-helpers/errorResponseHandler");
const eBankTransferRules = require("../validation-rules/eBankTransfer");
const { transformer } = require("../utilities/transformers");
const { validate } = require("../utilities/validator");
const { generateSignature, objectToParamString } = require("../utilities/generateSignature");
const { gateWayHandler } = require("../models/eBankTransfer")
const { htmlHandler, htmlErrorHandler } = require("../utilities/htmlHandler");
const variables = require("../variables");

exports.eBankTransfer = async function (ctx) {
    try {
        const eBankTransferRequest = ctx.request.body;
        eBankTransferRequest.notifyUrl = variables.notifyUrl;
        eBankTransferRequest.returnUrl = variables.returnUrl;
        eBankTransferRequest.version = variables.apiVersion;
        eBankTransferRequest.inputCharSet = variables.charSet;
        eBankTransferRequest.paymentMethod = variables.bankTransferMethod;
        eBankTransferRequest.issuingBank = variables.issuingBank;
        validate(eBankTransferRequest, eBankTransferRules);
        const eBankTransfer = transformer({
            fields: eBankTransferRequest,
            mapper: transactionMapper.transactionMapper,
            opts: ["-n", "-s"]
        });

        //console.log(eBankTransfer);

        const sign = await generateSignature(eBankTransfer);
        eBankTransfer.sign = sign;
        eBankTransfer.signType = "RSA"
        
        console.log(eBankTransfer);
        
        // OnePay Gateway
        const gateWayResponseHTMLOne = await gateWayHandler(variables.onepayCheckoutUrl, eBankTransfer, "POST");
      
        const gatewayOneErrorMsg = htmlErrorHandler(gateWayResponseHTMLOne);
        if (gatewayOneErrorMsg) {
            ctx.response.badRequest(null, gatewayOneErrorMsg);
        } else {
            const gatewayResponse = gateWayResponseHTMLOne.replace(variables.onepayAPI, variables.onepayAPIProxy);
            ctx.body = gatewayResponse;
            // const { formObj: eBankTransferParamsOne, actionURL: eBankTransferActionURLOne, methodType: methodOne } = htmlHandler(gateWayResponseHTMLOne);
            // const eBankTransferParamStringOne = objectToParamString(eBankTransferParamsOne);

            // // Gateway Connection One
            // const gateWayResponseHTMLTwo = await gateWayHandler(variables.unionpayGatewayProxy, eBankTransferParamStringOne, methodOne);
            // const gatewayTwoErrorMsg = htmlErrorHandler(gateWayResponseHTMLTwo);
            // if (gatewayTwoErrorMsg) {
            //     ctx.response.badRequest(null, gatewayTwoErrorMsg);
            // }
            // else {
            //     const { formObj: eBankTransferParamsTwo, actionURL: eBankTransferActionURLTwo, methodType: methodTwo } = htmlHandler(gateWayResponseHTMLTwo);
            //     // Final Gateway 
            //     const gateWayResponseHTMLThree = await gateWayHandler(variables.thirdPartyGatewayProxy, eBankTransferParamsTwo, methodTwo);
            //     ctx.body = gateWayResponseHTMLThree;
            // }
        }
    } catch (error) {
        errorResponseHandler(ctx, error);
    }
};