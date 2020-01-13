"use strict";

const axios = require('axios');
const querystring = require('querystring');

exports.getQRCodeURL = async function (actionURL, params, method) {

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    let gateWayResponse = await axios.post(actionURL, querystring.stringify(params), config);

    return gateWayResponse.data;
}