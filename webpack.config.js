/**
 * webpack 2.x 单页应用配置,目前还不支持文件缓存
 */
var path = require('path');
var webpack = require('webpack');
/*
 * clean publishing directory
 * （清空发布目录）
 * */
var CleanWebpackPlugin = require('clean-webpack-plugin');

/*
 * create html
 * （创建html文件）
 * */
var HtmlWebpackPlugin = require('html-webpack-plugin');


/*
 * extract css
 * （提取css文件）
 * */
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//缓存manifest
var ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
var WebpackChunkHash = require("webpack-chunk-hash");

//dashboard
var DashboardPlugin = require('webpack-dashboard/plugin');


/*
 *  merge config
 *  （合并config文件）
 * */
var Merge = require('webpack-merge');

/*
 * auto open browser
 * （自动打开浏览器）
 * */
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

/*
 *  Detect how npm is run and branch based on that
 *  （当前 npm 运行）
 * */
var currentTarget = process.env.npm_lifecycle_event;

var debug,          // is debug
    devServer,      // is hrm mode
    minimize;       // is minimize


if (currentTarget == "build") { // online mode （线上模式）

    debug = false, devServer = false, minimize = true;

} else if (currentTarget == "dev") { // dev mode （开发模式）

    debug = true, devServer = false, minimize = false;

} else if (currentTarget == "dev-hrm") { // dev HRM mode （热更新模式）

    debug = true, devServer = true, minimize = false;
}


/*
 * proxy target address
 * （代理访问地址）
 * */
var proxyTarget = 'http://localhost:8888/';


var PATHS = {
    /*
     * publish path
     * （发布目录）
     * */
    publicPath: devServer ? '/webpack2.0ForSPA/dist/' : '/',


    /*
     * public resource path
     * （公共资源目录）
     * */
    libsPath: path.resolve(__dirname, "libs"),


    /*
     * resource path
     * （src 目录）
     * */
    srcPath: path.resolve(__dirname, 'src'),


    /*
    * node_modules path
    */
    node_modulesPath: path.resolve(__dirname, 'node_modules'),
}


var resolve = {
    /*
     * The directory (absolute path) that contains your modules
     * */
    modules: [
        PATHS.srcPath, 
        'node_modules'
    ],
    /*
     * An array of extensions that should be used to resolve modules
     * （引用时可以忽略后缀）
     * */
    extensions: ['.js', '.css', '.scss', '.ejs', '.png', '.jpg'],

    /*
     * Replace modules with other modules or paths.
     * （别名，引用时直接可以通过别名引用）
     * */
    alias: {
        /*
         * js
         */
        jquery: path.resolve(__dirname, "libs/js/jquery/jquery.js"),
        underscore: path.resolve(__dirname, "libs/js/underscore/underscore.js"),
        /*
         * css
         */
        bootstrapcss$: path.resolve(__dirname, "libs/css/bootstrap/bootstrap-3.3.5.css"),
        indexcss$: path.resolve(__dirname, "src/css/index.css"),
    }
}

/*
 * The entry point for the bundle.
 * （入口）
 * */
var entry = {
    index: './src/js/index.js',
    common: [
        path.resolve(__dirname, "libs/js/jquery/jquery.js"),
        path.resolve(__dirname, "libs/js/underscore/underscore.js")
    ],
};


/*
 * output options tell Webpack how to write the compiled files to disk
 * （webpack 编译后输出标识）
 * */
var output = {
    /*
     *  determines the location on disk the files are written to
     *  （输出目录）
     * */
    path: path.resolve(__dirname, 'dist'),

    /*
     * The publicPath specifies the public URL address of the output files when referenced in a browser
     * （发布后，资源的引用目录）
     * */
    publicPath: PATHS.publicPath,

    /*
     * Specifies the name of each output file on disk
     * （文件名称）
     * */
    filename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js',

    /*
     * The filename of non-entry chunks as relative path inside the output.path directory.
     * （按需加载模块时输出的文件名称）
     * */
    chunkFilename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js'
}

var loaders = [
    /*
     * Exports HTML as string, require references to static resources.
     * （html loader）
     * */
    {
        test: /\.html$/,
        use: "html-loader"
    },
    /*
     * img loader
     * */
    {
        test: /\.(png|gif|jpe?g)$/,
        use: [{
           loader: 'url-loader',
           options: {
                query: {
                    /*
                    *  limit=10000 ： 10kb
                    *  图片大小小于10kb 采用内联的形式，否则输出图片
                    * */
                    limit: 10000,
                    name: '/img/[name]-[hash:8].[ext]'
                }
           }
        }]
    },
    /*
     * font loader
     * */
    {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        use:[{
           loader: 'url-loader',
           options: {
                query: {
                    limit: 5000,
                    name: '/font/[name]-[hash:8].[ext]'
                }
           }
        }]
    },
    /*
     * Extract css files
     * （提取css到单独文件loader）
     */
    {
        test: /\.css$/,
        use:ExtractTextPlugin.extract({
            fallback:"style-loader",
            use: "css-loader",
            publicPath:"../"
        })
    },


];

