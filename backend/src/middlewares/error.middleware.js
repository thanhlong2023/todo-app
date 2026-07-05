const errorMiddleware = (error, req, res, next) => {
  console.error('Server error:', error);

  return res.status(500).json({
    success: false,
    message: 'Lỗi server',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

module.exports = errorMiddleware;