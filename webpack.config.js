const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './demo/demo.ts',
    output: {
        path: path.resolve(__dirname, './dist/demo'),
        filename: 'demo.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: require.resolve('ts-loader') }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Circle2D Demo"
        })
    ]
};