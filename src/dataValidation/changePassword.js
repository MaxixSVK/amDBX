const Joi = require('joi');

const passwordSchema = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.base': `Heslo by malo byť typu 'text'`,
      'string.empty': `Heslo nemôže byť prázdne pole`,
      'string.min': `Heslo by malo mať minimálnu dĺžku {#limit}`,
      'any.required': `Heslo je povinné pole`
    }),
  newPassword: Joi.string()
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
  return await passwordSchema.validateAsync(data);
}

module.exports = validateRegister;