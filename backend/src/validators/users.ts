import joi from 'joi'

export const registerJoi = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required().min(4),
  username: joi.string().required().max(30),
  description: joi.string().max(300),
  image: joi.string()
})
