"use strict";

const transactionMapper = require("../mappers/transaction");
const errorResponseHandler = require("../utilities/pc-helpers/errorResponseHandler");
const transactionQueryRules = require("../validation-rules/transactionQuery");
const { transformer } = require("../utilities/transformers");
const { validate } = require("../utilities/validator");
const { generateSignature } = require("../utilities/generateSignature");
const { getTransactionQuery } = require("../models/transactionQuery");
const variables = require("../variables");


exports.transactionQuery = async function (ctx) {
    try {
        const transactionQueryRequest = ctx.request.body;

        validate(transactionQueryRequest, transactionQueryRules);

        const transactionQuery = transformer({
            fields: transactionQueryRequest,
            mapper: transactionMapper.transactionMapper,
            opts: ["-n", "-s"]
        });

        const sign = await generateSignature(transactionQuery);
        transactionQuery.sign = sign;
        transactionQuery.signType = "RSA";

        const transactionResponse = await getTransactionQuery(variables.onepayTransactionQueryUrl, transactionQuery);
        
        if (transactionResponse.flag === "SUCCESS" && transactionResponse.data.rows === 1) {
            let transactionStatus;
            if (transactionResponse.data.row_detail[0].tradeStatus === "PS_PAYMENT_SUCCESS"){
                 transactionStatus = "SUCCESS"
            }
            else if (transactionResponse.data.row_detail[0].tradeStatus === "PS_PAYMENT_FAIL"){
                transactionStatus = "FAIL"
            }
            else {
                transactionStatus = "PENDING"
            }
            const resData = {
                tradeTime: transactionResponse.data.row_detail[0].tradeTime,
                amount: transactionResponse.data.row_detail[0].amountFee,
                transactionStatus,
                vendorOrderId: transactionResponse.data.row_detail[0].merchantTradeId,
                payEndTime: transactionResponse.data.row_detail[0].payEndTime,
                currency: transactionResponse.data.row_detail[0].currency,
                vendorReferenceId: transactionResponse.data.row_detail[0].pwTradeId,
            }
            ctx.response.success(resData, "Transaction details fetched successfully");
        }
        else {
            ctx.response.badRequest(null, transactionResponse.errorMsg ? transactionResponse.errorMsg : "No transaction found")
        }

    } catch (error) {
        errorResponseHandler(ctx, error);
    }
};
