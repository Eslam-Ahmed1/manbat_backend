import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { appError } from './appErrors.js';

// Resolve __dirname for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logs directory: project_root/logs/
const LOGS_DIR = path.join(__dirname, '..', 'logs');
const ERROR_LOG_FILE = path.join(LOGS_DIR, 'errors.log');
const UNHANDLED_LOG_FILE = path.join(LOGS_DIR, 'unhandled.log');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// ─── Core log writer ─────────────────────────────────────────────────────────

const writeToFile = (filePath: string, content: string) => {
    try {
        fs.appendFileSync(filePath, content, 'utf8');
    } catch {
        // If file write fails, fall back silently — don't crash the app
    }
};

// ─── Format an error entry ───────────────────────────────────────────────────

interface LogContext {
    method?: string;
    url?: string;
    ip?: string;
    userId?: string;
    body?: any;
}

const formatEntry = (err: any, context: LogContext = {}): string => {
    const separator = '─'.repeat(60);
    const timestamp = new Date().toISOString();
    const isOperational = err instanceof appError;

    return [
        '',
        separator,
        `[${timestamp}]`,
        `TYPE     : ${isOperational ? 'Operational (Expected)' : '💥 UNEXPECTED (Bug)'}`,
        `STATUS   : ${err.statusCode ?? 500}`,
        `MESSAGE  : ${err.message ?? 'Unknown error'}`,
        context.method ? `METHOD   : ${context.method}` : '',
        context.url    ? `URL      : ${context.url}` : '',
        context.ip     ? `IP       : ${context.ip}` : '',
        context.userId ? `USER_ID  : ${context.userId}` : '',
        context.body && !isOperational
            ? `BODY     : ${JSON.stringify(context.body)}` : '',
        `STACK    :\n${err.stack ?? 'No stack trace'}`,
        separator,
        '',
    ]
        .filter(line => line !== '')
        .join('\n');
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Log an error to logs/errors.log
 * Call this from your global error handler.
 */
export const logError = (err: any, context: LogContext = {}): void => {
    const entry = formatEntry(err, context);

    // Always print to console
    const isOperational = err instanceof appError;
    if (isOperational) {
        console.warn(`[ERROR LOGGER] ⚠️  ${err.statusCode} — ${err.message}`);
    } else {
        console.error(`[ERROR LOGGER] 💥 UNEXPECTED ERROR:\n${err.stack}`);
    }

    // Write to file
    writeToFile(ERROR_LOG_FILE, entry);
};

/**
 * Log unhandled promise rejections and uncaught exceptions to logs/unhandled.log
 * Call this once at server startup.
 */
export const registerGlobalErrorHandlers = (): void => {
    process.on('unhandledRejection', (reason: any) => {
        const entry = formatEntry(
            reason instanceof Error ? reason : new Error(String(reason)),
            {}
        );
        console.error('[ERROR LOGGER] 🔴 Unhandled Promise Rejection:', reason);
        writeToFile(UNHANDLED_LOG_FILE, `\n[UNHANDLED REJECTION]\n${entry}`);
    });

    process.on('uncaughtException', (err: Error) => {
        const entry = formatEntry(err, {});
        console.error('[ERROR LOGGER] 🔴 Uncaught Exception:', err);
        writeToFile(UNHANDLED_LOG_FILE, `\n[UNCAUGHT EXCEPTION]\n${entry}`);
        // Give time to flush file write, then exit — uncaught exceptions are unrecoverable
        setTimeout(() => process.exit(1), 500);
    });
};
