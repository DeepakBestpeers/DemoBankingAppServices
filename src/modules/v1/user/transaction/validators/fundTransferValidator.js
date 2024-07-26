import validateSchema from '~/utils/validate'

// create schema for fund transfer api
const schema = {
    type: "object",
    properties: {
        toAccountNo: {
            type: "number",
            errorMessage: {
                type: 'The toAccountNo field must be a number'
            }
        },
        amount: {
            type: "number",
            errorMessage: {
                type: 'The amount field must be a number'
            }
        }
    },

    required: ["toAccountNo","amount"], //set required paramenter
    additionalProperties: true, //make addition parameter allow in request body by makeing additionalProperties =true 
}
// diposit amount field's validation 
export const fundTransferValidator = function(req, res, next) {
    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (!isValid.status) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }
    next();
}