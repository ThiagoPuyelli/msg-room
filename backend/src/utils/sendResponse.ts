import { Response } from 'express'

export default (res: Response, code: number, message: any) => {
  return res.json({ code, message })
}
