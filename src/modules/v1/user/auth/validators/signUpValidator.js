import validateSchema from '~/utils/validate'

// create schema for signup api
const schema = {
    type: "object",
    properties: {
        fullName: {
            type: "string",
            minLength:1,
            maxLength: 120,
            errorMessage: {
                type: 'The fullName field must be a string',
                minLength: 'Must have required property fullName',
                maxLength: 'fullName may have maximum 120 characters.'
            },
        },
        email: {
            type: "string",
            minLength: 5,
            maxLength: 100,
            format: "email",
            errorMessage: {
                type: 'The email field must be a string',
                minLength: 'Email should have minimum 5 characters.',
                maxLength: 'Email may have maximum 100 characters.',
                format: 'Invalid email format.'
            },
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 12,
            pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$%^&*@])",
            errorMessage: {
                type: 'The password field must be a string.',
                minLength: 'Password should have minimum 6 characters.',
                maxLength: 'Password should be a maximum of 12 characters.',
                pattern: 'Password must contain at least one uppercase, lowercase, number, and a special character.'
            },
        },
        cnfPassword: {
            const: {
                "$data": "1/password"
            },
            type: "string",
            minLength: 6,
            maxLength: 12,
            pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$%^&*@])",
            errorMessage: {
                const: 'The password does not match with the confirmed password.',
                type: 'The confirm password field must be a string.',
                minLength: 'Password should have minimum 6 characters.',
                maxLength: 'Confirm password  should be a maximum of 12 characters.',
                pattern: 'Password must contain at least one uppercase, lowercase, number, and a special character.'
            },
        }
    },

    required: ["fullName", "email", "password", "cnfPassword"], //set required paramenter
    additionalProperties: true, //make addition parameter allow in request body by makeing additionalProperties =true 
};

// SignUp field validation 
export const signUpValidator = function(req, res, next) {
    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (!isValid.status) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }
    next();
}