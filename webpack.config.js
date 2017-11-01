const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

const minifyHTML = (env) => {
    if (env === 'production') {
        return {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        };
    }

    return false;
};

const buildFolder = process.env.NODE_ENV === 'production' ? 'dist' : 'dev';

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: ['./js/index.jsx', './scss/main.scss']
    },
    output: {
        path: path.resolve(__dirname, buildFolder),
        filename: path.join('scripts', '[name].js?[chunkhash]')
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [/node_modules\/dom7/, /src\/js/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'env', 'react']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '../',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(woff2?|ttf|eot|svg|otf)$/,
                loader: 'file-loader',
                options: {
                    hash: 'sha512',
                    digest: 'hex',
                    name: 'fonts/[name].[ext]?[hash]'
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin([buildFolder]),
        new HtmlWebpackPlugin({
            title: 'Emotion Client',
            template: './html-template/index.ejs',
            minify: minifyHTML(process.env.NODE_ENV)
        }),
        new ExtractTextPlugin({
            filename: 'styles/[name].css?[chunkhash]',
            allChunks: true
        }),
        new WebpackChunkHash()
    ],
    resolve: {
        modules: [
            path.join(__dirname, 'src'),
            'node_modules'
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'src')
    },
    devtool: process.env.NODE_ENV === 'production' ? '' : 'source-map'
};
