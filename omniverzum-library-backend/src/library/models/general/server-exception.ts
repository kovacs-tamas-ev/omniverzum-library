import { ServerErrorDto } from "./server-response.dto";

export class ServerException extends Error {

    constructor(public error: ServerErrorDto) {
        super();
    }

}