"use strict";

const axios = require('axios');
const querystring = require('querystring');

exports.gateWayHandler = async function (actionURL, params, method) {

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    let gateWayResponse;

    switch (method.toUpperCase()) {
        case "GET":
            gateWayResponse = await axios.get(actionURL + "?" + params)
            break
        case "POST":
            gateWayResponse = await axios.post(actionURL, querystring.stringify(params), config)
            break
        default:
            return "Unrecognised methods";
    }

    return gateWayResponse.data;
}