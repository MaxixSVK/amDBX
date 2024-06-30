const Joi = require('joi');

const schema = Joi.object({
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.base': `Heslo by malo byť typu 'text'`,
            'string.empty': `Heslo nemôže byť prázdne pole`,
            'string.min': `Heslo by malo mať minimálnu dĺžku {#limit}`,
            'any.required': `Heslo je povinné pole`
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': `Email by mal byť typu 'text'`,
            'string.email': `Email by mal byť platný email`,
            'string.empty': `Email nemôže byť prázdne pole`,
            'any.required': `Email je povinné pole`
        })
});

async function validateSchema(data) {
    return await schema.validateAsync(data);
}

module.exports = validateSchema;