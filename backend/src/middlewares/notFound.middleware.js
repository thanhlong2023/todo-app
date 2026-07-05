const notFoundMiddleware = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Không tìm thấy route: ${req.originalUrl}`
  });
};

module.exports = notFoundMiddleware;