"use strict";

const Validator = require('validatorjs');

Validator.register(
    "decimal",
    value => {
        let val = String(value);
        return val.match(/^\d+(\.\d{1,})?$/);
    },
    "The :attribute is not a positive decimal number."
);

exports.validate = (data, rules, messages) => {
    const validation = new Validator(data, rules, messages);

    if (validation.fails()) {
        throw {
            status: 400,
            message: "Invalid Parameter(s)",
            data: validation.errors
        };
    }

    return validation.passes();
};