"use strict";

const transactionMapper = require("../mappers/transaction");
const errorResponseHandler = require("../utilities/pc-helpers/errorResponseHandler");
const p2pRules = require("../validation-rules/p2p");
const { transformer } = require("../utilities/transformers");
const { validate } = require("../utilities/validator");
const { generateSignature, objectToParamString } = require("../utilities/generateSignature");
const { gateWayHandler } = require("../models/p2p");
const { htmlHandler, parseBankDetails, htmlErrorHandler } = require("../utilities/htmlHandler");
const variables = require("../variables");


exports.P2P = async function (ctx) {
    try {
        const p2pRequest = ctx.request.body;

        p2pRequest.notifyUrl = variables.notifyUrl;
        p2pRequest.returnUrl = variables.returnUrl;
        p2pRequest.version = variables.apiVersion;
        p2pRequest.inputCharSet = variables.charSet;
        p2pRequest.cardType = variables.cardType;
        p2pRequest.paymentMethod = variables.p2pMethod;
        p2pRequest.issuingBank = variables.issuingBank;

        validate(p2pRequest, p2pRules);

        const p2p = transformer({
            fields: p2pRequest,
            mapper: transactionMapper.transactionMapper,
            opts: ["-n", "-s"]
        });

        console.log(p2p);

        const sign = await generateSignature(p2p);
        p2p.sign = sign;
        p2p.signType = "RSA";

        console.log(sign);


        // OnePay Gateway

        const gateWayResponseHTMLOne = await gateWayHandler(variables.onepayCheckoutUrl, p2p, "POST");
        const gatewayOneErrorMsg = htmlErrorHandler(gateWayResponseHTMLOne);
        if (gatewayOneErrorMsg) {
            ctx.response.badRequest(null, gatewayOneErrorMsg);
        } else {
            const { formObj: p2pParamsOne, actionURL: p2pActionURLOne, methodType: methodOne } = htmlHandler(gateWayResponseHTMLOne);
            const p2pParamStringOne = objectToParamString(p2pParamsOne);

            // Final Gateway
            const gateWayResponseHTMLTwo = await gateWayHandler(p2pActionURLOne, p2pParamStringOne, methodOne);
            const gatewayTwoErrorMsg = htmlErrorHandler(gateWayResponseHTMLTwo);
            if (gatewayTwoErrorMsg) {
                ctx.response.badRequest(null, gatewayTwoErrorMsg);
            }
            else {
                const { formObj: p2pParamsTwo, actionURL: p2pActionURLTwo, methodType: methodTwo } = htmlHandler(gateWayResponseHTMLTwo);
                // Bank Accounts Data 
                const gateWayResponseHTMLThree = await gateWayHandler(p2pActionURLTwo, p2pParamsTwo, methodTwo);
                if (!!gateWayResponseHTMLThree.status) {
                    ctx.response.badRequest(null, gateWayResponseHTMLThree.respmsg);
                } else {
                    const bankDetails = parseBankDetails(gateWayResponseHTMLThree);
                    ctx.response.ok(bankDetails, "Bank details fetched successfully");
                }
            }
        }
    } catch (error) {
        errorResponseHandler(ctx, error);
    }
};