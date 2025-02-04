import { StatusCodes } from "http-status-codes";
import tableConstants from '~/constants/tableConstants';
import commonConstants from "~/constants/commonConstants";

/**
 * creating AuthModel object for access the database 
 */
class authService {

    constructor({ authModel, DateTimeUtil, passwordHash, logger, JwtAuthSecurity, commonHelpers }) {
        this.authModel = authModel;
        this.DateTimeUtil = DateTimeUtil;
        this.passwordHash = passwordHash;
        this.logger = logger;
        this.JwtAuthSecurity = JwtAuthSecurity;
        this.commonHelpers = commonHelpers;
    }

    /*
    User signup service
    @requestData request body data
    @requestHeader request header data
    */
    async signupService(requestData, requestHeader) {
        try {
            
            // signup functionality
            let wherQuery = { 'email': requestData.email.trim()};
            
            // fetch email
            let getUserEmail = await this.authModel.fetchObjWithSingleRecord(wherQuery, "email", tableConstants.USERS);
            
            // if email exist
            if (getUserEmail !== undefined) {
                return {
                    status_code: StatusCodes.BAD_REQUEST,
                    code: await this.commonHelpers.getResponseCode('EMAIL_EXIST')
                };
            }

            // user signup obj
            const userdDataObj = {
                fullName: requestData.fullName.trim(),
                email: requestData.email.trim(),
                password: await this.passwordHash.cryptPassword(requestData.password.trim()),
                createdAt: this.DateTimeUtil.getCurrentTimeObjForDB()
            },accObj = {
                balance: commonConstants.DEFAULT_AMT,
                createdAt: this.DateTimeUtil.getCurrentTimeObjForDB()
            }

            // create user
            const [userId] = await this.authModel.createObj(userdDataObj, tableConstants.USERS);

            accObj.userId = userId;

            // create user account
            await this.authModel.createObj(accObj, tableConstants.ACCOUNTS);

            // let getUserData = await this.authModel.fetchObjWithSingleRecord({id:userId}, "id,deviceId,fullName", tableConstants.USERS);
            let [getUserData] = await this.authModel.fetchJoinObj(wherQuery, "userId", tableConstants.ACCOUNTS, "id", tableConstants.USERS);

            // reset headers
            await this.commonHelpers.updateHeaderInfo(requestHeader, {id:getUserData.userId}, tableConstants.USERS);

            getUserData.device_id = requestHeader["device-id"];

            // call helper function for get login response
            const responseData = await this.commonHelpers.getLoginResponse(getUserData);

            // return signup success response
            return {
                status_code: StatusCodes.OK,
                code: await this.commonHelpers.getResponseCode('SUCCESS'),
                response: responseData
            };
           

        } catch (error) {
            this.logger.error(error);
            return error;
        }
    }

    /*
    User login service
    @requestData request body data
    @requestHeader request header data
    */
    async loginService(requestData, requestHeader) {
        try {
            // set where condition for check exist 
            const where = {
                'email': requestData.email
            };

            // fetch the combination of email and password
            let [userData] = await this.authModel.fetchJoinObj(where, "userId", tableConstants.ACCOUNTS, "id", tableConstants.USERS);
            
            if (!userData) {
                // user not found response
                return {
                    status_code: StatusCodes.BAD_REQUEST,
                    code: await this.commonHelpers.getResponseCode('INVALID_LOGIN_CREDENTIALS')
                };
            }

            // match hash password and request body password
            const isMatch = this.passwordHash.compareSync(requestData.password, userData.password);
            if (!isMatch) {
                // return response is password not match
                return {
                    status_code: StatusCodes.BAD_REQUEST,
                    code: await this.commonHelpers.getResponseCode('INVALID_LOGIN_CREDENTIALS')
                };
            }

            // reset headers
            await this.commonHelpers.updateHeaderInfo(requestHeader, {id:userData.userId}, tableConstants.USERS);

            
            userData.device_id = requestHeader["device-id"];
            
            //call helper function to get prepare login response
            const responseData = await this.commonHelpers.getLoginResponse(userData);

            // return login success response
            return {
                status_code: StatusCodes.OK,
                code: await this.commonHelpers.getResponseCode('SUCCESS'),
                response: responseData
            };


        } catch (error) {
            this.logger.error(error);
            return error;
        }
    }
}

module.exports = authService;