"use strict";

const axios = require('axios');

exports.requestPayout = async function (actionURL, {
    batchNo,
    batchRecord,
    currencyCode,
    isWithdrawNow,
    merchantId,
    notifyUrl,
    payDate,
    totalAmount,
    sign,
    signType,
    detailList
}) {
    const params = {
        batchNo,
        batchRecord,
        currencyCode,
        isWithdrawNow,
        merchantId,
        notifyUrl,
        payDate,
        totalAmount,
        sign,
        signType,
        detailList
    }
    const payoutResponse = await axios.post(actionURL, params);
    return payoutResponse.data;
}