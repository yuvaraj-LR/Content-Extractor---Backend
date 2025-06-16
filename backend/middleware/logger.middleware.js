import fs from "fs";

const fsPromise = fs.promises;

const log = async (logData) => {
    try {
        logData = `${logData}\n \n`;
        await fsPromise.appendFile("log.txt", logData);
    } catch (error) {
        
    }
}

export const loggerMiddleware = async (req, res, next) => {
    let logData = `${new Date().toString()} \n req URL - ${req.url} \n reqBody - ${JSON.stringify(req.body)}`;
    await log(logData);

    next();
};

export default loggerMiddleware;