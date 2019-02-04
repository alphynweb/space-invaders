const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader', 
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {

                    }
                }
            },
            // Css
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [ // 'use' is the long version of 'loader' which allows config
                    // Loaders are parsed from bottom to top in this list
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: { // Configure this loader
                            // importLoaders: 1, // Tells css loader that there is 1 loader to be loaded beforehand
                            modules: true, // Enable css modules
                            localIdentName: '[name]__[local]__[hash:base64:5]', // Define how the generated classes created by modules look like 
                            // In this case, the class name that is given in the code followed by the module (component) name followed by the hash
                        }
                    },
                ],
            },
            // Images
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=8000&name=assets/images/[name].[ext]'
            },
            // Audio
            {
                test: /\.(mp3)$/,
                loader: 'file-loader?name=assets/audio/[name].[ext]'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Production',
            template: __dirname + '/src/index.html', // A path to the index.html file            
            filename: 'index.html', // Output filename
            inject: 'body' // Where to inject 
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};