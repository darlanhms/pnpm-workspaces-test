const webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: require('./rules.webpack'),
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            APP_ENV: process.env.APP_ENV || process.env.NODE_ENV || 'development',
        }),
    ],
};
