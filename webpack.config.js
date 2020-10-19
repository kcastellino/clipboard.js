const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production' || false;

const banner = `clipboard.js v${pkg.version}
https://clipboardjs.com/

Licensed MIT © Zeno Rocha

This version refactored by Kiran Castellino
See more: https://github.com/kcastellino/clipboard.js`;

module.exports = [
    {
        name: "clipboard",
        entry: './src/clipboard.js',
        mode: 'production',
        output: {
            filename: production ? 'clipboard.min.js' : 'clipboard.js',
            path: path.resolve(__dirname, 'dist'),
            library: 'ClipboardJS',
            globalObject: 'this',
            libraryExport: 'default',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
            ]
        },
        optimization: {
            minimize: production,
            minimizer: [
                new UglifyJSPlugin({
                    parallel: require('os').cpus().length,
                    uglifyOptions: {
                        ie8: false,
                        keep_fnames: false,
                        output: {
                            beautify: false,
                            comments: (node, {value, type}) => type == 'comment2' && value.startsWith('!')
                        }
                    }
                })
            ]
        },
        plugins: [new webpack.BannerPlugin({ banner })]
    },
    {
        name: "handler",
        entry: './src/clipboard-handler.js',
        mode: 'production',
        output: {
            filename: production ? 'clipboard-handler.min.js' : 'clipboard-handler.js',
            path: path.resolve(__dirname, 'dist'),
            library: 'ClipboardHandler',
            globalObject: 'this',
            libraryExport: 'default',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
            ]
        },
        optimization: {
            minimize: production,
            minimizer: [
                new UglifyJSPlugin({
                    parallel: require('os').cpus().length,
                    uglifyOptions: {
                        ie8: false,
                        keep_fnames: false,
                        output: {
                            beautify: false,
                            comments: (node, {value, type}) => type == 'comment2' && value.startsWith('!')
                        }
                    }
                })
            ]
        },
        plugins: [new webpack.BannerPlugin({ banner })]
    }
];
