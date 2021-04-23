const HtmlWebPackPlugin = require('html-webpack-plugin');
const htmlPlugin = new HtmlWebPackPlugin({
    template: './index.html',
    filename: './index.html'
});
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    // This is the "main" file which should include all other modules
    entry: './src/main.js',
    devServer: {
        open: true
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
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm-bundler.js'
        }
    },
    plugins: [new VueLoaderPlugin(), htmlPlugin]
};