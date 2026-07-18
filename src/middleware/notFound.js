const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl} - Resource not found`
    });
};

module.exports = notFound;