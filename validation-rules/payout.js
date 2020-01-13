const payoutRules = {
    amount: "required|decimal",
    currency: "required",
    merchantId: "required",
    vendorOrderId: "required",
    notifyUrl: "required",
    bankName: "required",
    cardType: "required",
    accountType: "required",
    accountNumber: "required",
    accountName: "required",
    payoutOrderId: "required"
};

module.exports = payoutRules;