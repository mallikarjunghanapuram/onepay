const qrCodeRules = {
    amount: "required|decimal",
    currency: "required",
    merchantId: "required",
    vendorOrderId: "required",
    issuingBank: "required"
};

module.exports = qrCodeRules;