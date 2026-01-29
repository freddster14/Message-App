import { validationResult } from "express-validator";

export default function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(200).json({ msg: errors.array()[0].msg });
  }
  next();
}