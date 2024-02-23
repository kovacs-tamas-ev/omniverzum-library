import { log } from "console";

export function mapToClass<T>(classType: new () => T, obj: any): T {
    const instance = new classType();
    const keys = Object.keys(instance);
    log('keys\n', keys);
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            instance[key] = obj[key];
        }
    });
    return instance;
}

export function mapAllToClass<T>(classType: new () => T, objArr: any[]): T[] {
    return objArr.map(obj => mapToClass(classType, obj));
}