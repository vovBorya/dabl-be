const getParsedUserToApi = (user) => {
    return {
        id: user.id,
        nickName: user.nickName,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        birthDate: user.birthDate,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
    };
};

module.exports = {
    getParsedUserToApi
};