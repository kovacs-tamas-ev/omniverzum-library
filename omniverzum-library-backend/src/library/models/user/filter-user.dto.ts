export class FilterUserDto {

    _id?: string = undefined;
    username?: string = undefined;
    fullName?: string = undefined;
    email?: string = undefined;
    course?: string = undefined;
    membershipStart?: DateFilterDto = undefined;
    admin?: boolean = undefined;

}

export class DateFilterDto {
    range?: DateRange;
    before?: Date;
    after?: Date;
}

export class DateRange {
    from: Date;
    to?: Date;
}
