/**
 * @note Case esteja rodando o make manualmente (não recomendado), as variáveis de ambiente provavelmente devem ser inicializadas através do arquivo .env,
 * para isso você pode adicionar o comando '-r dotenv/config' no script que esta sendo rodado ou consultar outras maneira na documentação da biblioteca
 */

const path = require('path');

const iconPath = path.join(__dirname, '/assets/comanda10-icon.ico');

// Quando não estamos em produção, queremos indicar o ambiente atual
const envIndicator =
    !!process.env.APP_ENV && process.env.APP_ENV !== 'production' ? ` - ${process.env.APP_ENV}` : '';

const APP_NAME = `Comanda10 PDV${envIndicator}`;

const S3_BUCKET_TO_PUBLISH =
    process.env.APP_ENV === 'production' ? process.env.BUCKET_NAME : process.env.BUCKET_NAME_STAGING;

const makerAppName = `comanda10-pdv${
    !!process.env.APP_ENV && process.env.APP_ENV !== 'production' ? `-${process.env.APP_ENV}` : ''
}`;

module.exports = {
    packagerConfig: {
        name: APP_NAME,
        executableName: APP_NAME,
        icon: iconPath,
        extraResource: ['assets', 'tmp', 'node_modules/pdf-to-printer/dist/SumatraPDF.exe', 'config.json'],
        asar: true,
    },
    plugins: [
        [
            '@electron-forge/plugin-webpack',
            {
                mainConfig: './webpack/main.webpack.js',
                devContentSecurityPolicy:
                    "connect-src 'self' http://localhost:3333 https://api-main-staging.comanda10.com.br https://api-main.comanda10.com.br https://api-worker-staging.comanda10.com.br https://viacep.com.br/ 'unsafe-eval'",
                renderer: {
                    config: './webpack/renderer.webpack.js',
                    entryPoints: [
                        {
                            html: './public/index.html',
                            js: './src/index.tsx',
                            name: 'main_window',
                            preload: {
                                js: './electron/bridge.ts',
                            },
                        },
                    ],
                },
            },
        ],
    ],
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: makerAppName,
                setupExe: makerAppName + '-setup.exe',
                iconUrl: iconPath,
                setupIcon: iconPath,
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin', 'linux'],
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-s3',
            config: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                bucket: S3_BUCKET_TO_PUBLISH,
                region: process.env.AWS_REGION,
                folder: 'latest',
                public: true,
            },
        },
    ],
};
