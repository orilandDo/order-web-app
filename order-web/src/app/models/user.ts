export interface User {
    id: number,
    username: string,
    password: string,
    isAdmin: boolean,
    sessions: [{
        token: string,
        expiresAt: number
    }]
}