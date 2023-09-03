import { isLogin, login } from "./controllers/auth";

export default (plugin) => {

    plugin.controllers.auth.login = login
    plugin.controllers.auth.isLogin = isLogin


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
    return plugin;
}