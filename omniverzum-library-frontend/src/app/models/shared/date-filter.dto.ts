export interface DateFilterDto {
    range?: DateRange;
    before?: Date;
    after?: Date;
}

export interface DateRange {
    from: Date;
    to?: Date;
}

export enum DateFilterModes {
    RANGE = 'range',
    BEFORE = 'before',
    AFTER = 'after'
}