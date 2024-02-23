import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class User {

    _id: Types.ObjectId;
    
    @Prop({ unique: true, required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    email: string;

}

export const UserSchema = SchemaFactory.createForClass(User);