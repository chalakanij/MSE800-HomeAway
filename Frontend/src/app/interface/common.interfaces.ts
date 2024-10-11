export interface JwtTokenInterface {
    sub: String;
    name: String,
    authorities: {
        authority: String
    }[],
    iat: number,
    exp: number
}