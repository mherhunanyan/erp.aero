export interface DecodedToken {
    exp: number;
    iat?: number;
    sub?: string;
    aud?: string;
    iss?: string;
    jti?: string;
    // Custom claims
    userId?: string;
    refreshToken?: string;
}
