import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { isString } from "class-validator";
import { FilterQuery, Model } from "mongoose";
import { mapAllToClass, mapToClass } from "src/utils/mappers";
import { validateObjectId } from "src/utils/object-utils";
import { ServerException } from "../models/general/server-exception";
import { CreateUserDto } from "../models/user/create-user.dto";
import { DateFilterDto, DateRange, FilterUserDto } from "../models/user/filter-user.dto";
import { ModifyOwnDataDto } from "../models/user/modify-own-data.dto";
import { ModifyUserDataDto } from "../models/user/modify-user-data.dto";
import { UserDto } from "../models/user/user.dto";
import { User } from "../schemas/user.schema";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(userData: CreateUserDto): Promise<void> {
        const hashedPassword = await bcrypt.hash(userData.email, 10);
        const userDataToSave = {
            ...userData,
            password: hashedPassword,
            username: userData.email,
            membershipStart: new Date()
        };
        
        const newUser = new this.userModel(userDataToSave);
        await newUser.save();
    }

    async findUsers(filters?: FilterUserDto): Promise<UserDto[]> {
        const filterQuery = {} as FilterQuery<User>;

        if (filters && Object.keys(filters).length > 0) {
            const mappedFilters = mapToClass(FilterUserDto, filters);
            Object.keys(mappedFilters).forEach(key => {
                if (mappedFilters[key] !== null && mappedFilters[key] !== undefined) {
                    if (key === 'membershipStart') {
                        this.addMembershipStartFilter(filterQuery, mappedFilters[key]);
                    } else if (isString(mappedFilters[key])) {
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

    private addMembershipStartFilter(filterQuery: FilterQuery<User>, membershipStartFilter: DateFilterDto) {
        if (membershipStartFilter) {
            if (membershipStartFilter.range) {
                this.addDateRangeFilter(filterQuery, 'membershipStart', membershipStartFilter.range);
            } else if (membershipStartFilter.before) {
                membershipStartFilter.before = new Date(membershipStartFilter.before);
                membershipStartFilter.before.setHours(23);
                membershipStartFilter.before.setMinutes(59);
                membershipStartFilter.before.setSeconds(59);
                filterQuery.membershipStart = { $lt: membershipStartFilter.before };
            } else if (membershipStartFilter.after) {
                membershipStartFilter.after = new Date(membershipStartFilter.after);
                membershipStartFilter.before.setHours(0);
                membershipStartFilter.before.setMinutes(0);
                membershipStartFilter.before.setSeconds(0);
                filterQuery.membershipStart = { $gt: membershipStartFilter.after };
            }
        }
    }

    private addDateRangeFilter(filterQuery: FilterQuery<User>, field: string, range: DateRange) {
        if (range && range.from) {
            range.from = new Date(range.from);
            filterQuery[field] = {
                $gte: new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate(), 0, 0, 0),
            };
            if (range.to) {
                range.to = new Date(range.to);
                filterQuery[field].$lte = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate(), 23, 59, 59);
            }
        }
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

        await this.userModel.updateOne({ _id: userId }, { $set: modifyOwnDataDto });
    }

    async resetUserData(userId: string): Promise<void> {
        validateObjectId(userId, 'Érvénytelen felhasználó azonosító');
        const existingUser = await this.userModel.findOne({ _id: userId });
        if (!existingUser) {
            throw new ServerException({ message: 'A felhasználó nem található' });
        }

        const userAsObj = existingUser.toObject();
        const hashedPassword = await bcrypt.hash(userAsObj.email, 10);
        const userWithDefaults = { ...userAsObj, username: userAsObj.email, password: hashedPassword };
        await this.userModel.updateOne({ _id: userId }, { $set: userWithDefaults });
    }

    async deleteUser(userId: string): Promise<void> {
        validateObjectId(userId, 'Érvénytelen felhasználó azonosító');
        await this.userModel.findByIdAndDelete(userId);
    }
    
    async changePassword(userId: string, newPassword: string): Promise<void> {
        validateObjectId(userId, 'Érvénytelen felhasználó azonosító');
        const existingUser = await this.userModel.findOne({ _id: userId });
        if (!existingUser) {
            throw new ServerException({ message: 'A felhasználó nem található' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
    }

}
