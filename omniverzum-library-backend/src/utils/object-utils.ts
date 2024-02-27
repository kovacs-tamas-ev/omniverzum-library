import mongoose from "mongoose";
import { ServerException } from "src/library/models/general/server-exception";

export function validateObjectId(id: string, errorMessage?: string): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const message = errorMessage ?? 'Érvénytelen azonosító';
        throw new ServerException({ message });
    }
}

export function hasFieldWithValue(obj: any): boolean {
    const keys = Object.keys(obj);
    if (keys.length === 0) {
        return false;
    }

    return keys.some(key => obj[key] !== undefined && obj[key] !== null);
}

export function hasEmptyField(obj: any): boolean {
    return Object.keys(obj).some(key => obj[key] === undefined || obj[key] === null || obj[key] === '');
}

export function hasEmptyStringField(obj: any): boolean {
    return Object.keys(obj).some(key => obj[key] === '');
}
