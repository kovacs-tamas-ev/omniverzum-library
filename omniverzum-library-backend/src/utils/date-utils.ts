export function nullOutTimePart(date: Date): Date {
    const onlyDate = new Date(date);
    onlyDate.setHours(0);
    onlyDate.setMinutes(0);
    onlyDate.setSeconds(0);
    onlyDate.setMilliseconds(0);
    return onlyDate;
}