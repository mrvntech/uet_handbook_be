import Response from "../../../utils/DTO/response/Response";
import { ErrorCode } from "../../../utils/constant/ErrorCode";
import config from '../utils/config'
import { loginSchema } from "../utils/validations/schema";
import '@strapi/strapi'
import { sign, verify } from 'jsonwebtoken'

export async function login(ctx) {
    const params = ctx.request.body;
    try {
        await loginSchema.validateAsync(params, { abortEarly: false });
        const user = await strapi.query('plugin::users-permissions.user').findOne({
            where: {
                email: params.email.toLowerCase()
            },
        });

        if (!user) {
            return ctx.body = Response({ statusCode: ErrorCode.BadRequest, errorMessage: 'Invalid identifier or password', body: {} })
        }
        const validPassword = await strapi.service('plugin::users-permissions.user').validatePassword(
            params.password,
            user.password
        );
        if (!validPassword) {
            return ctx.body = Response({ statusCode: ErrorCode.BadRequest, errorMessage: 'Invalid identifier or password', body: {} })
        }
        const token = sign({ id: user.id }, config.jwt.secret.token, { expiresIn: config.jwt.expiresIn.token })
        const refreshToken = sign({ id: user.id }, config.jwt.secret.refreshToken, { expiresIn: config.jwt.expiresIn.refreshToken })
        return ctx.body = Response({ statusCode: ErrorCode.Success, errorMessage: {}, body: { token, refreshToken } })
    } catch (error) {
        let errorsMessage = error.details.map(errorDetail => errorDetail.message)
        return ctx.body = Response({ statusCode: ErrorCode.BadRequest, errorMessage: errorsMessage, body: {} })
    }
}

export async function isLogin(ctx) {
    return ctx.body = Response({ statusCode: ErrorCode.Success, errorMessage: {}, body: true });
}

export async function refreshToken(ctx) {
    const body = ctx.request.body;
    const result = verify(body.refreshToken, config.jwt.secret.refreshToken);
    const token = sign({ id: result.id }, config.jwt.secret.token, { expiresIn: config.jwt.expiresIn.token })
    const refreshToken = sign({ id: result.id }, config.jwt.secret.refreshToken, { expiresIn: config.jwt.expiresIn.refreshToken })
    return ctx.body = Response({ statusCode: ErrorCode.Success, errorMessage: {}, body: { token, refreshToken } })
}
