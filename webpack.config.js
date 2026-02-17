var path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        path: path.resolve("dist"),
        filename: "index.js",
        libraryTarget: "commonjs2"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    externals: [
        { react: "react" },
        function({ request }, callback) {
            if (/^@mui\/material/.test(request) || /^@emotion\/(react|styled)/.test(request)) {
                return callback(null, 'commonjs ' + request);
            }
            callback();
        },
    ],
    stats: {
        errorDetails: true
    }
};