import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserDto } from "../../models/user/user.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    findUsers(filters?: UserDto): Promise<UserDto[]> {
        return firstValueFrom(this.http.post<UserDto[]>('/api/user/find', filters));
    }

    async createUser(user: UserDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/user/create', user));
    }

    async updateUser(user: UserDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/user/modify-user-data', user));
    }

}