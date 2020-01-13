const unionPayoutPortalRules = {
    deviceType: "required",
    amount: "required|decimal",
    currency: "required",
    merchantId: "required",
    vendorOrderId: "required",
    paymentMethod: "required",
    productName: "required",
    notifyUrl: "required",
    returnUrl: "required",
};

module.exports = unionPayoutPortalRules;