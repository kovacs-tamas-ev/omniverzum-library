import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserDto } from "../../models/user/user.dto";
import { firstValueFrom } from "rxjs";
import { CreateUserDto } from "../../models/user/create-user.dto";
import { ModifyOwnDataDto } from "../../models/user/modify-own-data.dto";
import { ChangePasswordDto } from "../../models/user/change-password.dto";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {}

    // Admin functions
    findUsers(filters?: UserDto): Promise<UserDto[]> {
        return firstValueFrom(this.http.post<UserDto[]>('/api/user/find', filters));
    }

    async createUser(user: CreateUserDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/user/create', user));
    }

    async updateUser(user: UserDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/user/modify-user-data', user));
    }

    async resetUserData(user: UserDto): Promise<void> {
        await firstValueFrom(this.http.post(`/api/user/reset/${user._id}`, {}));
    }

    async deleteUser(user: UserDto): Promise<void> {
        await firstValueFrom(this.http.delete(`/api/user/delete/${user._id}`));
    }

    // Basic functions
    async modifyOwnData(ownData: ModifyOwnDataDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/user/modify-own-data', ownData));
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/user/change-password', changePasswordDto));
    }

    async deleteOwnProfile(): Promise<void> {
        await firstValueFrom(this.http.delete('/api/user/delete-own-profile'));
    }


}