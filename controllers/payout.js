
const payoutMapper = require("../mappers/payout");
const errorResponseHandler = require("../utilities/pc-helpers/errorResponseHandler");
const payoutRules = require("../validation-rules/payout");
const { transformer } = require("../utilities/transformers");
const { validate } = require("../utilities/validator");
const { generateSignature } = require("../utilities/generateSignature");
const { requestPayout } = require("../models/payout");
const variables = require("../variables");
const { payoutPurpose } = require("../utilities/payoutPurposeFormatter");

exports.payout = async function (ctx) {
    console.log("inside payout");
    
    try {
        const {
            merchantId,
            vendorOrderId,
            currency,
            accountType,
            cardType,
            payoutOrderId,
            amount,
            bankName,
            subBankName,
            swiftCode,
            accountNumber,
            bankProvince,
            bankCity,
            accountName,
            receivePhone,
            productName,
            purpose,
        } = ctx.request.body;
        console.log(ctx.request.body);
        const date = new Date().toLocaleString("zh-CH", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" });
        const payoutRequest = {
            merchantId,
            vendorOrderId,
            currency,
            cardType,
            accountType,
            payoutOrderId,
            amount,
            bankName,
            subBankName,
            swiftCode,
            accountNumber,
            bankProvince,
            bankCity,
            accountName,
            receivePhone,
            productName,
            purpose,
            notifyUrl: variables.payoutNotifyUrl,
            batchRecord: variables.batchRecord,
            isWithdrawNow: variables.isWithdrawNow,
            totalAmount: amount,
            payDate: date.slice(6, 10) + date.slice(0, 6).replace(/\//g, ''),
        }
        validate(payoutRequest, payoutRules);

        const payout = transformer({
            fields: payoutRequest,
            mapper: payoutMapper.payoutMapper,
            opts: []
        });

        const payoutRequestBody = {
            batchNo: payout.batchNo,
            batchRecord: payout.batchRecord,
            currencyCode: payout.currencyCode,
            isWithdrawNow: payout.isWithdrawNow,
            merchantId: payout.merchantId,
            notifyUrl: payout.notifyUrl,
            payDate: payout.payDate,
            totalAmount: payout.totalAmount
        }
        console.log(payoutRequestBody)
        const sign = await generateSignature(payoutRequestBody);
        console.log(sign);
        const detailList = [{
            subBankName: payout.receiveType,
            amount: payout.amount,
            receivePhone: payout.receivePhone,
            purpose: payoutPurpose(payout.purpose),
            accountType: payout.accountType,
            swiftCode: payout.swiftCode,
            bankName: payout.bankName,
            remark: payout.remark,
            bankCity: payout.bankCity,
            serialNo: payout.serialNo,
            receiveName: payout.receiveName,
            bankNo: payout.bankNo,
            bankProvince: payout.bankProvince,
            receiveType: payout.receiveType,
        }]

        payoutRequestBody.sign = sign;
        payoutRequestBody.signType = "RSA"
        payoutRequestBody.detailList = detailList;

        // console.log(payout);

        // OnePay Gateway
        const requestPayoutResponse = await requestPayout(variables.onepayPayoutUrl, payoutRequestBody);
        if (requestPayoutResponse.flag === 'FAILED') {
            ctx.response.badRequest(null, requestPayoutResponse.errorMsg);
        } else {
            const resData = {
                amount: requestPayoutResponse.data.totalAmount,
                currency: requestPayoutResponse.data.currencyCode,
                vendorOrderId: requestPayoutResponse.data.batchNo,
                payDate: requestPayoutResponse.data.payDate
            }
            ctx.response.ok(resData, 'Successfully initiated payout');
        }

    } catch (error) {
        errorResponseHandler(ctx, error);
    }
};