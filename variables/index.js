"use strict";

const env = process.env.NODE_ENV || "development";
const host = process.env.APP_HOST || "localhost";
const port = process.env.APP_PORT || 1919;
const name = process.env.APP_NAME || "pm-onepay-adapter";
const logLevel = process.env.LOG_LEVEL;
const awsRegion = process.env.AWS_REGION;


const onepayAPI = process.env.ONEPAY_API_URL;
const onepayAPIProxy = process.env.ONEPAY_API_PROXY_URL;
const onepayCheckoutUrl = onepayAPI + process.env.ONEPAY_CHECKOUT_URL;
const onepayTransactionQueryUrl = onepayAPI + process.env.ONEPAY_TRANSACTION_QUERY_URL;
const onepayPrivateKeyLocation = process.env.ONEPAY_PRIVATE_KEY;
const onepayPayoutUrl = onepayAPI + process.env.ONEPAY_PAYOUT_URL;
const onepayPayoutQueryUrl = onepayAPI + process.env.ONEPAY_PAYOUT_QUERY_URL;
const notifyUrl = process.env.ONEPAY_NOTIFY_URL;
const apiVersion = process.env.ONEPAY_API_VERSION;
const charSet = process.env.ONEPAY_CHAR_SET;
const cardType = process.env.ONEPAY_CARD_TYPE;
const bankTransferMethod = process.env.ONEPAY_BANK_TRANSFER_METHOD;
const unionPayMethod = process.env.ONEPAY_UNION_PAY_METHOD;
const p2pMethod = process.env.ONEPAY_P2P_METHOD;
const issuingBank = process.env.ONEPAY_ISSUING_BANK;
const batchRecord = process.env.ONEPAY_BATCH_RECORD;
const isWithdrawNow = process.env.ONEPAY_IS_WITHDRAW_NOW;
const payoutNotifyUrl = process.env.ONEPAY_PAYOUT_NOTIFY_URL;
const qrCodeRequestUrl = onepayAPI + process.env.ONEPAY_QRCODE_REQUEST_URL;
const returnUrl = process.env.ONEPAY_RETURN_URL;
// const unionpayGatewayProxy = process.env.ONEPAY_UNIONPAY_PROXY;
// const thirdPartyGatewayProxy = process.env.ONEPAY_THIRDPARTY_PROXY;
// const unionpayFormEndpoint = process.env.ONEPAY_UNIONPAY_FORM_ENDPOINT;

const variables = {
  env,
  host,
  logLevel,
  name,
  port,
  onepayCheckoutUrl,
  onepayPayoutUrl,
  onepayPrivateKeyLocation,
  onepayTransactionQueryUrl,
  onepayPayoutQueryUrl,
  awsRegion,
  notifyUrl,
  apiVersion,
  charSet,
  cardType,
  bankTransferMethod,
  unionPayMethod,
  p2pMethod,
  issuingBank,
  batchRecord,
  isWithdrawNow,
  payoutNotifyUrl,
  qrCodeRequestUrl,
  returnUrl,
  onepayAPI,
  onepayAPIProxy
  // unionpayGatewayProxy,
  // thirdPartyGatewayProxy,
  // unionpayFormEndpoint
};

module.exports = variables;
