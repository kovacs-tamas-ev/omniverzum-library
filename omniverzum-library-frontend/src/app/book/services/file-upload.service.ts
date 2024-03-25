import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { FailedBookImportDto } from "../../models/book/failed-book-import.dto";
import { ServerResponseDto } from "../../models/server-response.dto";


@Injectable()
export class FileUploadService {

    constructor(private http: HttpClient) {}

    async uploadBooksFromFile(file: File): Promise<ServerResponseDto<FailedBookImportDto[]>> {
        const formData = new FormData();
        formData.append('file', file);

        return await firstValueFrom(this.http.post<any>('/api/upload', formData));
    }

}