var plugins = [
    /*
     * gloabal flag
     * （全局标识）
     * */
    new webpack.DefinePlugin({
        /*
         * dev flag
         * （开发标识）
         * */
        __DEV__: debug,

        /*
         * proxy flag
         * （代理的标识）
         * */
        __DEVAPI__: devServer ? "/devApi/" : "''",
        'process.env.NODE_ENV': '"production"',
    }),

    /*
     * common js 缓存
     * （公共js）
     * */
    // new webpack.optimize.CommonsChunkPlugin({
    //     name : ["common","manifest"],
    //     minChunks: Infinity
    // }),

    // new webpack.HashedModuleIdsPlugin(),
    // new WebpackChunkHash(),
    // new ChunkManifestPlugin({
    //   filename: "chunk-manifest.json",
    //   manifestVariable: "webpackManifest",
    //   inlineManifest: true
    // }),
    new webpack.optimize.CommonsChunkPlugin(
        {name: ["common", "webpackAssets"]}
    ),

    /*
     *  Module (value) is loaded when the identifier (key) is used as free variable in a module
     *  （如：使用jquery 可以直接使用符号 "$"）
     * */
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        "_": "underscore"
    }),

    /*
     * clean publishing directory
     * （发布前清空发布目录）
     * */
    new CleanWebpackPlugin(['dist'], {
        root: '', // An absolute path for the root  of webpack.config.js
        verbose: true,// Write logs to console.
        dry: false // Do not delete anything, good for testing.
    }),


    /*
     * extract css
     * （提取css文件到单独的文件中）
     */
    new ExtractTextPlugin(devServer ? {filename:"css/[name].css" } : {filename:"css/[name]-[chunkhash:8].css", allChunks: true}),


    /*
     *create html file
     * （创建html文件）
     * */
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: __dirname + '/src/index.html',
        /*
         * inject: true | 'head' | 'body' | false Inject all assets into the given template or templateContent -
         * When passing true or 'body' all javascript resources will be placed at the bottom of the body element.
         * 'head' will place the scripts in the head element.
         * */
        inject: 'true',

        // 需要依赖的模块
        chunks: ['common', 'index', "webpackAssets"],

        // 根据依赖自动排序
        chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
        filename: 'html/hrm.html',
        template: path.resolve(__dirname, 'src/html/hrm.html'),
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: 'html/home.html',
        template: path.resolve(__dirname, 'src/html/home.html'),
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: 'html/menu1.html',
        template: path.resolve(__dirname, 'src/html/menu1.html'),
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: 'html/menu2.html',
        template: path.resolve(__dirname, 'src/html/menu2.html'),
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: 'html/menu3.html',
        template: path.resolve(__dirname, 'src/html/menu3.html'),
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: 'html/menu5.html',
        template: path.resolve(__dirname, 'src/html/menu5.html'),
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: 'html/menu6.html',
        template: path.resolve(__dirname, 'src/html/menu6.html'),
        inject: false,
    })
];


if (minimize) {

    plugins.push(
        /*
         * Uglify
         * （压缩）
         * */
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'module', '_']
            },
            compress: {
                warnings: false
            },
            comments: false,
        })
    )

}


var config = {
    entry: entry,
    output: output,
    // devtool: "source-map",
    module: {
        rules: loaders
    },
    resolve: resolve,
    plugins: plugins,
}


/*
 *  Hrm setting
 * （开启热更新，并自动打开浏览器）
 * */
if (devServer) {

    config = Merge(
        config,
        {
            plugins: [
                // Enable multi-pass compilation for enhanced performance
                // in larger projects. Good default.
                new webpack.HotModuleReplacementPlugin(),
                new DashboardPlugin(),
                new OpenBrowserPlugin({url: 'http://localhost:8080' + PATHS.publicPath + 'index.html'})
            ],
            devServer: {
                // Enable history API fallback so HTML5 History API based
                // routing works. This is a good default that will come
                // in handy in more complicated setups.
                historyApiFallback: true,

                // Unlike the cli flag, this doesn't set
                // HotModuleReplacementPlugin!
                hot: true,
                inline: true,

                // Display only errors to reduce the amount of output.
                stats: 'errors-only',

                // Parse host and port from env to allow customization.
                //
                // If you use Vagrant or Cloud9, set
                // host: options.host || '0.0.0.0';
                //
                // 0.0.0.0 is available to all network devices
                // unlike default `localhost`.
                host: "localhost", // Defaults to `localhost`   process.env.HOST
                port: "8080",  // Defaults to 8080   process.env.PORT
                compress: true,
                /*
                 *  代理访问
                 *  1、可以绕过同源策略 和 webpack '热更新'结合使用
                 */
                proxy: {
                    '/devApi/*': {
                        target: proxyTarget,
                        secure: true,
                        /*
                         * rewrite 的方式扩展性更强，不限制服务的名称
                         * */
                        rewrite: function (req) {
                            req.url = req.url.replace(/^\/devApi/, '');
                        }
                    }
                }
            }
        }
    );
}

module.exports = config;






