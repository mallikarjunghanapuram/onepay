
const payoutQueryMapper = require("../mappers/payout");
const errorResponseHandler = require("../utilities/pc-helpers/errorResponseHandler");
const payoutQueryRules = require("../validation-rules/payoutQuery");
const { transformer } = require("../utilities/transformers");
const { validate } = require("../utilities/validator");
const { generateSignature } = require("../utilities/generateSignature");
const { getPayoutStatus } = require("../models/payoutQuery");
const variables = require("../variables");
const { payoutResponseStatus } = require('../utilities/responseStatusFormatter');

exports.payoutQuery = async function (ctx) {
    try {
        const {
            vendorOrderId,
            merchantId

        } = ctx.request.body;

        const payoutQueryRequest = {
            vendorOrderId,
            merchantId
        }

        validate(payoutQueryRequest, payoutQueryRules);

        const payoutQuery = transformer({
            fields: payoutQueryRequest,
            mapper: payoutQueryMapper.payoutMapper,
            opts: ["-n", "-s"]
        });

        const sign = await generateSignature(payoutQuery);

        payoutQuery.sign = sign;
        payoutQuery.signType = "RSA"

        // OnePay Gateway
        const payoutStatusResponse = await getPayoutStatus(variables.onepayPayoutQueryUrl, payoutQuery);
        if (payoutStatusResponse.flag === 'FAILED') {
            ctx.response.badRequest(null, payoutStatusResponse.errorMsg);
        } else {
            payoutStatusResponse.transactionStatus = payoutResponseStatus(payoutStatusResponse.data.status);
            ctx.response.ok(payoutStatusResponse, 'Successfully fetched details');
        }

    } catch (error) {
        errorResponseHandler(ctx, error);
    }
};