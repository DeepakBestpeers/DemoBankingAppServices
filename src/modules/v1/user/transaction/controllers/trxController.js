class trxController {

    constructor({ trxService, responseHandler }) {
        this.trxService = trxService;
        this.responseHandler = responseHandler
    }

    // Diposit controller
    async dipositAmt(req, res, next) {
        req.body.userId = req.user.user_id;
        const returnData = await this.trxService.dipositAmt(req.body);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }

    // Withdrawal controller
    async withdrawalAmt(req, res, next) {
        req.body.userId = req.user.user_id;
        const returnData = await this.trxService.withdrawalAmt(req.body);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }

    // Fund transfer controller
    async fundTransfer(req, res, next) {
        req.body.userId = req.user.user_id;
        const returnData = await this.trxService.fundTransfer(req.body);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }

    // Statement controller
    async getStatement(req, res, next) {
        const returnData = await this.trxService.getStatement(req.user.user_id,req.query);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }
}

module.exports = trxController;

