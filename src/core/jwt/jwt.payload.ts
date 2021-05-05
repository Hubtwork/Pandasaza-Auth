


export interface JwtPayload {
    phone: string,
    accountId: string,
    iat: number,
    exp: number,
    iss: string
}

export interface UserPayload {
    phone: string,
    accountId: string
}

export interface Tokens {
    accessToken: string,
    refreshToken: string
}