import { checkIfTokenIsRevoked } from 'utils/redisUtils/CheckIfTokenIsRevoked';
import { markTokenAsRevoked } from 'utils/redisUtils/MarkTokenAsRevoked';

export const redisUtils = {
    checkIfTokenIsRevoked,
    markTokenAsRevoked,
};
