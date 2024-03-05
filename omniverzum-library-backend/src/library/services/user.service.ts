import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { isString } from "class-validator";
import { FilterQuery, Model } from "mongoose";
import { mapAllToClass, mapToClass } from "src/utils/mappers";
import { validateObjectId } from "src/utils/object-utils";
import { ServerException } from "../models/general/server-exception";
import { CreateUserDto } from "../models/user/create-user.dto";
import { FilterUserDto } from "../models/user/filter-user.dto";
import { ModifyOwnDataDto } from "../models/user/modify-own-data.dto";
import { UserDto } from "../models/user/user.dto";
import { User } from "../schemas/user.schema";
import { ModifyUserDataDto } from "../models/user/modify-user-data.dto";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(userData: CreateUserDto): Promise<void> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userDataToSave = {  ...userData, password: hashedPassword };
        
        const newUser = new this.userModel(userDataToSave);
        await newUser.save();
    }

    async findUsers(filters?: FilterUserDto): Promise<UserDto[]> {
        const filterQuery = {} as FilterQuery<User>;

        if (filters && Object.keys(filters).length > 0) {
            const mappedFilters = mapToClass(FilterUserDto, filters);
            Object.keys(mappedFilters).forEach(key => {
                if (mappedFilters[key] !== null && mappedFilters[key] !== undefined) {
                    if (isString(mappedFilters[key])) {
                        filterQuery[key] = { $regex: new RegExp(mappedFilters[key], 'i') };
                    } else {
                        filterQuery[key] = mappedFilters[key];
                    }
                }
            });
    
            if (mappedFilters._id) {
                filterQuery._id = mappedFilters._id;
            }    
        }

        const resultDocs = await this.userModel.find(filterQuery).exec();
        const resultObjects = resultDocs.map(doc => doc.toObject());
        return mapAllToClass(UserDto, resultObjects);
    }

    async setAdminState(userId: string, newAdminState: boolean): Promise<void> {
        validateObjectId(userId, 'Érvénytelen felhasználó azonosító');
        const existingUser = await this.userModel.findOne({ _id: userId });
        if (!existingUser) {
            throw new ServerException({ message: 'A felhasználó nem található' });
        }

        await this.userModel.updateOne({ _id: userId }, { $set: { admin: newAdminState } });
    }

    async modifyUserData(modifyUserDataDto: ModifyUserDataDto): Promise<void> {
        validateObjectId(modifyUserDataDto._id, 'Érvénytelen felhasználó azonosító');
        const existingUser = await this.userModel.findById(modifyUserDataDto._id).exec();
        if (!existingUser) {
            throw new ServerException({ message: 'A felhasználó nem található' });
        }

        await this.userModel.findByIdAndUpdate(modifyUserDataDto._id, modifyUserDataDto).exec();
    }

    async modifyOwnData(userId: string, modifyOwnDataDto: ModifyOwnDataDto): Promise<void> {
        validateObjectId(userId, 'Érvénytelen felhasználó azonosító');
        const existingUser = await this.userModel.findOne({ _id: userId });
        if (!existingUser) {
            throw new ServerException({ message: 'A felhasználó nem található' });
        }

        let ownDataToSave = modifyOwnDataDto;
        if (modifyOwnDataDto.password) {
            ownDataToSave = { ...modifyOwnDataDto, password: await bcrypt.hash(modifyOwnDataDto.password, 10) };
        }

        await this.userModel.updateOne({ _id: userId }, { $set: ownDataToSave });
    }
    

}
