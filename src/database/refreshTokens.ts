const refreshTokens: string[] = [];

export const checkRefreshToken = (token: string): boolean => {
    return refreshTokens.includes(token);
};

export const addRefreshToken = async (token: string) => {
    refreshTokens.push(token);
};

export const deleteRefreshToken = (token: string) => {
    const tokenIndex = refreshTokens.indexOf(token);
    if (tokenIndex !== -1) refreshTokens.splice(tokenIndex, 1);
};

// Remove old refresh token and add new one: N.B token rotation strategy
export const rotateTokens = (oldOne: string, newOne: string) => {
    const tokenIndex = refreshTokens.indexOf(oldOne);
    refreshTokens.splice(tokenIndex, 1);
    refreshTokens.push(newOne);
};
