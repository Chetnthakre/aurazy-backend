"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`Error: ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map