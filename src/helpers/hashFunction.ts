import { createHmac } from 'node:crypto';

export function hashIt(str: string, skey: string) {
    const hash = createHmac('sha256', skey)
        .update(`${str}`)
        .digest('hex');
    return hash
}