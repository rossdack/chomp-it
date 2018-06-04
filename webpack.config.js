const webpack = require('webpack');
require('dotenv').load();
var path = require('path');

const PORT = process.env.nodeServerPort || 3000;
const BUILD_DIR = path.resolve(__dirname, './build');
const APP_DIR = path.resolve(__dirname, './src/client');

const config = {
    mode: 'none',
    entry: {
        main: APP_DIR + '/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: BUILD_DIR,
        publicPath: '/build/'
    },
    module: {
        rules: [
            {
                test: /DataSource.js$/,
                loader: 'string-replace-loader',
                options: {
                    search: '@@SHRINKREST',
                    replace: 'http://localhost:' + PORT + '/shorten'
                }
            },
            {
                test: /(\.css|.scss)$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: false,
                        presets: ['react', 'es2015','stage-2'] // Transpiles JSX and ES6
                    }
                }]
            }
        ],

    }
};

module.exports = config;