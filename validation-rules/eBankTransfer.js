const eBankTransferRules = {
    deviceType: "required",
    amount: "required|decimal",
    currency: "required",
    merchantId: "required",
    vendorOrderId: "required",
    paymentMethod: "required",
    productName: "required",
    notifyUrl: "required",
    returnUrl: "required",
    subIssuingBank: "required"
};

module.exports = eBankTransferRules;