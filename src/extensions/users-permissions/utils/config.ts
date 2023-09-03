export default {
    jwt: {
        secret: {
            token: process.env['JWT_TOKEN_SECRET'],
            refreshToken: process.env['JWT_REFRESH_TOKEN']
        },
        expiresIn: {
            token: process.env['TOKEN_EXPIRES_IN'],
            refreshToken: process.env['REFRESH_TOKEN_EXPIRES_IN']
        }
    }
}