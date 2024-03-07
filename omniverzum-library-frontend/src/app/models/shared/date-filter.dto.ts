export interface DateFilterDto {
    range?: DateRange;
    before?: Date;
    after?: Date;
}

export interface DateRange {
    from: Date;
    to: Date;
}

export enum DateFilterModes {
    RANGE = 'RANGE',
    BEFORE = 'BEFORE',
    AFTER = 'AFTER'
}