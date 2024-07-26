import { Router } from "express";
import { dipositValidator } from "!/user/transaction/validators/dipositValidator";
import { fundTransferValidator } from "!/user/transaction/validators/fundTransferValidator";


// create object for transaction controller routes
const trx = new Router();

// Import the container
const container = require('~/dependency'),
        trxController = container.resolve("trxController"),
        checkApiHeaders = container.resolve("checkApiHeaders"),
        jwtVerifyToken = container.resolve("jwtVerifyToken");

/*
* create routes for dipositAmt method in trxController
*/
trx.post('/diposit', checkApiHeaders, jwtVerifyToken, dipositValidator, (req, res, next) => { trxController.dipositAmt(req, res, next); });

/*
* create routes for withdrawalAmt method in trxController
*/
trx.post('/withdrawal', checkApiHeaders, jwtVerifyToken, dipositValidator, (req, res, next) => { trxController.withdrawalAmt(req, res, next); });

/*
* create routes for fundTransfer method in trxController
*/
trx.post('/fundTransfer', checkApiHeaders, jwtVerifyToken, fundTransferValidator, (req, res, next) => { trxController.fundTransfer(req, res, next); });

/*
* create routes for getStatement method in trxController
*/
trx.post('/statement', checkApiHeaders, jwtVerifyToken, (req, res, next) => { trxController.getStatement(req, res, next); });


export { trx };