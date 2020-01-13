
const qrCodeMapper = require("../mappers/qrCode");
const errorResponseHandler = require("../utilities/pc-helpers/errorResponseHandler");
const qrCodeRules = require("../validation-rules/qrCode");
const { transformer } = require("../utilities/transformers");
const { validate } = require("../utilities/validator");
const { getQRCodeURL } = require("../models/qrCode");
const variables = require("../variables");

exports.qrCode = async function (ctx) {
    try {
        const {
            merchantId,
            vendorOrderId,
            currency,
            amount
        } = ctx.request.body;

        const qrCodeRequest = {
            merchantId,
            vendorOrderId,
            currency,
            amount,
            issuingBank: variables.issuingBank
        }
        validate(qrCodeRequest, qrCodeRules);

        const qrCode = transformer({
            fields: qrCodeRequest,
            mapper: qrCodeMapper.qrCodeMapper,
            opts: []
        });
        
        console.log(qrCode);
        
        // OnePay Gateway
        const qrCodeResponse = await getQRCodeURL(variables.qrCodeRequestUrl, qrCode);
        if (qrCodeResponse.flag === 'FAILED') {
            ctx.response.badRequest(null, qrCodeResponse.errorMsg);
        } else {
            const resData = {
                qrUrl: qrCodeResponse.data.qrUrl
            }

            ctx.response.ok(resData, 'Successfully generated QR URL');
        }

    } catch (error) {
        errorResponseHandler(ctx, error);
    }
};