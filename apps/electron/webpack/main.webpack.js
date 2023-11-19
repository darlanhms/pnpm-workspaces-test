const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
    },
    entry: './electron/main.ts',
    module: {
        rules: require('./rules.webpack'),
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            ...dotenv.config().parsed,
            APP_ENV: process.env.APP_ENV || process.env.NODE_ENV || 'development',
        }),
    ],
};
