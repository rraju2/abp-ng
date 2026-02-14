
export const environment = {
    production: false,
    application: {
        baseUrl: 'http://localhost:4200/',
        name: 'Ventra',
        logoUrl: 'assets/images/logo.png'
    },
    oAuthConfig: {
        issuer: 'https://localhost:44305/',
        redirectUri: 'http://localhost:4200',
        clientId: 'Ventra_App',
        responseType: 'code',
        scope: 'offline_access Ventra',
        requireHttps: true
    },
    apis: {
        default: {
            url: 'https://localhost:44305',
            rootNamespace: 'Ventra'
        }
    }
};
