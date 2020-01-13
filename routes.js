

const Router = require("koa-router");

const eBankTransferController = require("./controllers/eBankTransfer");
const p2pController = require("./controllers/p2p");
const unionPayoutPortalController = require("./controllers/unionPayoutPortal");
const transactionQueryController = require("./controllers/transactionQuery");
const payoutController = require("./controllers/payout");
const payoutQueryController = require("./controllers/payoutQuery");
const qrCodeController = require("./controllers/qrCode");
const health = require("./controllers/health");

const router = new Router();

router.post("/bank-transfer", eBankTransferController.eBankTransfer);
router.post("/p2p", p2pController.P2P);
router.post("/quickpay", unionPayoutPortalController.unionPayoutPortal);
router.post("/transactions", transactionQueryController.transactionQuery);
router.post("/payout", payoutController.payout);
router.post("/payout-query", payoutQueryController.payoutQuery);
router.post("/qr-code", qrCodeController.qrCode);
router.get("/health", health.check);

module.exports = router;