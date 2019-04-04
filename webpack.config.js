'use strict';
var webpack = require('webpack');
var HappyPack = require('happypack');
var os = require('os');
var happyThreadPool = HappyPack.ThreadPool({
        size: os.cpus().length
    });
var path = require("path");
var env = process.env.NODE_ENV;
var theme = {};
for (var j in process.env) {
    if (j.indexOf("npm_package_theme_") > -1) {
        var i = j.replace("npm_package_theme_", "").replace(/\_/g, "-");
        theme[i] = process.env[j];
    }
};
var _plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': '"' + env + '"'
        }
    }),
    new webpack.HotModuleReplacementPlugin({}), // 启用webpack的热模块替换功能
    new HappyPack({
        id: "styles",
        verbose: true,
        threadPool: happyThreadPool,
        loaders: [`style-loader!css-loader!less-loader?{'modifyVars':${JSON.stringify(theme)}}`]
    }),
    new HappyPack({
        id: 'speedjs',
        verbose: true,
        threadPool: happyThreadPool,
        loaders: [{
            path: 'babel-loader',
            query: {
                cacheDirectory: true,
                presets: [
                    ['es2015', {
                        modules: false
                    }],
                    'react',
                    'stage-0'
                ],
                plugins: [
                    ["import", [{
                        "libraryName": "antd",
                        "style": true
                    }]]
                ]
            }
        }]
    })
];
if (env == 'production') {
    _plugins.push(new webpack.optimize.UglifyJsPlugin({
        test: /\.js?$/,
        cache: true,
        parallel: true,
        uglifyOptions: {
            compress: {
                dead_code: true,
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }
    })
    )
};

const _resolve = {
    extensions: ['.js', '.less'],
    modules: [path.resolve(__dirname, "node_modules")],
    alias: {
        '@src': path.resolve(__dirname, './src/'),
        '@lib': path.resolve(__dirname, './build/'),
    },
}

const modules = {
    rules: [
        {
            test: /\.(jsx|js)?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: { // babel 转义的配置选项
                    babelrc: false,
                    presets: [
                        require.resolve('@babel/preset-react'),
                        [
                            require.resolve('@babel/preset-env'),
                            { modules: false }
                        ],
                    ],
                   cacheDirectory: true,
                   plugins: [
                          ['import', { libraryName: 'antd', style: true }],
                   ],
                },
            },
        },
        {
        test: /\.pdf$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'doc/[name].[ext]'
          }
        }
        },
        {
            test: /\.css$/,
            use: [
                {loader: 'style-loader'},
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                        importLoaders: 1
                    },
                },
                {loader: 'postcss-loader'}
            ]
        },
        {
            test: /\.(png|jpg|gif|svg)$/i,
            use: 'file-loader'
        },
        {
            test: /\.less$/,
            use: [
                {
                    loader: "style-loader"
                }, 
                {
                    loader: "css-loader"
                }, 
                {
                    loader: "less-loader", 
                    options: {
                        javascriptEnabled: true,
                    }
                }]
        },
    ]
};

const _stats = {
    warnings: false
};
const vendorReact = ["react", "react-dom", "babel-polyfill", "antd"];
const target = "web";
var item = [{
    name: "word",
    target: target,
    stats: _stats,
    entry: {
        init: vendorReact,
        word: __dirname + '/build/ocr/word.js',
    },
    output: {
        path: __dirname + '/public/ocr/',
        publicPath: "/ocr/",
        filename: "[name].js"
    },
    module: modules,
    resolve: _resolve,
    plugins: _plugins
}]

var arg = process.env.npm_config_module;
for (var i = 0; i < item.length; i++) {
    if (arg == item[i]["name"]) {
        item = [item[i]]
        break;
    }
};
console.log("现在环境" + env + ",模块是" + (arg || "全部"));
if (env != 'production') {
    module.exports = item;
} else {
    var i = 0;
    console.time("build");
    function buildModule() {
        if (i >= item.length) {
            console.timeEnd("build");
            process.exit(0);
            return;
        };
        console.log("正在编译:" + item[i]['name']);
        console.time(item[i]['name'])
        var multiCompiler = webpack(item[i]);
        multiCompiler.run((err, stats) => {
            console.timeEnd(item[i]['name']);
            i++;
            buildModule();
        });
    }
    buildModule();
}



