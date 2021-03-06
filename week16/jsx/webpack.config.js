const path = require('path');
module.exports = {
    entry: "./main.js",
    // output: {
    //     path: path.resolve(__dirname, 'dist'),
    //     filename: 'animation-demo.js'
    //   },
    module: {
        rules: [
            { 
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [["@babel/plugin-transform-react-jsx", {pragma: "createElement"}]],
                    }
                }
            }
        ]
    },
    mode: 'development'
}