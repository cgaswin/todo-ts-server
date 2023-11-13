import { Request, Response, NextFunction } from "express"

const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        return await Promise.resolve(fn(req, res, next))
    } catch (error) {
        return next(error)
    }
 }


export {asyncHandler}