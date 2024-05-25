const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(18)
    .required()
    .messages({
      'string.base': `Užívateľské meno by malo byť typu 'text'`,
      'string.alphanum': `Užívateľské meno by malo obsahovať iba alfanumerické znaky`,
      'string.empty': `Užívateľské meno nemôže byť prázdne pole`,
      'string.min': `Užívateľské meno by malo mať minimálnu dĺžku {#limit}`,
      'string.max': `Užívateľské meno by malo mať maximálnu dĺžku {#limit}`,
      'any.required': `Užívateľské meno je povinné pole`
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