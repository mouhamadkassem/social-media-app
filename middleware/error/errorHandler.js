//handler not Found error

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// throw internal error
const errHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message,
    stact: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errHandler, notFound };
