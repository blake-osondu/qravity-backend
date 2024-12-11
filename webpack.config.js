const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    entry: {
        login: './src/js/login.js',
        preferences: './src/js/preferences.js',
        applications: './src/js/applications.js',
        components: './src/js/components.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'src/public/js')
    },
    plugins: [
        new Dotenv()
    ]
}; 