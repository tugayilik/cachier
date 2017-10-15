import Config from './config';

export default class Utils {
    static exceptionHandler (error) {
        if (Config.DEBUG) {
            throw new Error(`Error Occured: ${error}`);
        }
    }

    static statusHandler (status) {
        if (Config.DEBUG) {
            console.info(status);
            return status;
        }
    }

    // If indexedDB version set as 0 or lower it throws exception
    // For this case, it must be 1 minimum
    static adjustIndexedDbVersion (version) {
        if (Math.floor(version) <= 0) {
            version = 1;
        }

        return Math.ceil(version);
    }
}