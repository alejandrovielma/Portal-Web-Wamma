export function hashId():string{
    return Math.random().toString(36).substring(2, 10)
}