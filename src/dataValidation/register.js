const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.base': `Meno by malo byť typu 'text'`,
        'string.empty': `Meno nemôže byť prázdne pole`,
        'string.min': `Meno by malo mať minimálnu dĺžku {#limit}`,
        'string.max': `Meno by malo mať maximálnu dĺžku {#limit}`,
        'any.required': `Meno je povinné pole`
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': `Email by mal byť typu 'text'`,
        'string.email': `Email by mal byť platný email`,
        'string.empty': `Email nemôže byť prázdne pole`,
        'any.required': `Email je povinné pole`
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.base': `Heslo by malo byť typu 'text'`,
        'string.empty': `Heslo nemôže byť prázdne pole`,
        'string.min': `Heslo by malo mať minimálnu dĺžku {#limit}`,
        'any.required': `Heslo je povinné pole`
      })
});

async function validateRegister(data) {
    return await registerSchema.validateAsync(data);
}

module.exports = validateRegister;