const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/storage.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};