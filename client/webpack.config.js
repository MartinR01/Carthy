const HtmlWebPackPlugin = require('html-webpack-plugin');
const htmlPlugin = new HtmlWebPackPlugin({
    template: './index.html',
    filename: './index.html'
});
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const webpack = require('webpack')

module.exports = {
    output: {
        path: path.resolve(__dirname, "../server/public")
    },
    devServer: {
        open: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm-bundler.js'
        }
    },
    plugins: [
        new VueLoaderPlugin(), 
        htmlPlugin,
        new webpack.DefinePlugin({
            PRODUCTION: process.env.NODE_ENV === 'production'
        })
    ]
};