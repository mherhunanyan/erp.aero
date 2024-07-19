import { DecodedToken } from 'types/JwtTypes';

export const getRemainingTime = (decodedToken: DecodedToken) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = decodedToken.exp - currentTime;
    return remainingTime;
};
