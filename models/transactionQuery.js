"use strict";

const axios = require('axios');
const querystring = require('querystring');

exports.getTransactionQuery = async function (actionURL, params) {

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const transactionResponse = await axios.post(actionURL, querystring.stringify(params), config);

    return transactionResponse.data;
}