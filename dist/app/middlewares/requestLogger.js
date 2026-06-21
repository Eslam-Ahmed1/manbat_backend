export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    // Log incoming request
    console.log(`[${new Date().toISOString()}] 📨 ${method} ${originalUrl} - IP: ${ip}`);
    // Intercept response finish to log response status
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        const statusColor = statusCode >= 400 ? '❌' : '✅';
        console.log(`[${new Date().toISOString()}] ${statusColor} ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`);
    });
    next();
};
