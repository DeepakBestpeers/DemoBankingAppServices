import { StatusCodes } from "http-status-codes";
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';

class trxService {
  constructor({ DateTimeUtil, logger, commonHelpers, trxModel }) {
    this.DateTimeUtil = DateTimeUtil;
    this.logger = logger;
    this.commonHelpers = commonHelpers;
    this.trxModel = trxModel;
  }

  /*
   Diposit amt service
   @requestData request body data
  */
  async dipositAmt(requestData) {
    try {
      // Destructure requestData object
      const { amount, userId } = requestData;

      const [accountInfo] = await this.trxModel.fetchObj({userId}, tableConstants.ACCOUNTS);
      
      const dipositData = {
        amount,
        type: commonConstants.TRX_TYPE.DEPOSIT,
        balanceAfter: (accountInfo.balance+amount),
        accId:accountInfo.id,
        createdAt: this.DateTimeUtil.getCurrentTimeObjForDB()
      };

      // Create diposit in the database
      await this.trxModel.createObj(dipositData, tableConstants.TRANSACTIONS);

      // Update account balance in the database
      await this.trxModel.updateObj({ balance: dipositData.balanceAfter, updatedAt: this.DateTimeUtil.getCurrentTimeObjForDB() }, { userId }, tableConstants.ACCOUNTS);

      // Return success response
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS",
        {currentBalance: dipositData.balanceAfter}
      );
    } catch (error) {
      // Log error if any occurs
      this.logger.error(error);
      // Return the error
      return error;
    }
  }

  /*
   Withdrawal amt service
   @requestData request body data
  */
  async withdrawalAmt(requestData) {
    try {
      // Destructure requestData object
      const { amount, userId } = requestData;

      const [accountInfo] = await this.trxModel.fetchObj({userId}, tableConstants.ACCOUNTS);
      
      if (amount>accountInfo.balance) {
        // return response insufficient fund
        return {
            status_code: StatusCodes.BAD_REQUEST,
            code: await this.commonHelpers.getResponseCode('INSUFFICIENT_FUND')
        };
      }

      const withdrawalData = {
        amount,
        type: commonConstants.TRX_TYPE.WITHDRAWAL,
        balanceAfter: (accountInfo.balance-amount),
        accId:accountInfo.id,
        createdAt: this.DateTimeUtil.getCurrentTimeObjForDB()
      };

      // Create withdrawal in the database
      await this.trxModel.createObj(withdrawalData, tableConstants.TRANSACTIONS);

      // Update account balance in the database
      await this.trxModel.updateObj({ balance: withdrawalData.balanceAfter, updatedAt: this.DateTimeUtil.getCurrentTimeObjForDB() }, { userId }, tableConstants.ACCOUNTS);

      // Return success response
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS",
        {currentBalance: withdrawalData.balanceAfter}
      );
    } catch (error) {
      // Log error if any occurs
      this.logger.error(error);
      // Return the error
      return error;
    }
  }

  /*
   Fund transfer service
   @requestData request body data
  */
  async fundTransfer(requestData) {
    try {

      // Destructure requestData object
      const { amount, userId, toAccountNo } = requestData;

      const [accountInfo] = await this.trxModel.fetchObj({userId}, tableConstants.ACCOUNTS);
      
      if (amount>accountInfo.balance) {
        // return response insufficient fund
        return {
            status_code: StatusCodes.BAD_REQUEST,
            code: await this.commonHelpers.getResponseCode('INSUFFICIENT_FUND')
        };
      }

      const [reciverInfo] = await this.trxModel.fetchObj({id:toAccountNo}, tableConstants.ACCOUNTS);

      if (!reciverInfo) {
        // return response insufficient fund
        return {
            status_code: StatusCodes.BAD_REQUEST,
            code: await this.commonHelpers.getResponseCode('INVALID_ACC_NO')
        };
      }


      const transferData = {
        amount,
        type: commonConstants.TRX_TYPE.TRANSFER,
        balanceAfter: (accountInfo.balance-amount),
        accId:accountInfo.id,
        targetAcc: reciverInfo.id,
        createdAt: this.DateTimeUtil.getCurrentTimeObjForDB()
      };

      // Create transfer in the database
      await this.trxModel.createObj(transferData, tableConstants.TRANSACTIONS);

      // Update sender account balance in the database
      await this.trxModel.updateObj({ balance: transferData.balanceAfter, updatedAt: this.DateTimeUtil.getCurrentTimeObjForDB() }, { userId }, tableConstants.ACCOUNTS);

      // Update reciver account balance in the database
      await this.trxModel.updateObj({ balance: (reciverInfo.balance+amount), updatedAt: this.DateTimeUtil.getCurrentTimeObjForDB() }, { userId:reciverInfo.userId }, tableConstants.ACCOUNTS);

      // Return success response
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS",
        {currentBalance: transferData.balanceAfter}
      );
      
    } catch (error) {
      // Log error if any occurs
      this.logger.error(error);
      // Return the error
      return error;
    }
  }

  /*
   Get statement service
   @reqQuery request pageNo, search
  */
  async getStatement(userId, reqQuery) {
    try {

      const [accountInfo] = await this.trxModel.fetchObj({userId}, tableConstants.ACCOUNTS);

      const where={
        accId:accountInfo.id 
      }

      let type = reqQuery.type,
          orderBy = reqQuery.orderBy,
          pageNo = reqQuery.pageNo,
          startDate = reqQuery.startDate,
          endDate = reqQuery.endDate;
      
      if (pageNo <= 0 || pageNo == undefined) {
          pageNo = 1;
      }

      let limit = commonConstants.DEFAULT_PAGINATION_LIMIT,
      offset = (pageNo - 1) * limit;
      
      var searchQuery = "";

      if (type != "" && type != undefined) {
          var searchValue = type.trim();
          searchQuery = `(type = '${searchValue}')`;
      }

      if (startDate != "" && startDate != undefined && endDate != "" && endDate != undefined) {
        if (searchQuery != "") {
            searchQuery += " AND ";
        }
        searchQuery += `(DATE(createdAt) BETWEEN DATE('${startDate}') AND DATE('${endDate}'))`;
      }


      orderBy = (orderBy != "" && orderBy != undefined)?"ASC":"DESC";

      // Fetch statement based on the query conditions
      const statement = await this.trxModel.fetchStatement(where, offset, false, searchQuery, orderBy);
      
      // Fetch total count of statement data
      const statementCount = await this.trxModel.fetchStatement(where, offset, true, searchQuery);

      
      const totalData = offset + limit;
      let loadMore = false;
            
      if (totalData < statementCount) {
        loadMore = true;
      }

      // Return success response
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS",
        {statement, loadMore, count:statementCount}
      );

    } catch (error) {
      // Log any errors that occur
      this.logger.error(error);
      // Return the error object
      return error;
    }
  }

}

module.exports = trxService;