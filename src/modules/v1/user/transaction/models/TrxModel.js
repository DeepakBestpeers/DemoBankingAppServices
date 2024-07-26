import BaseModel from '~/models/BaseModel';
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';

class TrxModel extends BaseModel {
  constructor({ db, logger }) {
    super();
    this.db = db;
    this.logger = logger;
  }

  /** 
    Fetch statement
  */
  async fetchStatement(where, offset, getCount, search, orderBy="DESC",limit = 10) {
    try {
      // Build the base query with the orderBy condition
      let baseQuery = this.db(`${tableConstants.TRANSACTIONS}`).where(where);

      if (!getCount) {
        baseQuery
          .select(
            "id as trxId",
            "type",
            "amount",
            "balanceAfter",
            "targetAcc",
            "createdAt as trxDate"
          )
          .orderBy("id",orderBy);
      } else {
        baseQuery.countDistinct(`id as totalCount`);
      }


      if (search && search != "") {
        baseQuery.where(this.db.raw(search));
      }

      if (!getCount) {
        // Apply pagination conditionally...
        baseQuery.offset(offset).limit(limit);
      }

      // Execute the query
      const result = await baseQuery;

      if (!getCount) {
        return result;
      } else {
        return result[0].totalCount;
      }
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}

module.exports = TrxModel;

