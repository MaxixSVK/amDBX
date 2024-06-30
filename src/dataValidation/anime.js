const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    genre: Joi.string(),
    releaseDate: Joi.date().allow(''),
    episodes: Joi.number().integer().allow(''),
    banner: Joi.string().uri().allow(''),
    img: Joi.string().uri().allow(''),
    trailer: Joi.string().uri().allow(''),
    status: Joi.string(),
    studio: Joi.string().allow(''),
});

async function validateSchema(data) {
    return await schema.validateAsync(data);
}

module.exports = validateSchema;