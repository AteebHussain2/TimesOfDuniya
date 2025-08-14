import { timingSafeEqual } from "crypto";

export function isValidSecret(secret: string, API_KEY: string) {
    if (!API_KEY) {
        throw new Error("API_KEY not found to validate request!")
    }

    try {
        return timingSafeEqual(Buffer.from(secret), Buffer.from(API_KEY));
    } catch (error) {
        console.error(error);
        return false;
    }
}