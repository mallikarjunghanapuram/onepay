"use strict";

const axios = require('axios');

exports.getPayoutStatus = async function (actionURL, {
    batchNo,
    merchantId,
    sign,
    signType
}) {
    const params = {
        batchNo,
        merchantId,
        sign,
        signType
    }
    const payoutQueryResponse = await axios.post(actionURL, params);
    return payoutQueryResponse.data;
}