import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { mapAllToClass, mapToClass } from "src/utils/mappers";
import { CreateUserDto } from "../models/user/create-user.dto";
import { FilterUserDto } from "../models/user/filter-user.dto";
import { UserDto } from "../models/user/user.dto";
import { User } from "../schemas/user.schema";
import * as bcrypt from 'bcrypt';
import { isString } from "class-validator";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        
    }

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
    

}
