require('dotenv').config();
const { createContainer, asClass, asValue } = require('awilix');
var container = createContainer();

// global files
container.register({
  db: asValue(require("~/config/knexfile")),
  logger: asValue(require("~/utils/logger").default),
  DateTimeUtil: asClass(require('~/utils/DateTimeUtil')).singleton(),
  passwordHash: asValue(require("~/utils/passwordHash").default),
  checkApiHeaders: asValue(require("~/middlewares/checkApiHeaders")),
  jwtVerifyToken: asValue(require("~/middlewares/jwtVerifyToken")),
  JwtAuthSecurity: asClass(require('~/libraries/JwtAuthSecurity')).singleton(),
  commonHelpers: asValue(require("~/helpers/commonHelpers").default)
});

// response handler file
container.register({
  responseHandler: asClass(require('~/middlewares/responseHandler')).singleton()
});



/* ================== User Dependency Start ================== */
// User auth module related classes
container.register({
  authController: asClass(require('!/user/auth/controllers/authController')).singleton(),
  authService: asClass(require('!/user/auth/services/authService')).singleton(),
  authModel: asClass(require('!/user/auth/models/AuthModel')).singleton()
});

// transaction module related classes
container.register({
  trxController: asClass(require('!/user/transaction/controllers/trxController')).singleton(),
  trxService: asClass(require('!/user/transaction/services/trxService')).singleton(),
  trxModel: asClass(require('!/user/transaction/models/TrxModel')).singleton()
});

// Make the container available for other parts of your application
module.exports = container;