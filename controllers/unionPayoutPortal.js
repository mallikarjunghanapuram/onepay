"use strict";

const transactionMapper = require("../mappers/transaction");
const errorResponseHandler = require("../utilities/pc-helpers/errorResponseHandler");
const unionPayoutPortalRules = require("../validation-rules/unionPayoutPortal");
const { transformer } = require("../utilities/transformers");
const { validate } = require("../utilities/validator");
const {
    generateSignature,
    objectToParamString
} = require("../utilities/generateSignature");
const { gateWayHandler } = require("../models/unionPayoutPortal");
const { htmlHandler, htmlErrorHandler } = require("../utilities/htmlHandler");
const variables = require("../variables");

exports.unionPayoutPortal = async function (ctx) {
    try {
        const unionPayoutPortalRequest = ctx.request.body;

        unionPayoutPortalRequest.notifyUrl = variables.notifyUrl;
        unionPayoutPortalRequest.returnUrl = variables.returnUrl;
        unionPayoutPortalRequest.version = variables.apiVersion;
        unionPayoutPortalRequest.inputCharSet = variables.charSet;
        unionPayoutPortalRequest.cardType = variables.cardType;
        unionPayoutPortalRequest.paymentMethod = variables.unionPayMethod;
        unionPayoutPortalRequest.issuingBank = variables.issuingBank;

        validate(unionPayoutPortalRequest, unionPayoutPortalRules);

        const unionPayoutPortal = transformer({
            fields: unionPayoutPortalRequest,
            mapper: transactionMapper.transactionMapper,
            opts: ["-n", "-s"]
        });

        console.log(unionPayoutPortal);

        const sign = await generateSignature(unionPayoutPortal);
        unionPayoutPortal.sign = sign;
        unionPayoutPortal.signType = "RSA";

        // console.log(unionPayoutPortal);

        // OnePay Gateway
        const gateWayResponseHTMLOne = await gateWayHandler(
            variables.onepayCheckoutUrl,
            unionPayoutPortal,
            "POST"
        );
        const gatewayOneErrorMsg = htmlErrorHandler(gateWayResponseHTMLOne);
        if (gatewayOneErrorMsg) {
            ctx.response.badRequest(null, gatewayOneErrorMsg);
        } else {
            const gatewayResponse = gateWayResponseHTMLOne.replace(variables.onepayAPI, variables.onepayAPIProxy);
            ctx.body = gatewayResponse;
            // const {
            //     formObj: unionPayoutPortalParamsOne,
            //     actionURL: unionPayoutPortalActionURLOne,
            //     methodType: methodOne
            // } = htmlHandler(gateWayResponseHTMLOne);
            // const unionPayoutPortalParamStringOne = objectToParamString(
            //     unionPayoutPortalParamsOne
            // );

            // // Final Gateway 
            // const gateWayResponseHTMLTwo = await gateWayHandler(
            //     unionPayoutPortalActionURLOne,
            //     unionPayoutPortalParamStringOne,
            //     methodOne
            // );
            // const gatewayTwoErrorMsg = htmlErrorHandler(gateWayResponseHTMLTwo);
            // if (gatewayTwoErrorMsg) {
            //     ctx.response.badRequest(null, gatewayTwoErrorMsg);
            // } else {
            //     ctx.body = gateWayResponseHTMLTwo;
            // }
        }
    } catch (error) {
        errorResponseHandler(ctx, error);
    }
};
