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
        const token = await strapi.service('plugin::users-permissions.jwt').issue({ id: user.id });
        const refreshToken = sign({ userId: user.id }, config.jwt.secret.refreshToken)
        return ctx.body = Response({ statusCode: ErrorCode.Success, errorMessage: {}, body: { token, refreshToken } })
    } catch (error) {
        let errorsMessage = error.details.map(errorDetail => errorDetail.message)
        return ctx.body = Response({ statusCode: ErrorCode.BadRequest, errorMessage: errorsMessage, body: {} })
    }
}

export async function isLogin(ctx) {
    return ctx.body = Response({statusCode: ErrorCode.Success, errorMessage: {}, body: true});
}
