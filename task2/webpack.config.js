const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV !== 'production';

const config = {
    mode: isDev ? 'development' : 'production',
    entry: './src/scripts/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g)$/,
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name: '[name].[ext]',
                    outputPath: 'images',
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'src/index.html' },
            { from: 'css', to: 'css/' }
        ]),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
        hot: true
    },
    optimization: {
        minimize: !isDev
    }
};

module.exports = config;
