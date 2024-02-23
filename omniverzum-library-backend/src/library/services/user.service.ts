import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { mapAllToClass, mapToClass } from "src/utils/mappers";
import { CreateUserDto } from "../models/user/create-user.dto";
import { FilterUserDto } from "../models/user/filter-user.dto";
import { UserDto } from "../models/user/user.dto";
import { User } from "../schemas/user.schema";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        
    }

    async createUser(userData: CreateUserDto): Promise<void> {
        const newUser = new this.userModel(userData);
        newUser.save();
    }

    async findAllUsers(): Promise<UserDto[]> {
        const resultDocs = await this.userModel.find().exec();
        const resultObjects = resultDocs.map(doc => doc.toObject());
        return mapAllToClass(UserDto, resultObjects);
    }

    async findUsers(filters?: FilterUserDto): Promise<UserDto[]> {
        const filterQuery = {} as FilterQuery<User>;

        if (filters && Object.keys(filters).length > 0) {
            const mappedFilters = mapToClass(FilterUserDto, filters);
            Object.keys(mappedFilters).forEach(key => {
                if (mappedFilters[key] !== null && mappedFilters[key] !== undefined) {
                    filterQuery[key] = { $regex: new RegExp(mappedFilters[key], 'i') };
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
