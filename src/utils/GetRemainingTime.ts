export const getRemainingTime = (tokenExpiration: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = tokenExpiration - currentTime;
    return remainingTime;
};
