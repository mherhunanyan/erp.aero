import { generateJwtRefreshToken } from 'utils/tokenUtils/GenerateJwtRefreshToken';
import { generateJwtAccessToken } from 'utils/tokenUtils/GenerateJwtAccessToken';
import { verifyJwtRefreshToken } from 'utils/tokenUtils/VerifyJwtRefreshToken';
import { verifyJwtAccessToken } from 'utils/tokenUtils/VerifyJwtAccessToken';
import { handleJwtError } from 'utils/tokenUtils/HandleJwtError';

export const jwtUtils = {
    generateJwtAccessToken,
    generateJwtRefreshToken,
    handleJwtError,
    verifyJwtAccessToken,
    verifyJwtRefreshToken,
};
