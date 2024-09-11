import { hashIt } from "../helpers/hashFunction";
import { IVerifyService } from "./types";

export class VerifyService implements IVerifyService {
    private sk: string
    constructor(sekretKey: string) {
        this.sk = sekretKey
    }
    hashSplit(values: string, splitter: string): string[] {
        return values.split(splitter)
    }
    hashCombined(values: string[], splitter: string): string {
        let result = ``
        for (let i = 0; i < values.length; i++) {
            if (i === 0) {
                result = `${values[i]}`
            }
            else {
                result = `${result}${splitter}${values[i]}`
            }
        }
        return result
    }
    hashIt(value: string): string {
        return hashIt(value, this.sk)
    }
    verify(value: string, hash: string): boolean {
        let hashed = this.hashIt(value)
        return hashed === hash
    }
}