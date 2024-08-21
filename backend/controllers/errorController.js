import AppError from "../utils/AppError.js";

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // console.log(err.isOpertional);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("error: ", err);
    res.status(500).json({
      status: "error",
      message: `something went very wrong`,
    });
  }
};

const handleDuplicateFieldError = (err) => {
  // check duplicate number field
  const numberMatch = err.errmsg.match(/\b\d+\b/);
  if (numberMatch) {
    const numberMessage = `Phone number ${numberMatch[0]} is already exist. Please use another value!`;
    return new AppError(numberMessage, 400);
  }
  // check duplicate string|class_name field
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  if (value) {
    let exactValue = value[0].replace(/['"]+/g, ""); //remove quotes

    const message = `${exactValue} is already exist. please use an other value!`;
    return new AppError(message, 400);
  }
};

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const hadnleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("invalid token", 401);

export default function globalError(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else {
    // invalid database ids
    if (err.name === "CastError") err = handleCastErrorDb(err);
    // validation errors
    if (err.name === "ValidationError") err = hadnleValidationError(err);
    if (err.code === 11000) err = handleDuplicateFieldError(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    sendErrorProd(err, res);
  }
}
