const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    genre: Joi.string(),
    releaseDate: Joi.date().allow(''),
    volumes: Joi.number().integer(),
    chapters: Joi.number().integer(),
    banner: Joi.string().uri().allow(''),
    img: Joi.string().uri().allow(''),
    status: Joi.string().required(),
});

async function validateSchema(data) {
    return await schema.validateAsync(data);
}

module.exports = validateSchema;