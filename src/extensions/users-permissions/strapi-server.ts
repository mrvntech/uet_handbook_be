import { isLogin, login, refreshToken } from "./controllers/auth";

export default (plugin) => {

    plugin.controllers.auth.login = login
    plugin.controllers.auth.isLogin = isLogin
    plugin.controllers.auth.refreshToken = refreshToken


    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/auth/login',
        handler: 'auth.login',
    });
    plugin.routes['content-api'].routes.push({
        method: 'GET',
        path: '/auth/login-state',
        handler: 'auth.isLogin',
    });
    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/auth/refresh-token',
        handler: 'auth.refreshToken',
    });
    return plugin;
}