export interface IVerifyService {
    hashIt(value: string): string
    verify(value: string, hash: string): boolean
    hashCombined(values: string[], splitter?: string): string
    hashSplit(values: string, splitter: string): string[]
    setHashSplitter(hs: string): void
}