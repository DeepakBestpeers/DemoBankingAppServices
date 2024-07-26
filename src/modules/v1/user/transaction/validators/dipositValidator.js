import validateSchema from '~/utils/validate'

// create schema for diposit amount api
const schema = {
    type: "object",
    properties: {
        amount: {
            type: "number",
            errorMessage: {
                type: 'The amount field must be a number',
                minLength: 'Must have required property amount.',
                maxLength: 'amount may have maximum 60 characters.'
            }
        }
    },

    required: ["amount"], //set required paramenter
    additionalProperties: true, //make addition parameter allow in request body by makeing additionalProperties =true 
}
// diposit amount field's validation 
export const dipositValidator = function(req, res, next) {
    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (!isValid.status) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }
    next();
}