"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const dotenv_1 = __importDefault(require("dotenv"));
const web_1 = require("./web");
const obfuscate_1 = require("./obfuscate");
dotenv_1.default.config();
const build = (params) => {
    const isWebApp = params.type != `server`, { mode = `production`, obfuscateON = false, minimiseON = true, srcDir = `src`, productionDir = `public_html`, port = 3210, maxFileSizeMB = 2, resolveOptions = {}, licenseText = ``, } = params, { filesList = [], } = isWebApp ? {} : params, { entryPoints = {}, customWebRules = [], configWebPlugins = [], cssMinimise = [] } = isWebApp ? (0, web_1.webConfig)(params) : {}, fileSize = maxFileSizeMB * 1024 ** 2, envKeys = {};
    // Environment keys
    for (const key in process.env)
        envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);
    // entry points
    if (!isWebApp)
        for (let i = 0; i < filesList.length; i++) {
            const fileName = filesList[i];
            entryPoints[fileName] =
                `./${srcDir}/${fileName}.ts`;
        }
    ;
    return {
        entry: entryPoints,
        performance: {
            maxAssetSize: fileSize,
            maxEntrypointSize: fileSize,
        },
        output: {
            path: path_1.default.resolve(process.cwd(), productionDir),
            ...isWebApp ? {
                filename: `code/[name].[contenthash].js`,
                publicPath: '/', // Ensures assets are referenced with absolute paths starting from the root
            } : {
                filename: `[name].js`,
                libraryTarget: `commonjs`, // CommonJS for Node.js
                globalObject: `typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this)`,
            },
        },
        ...isWebApp ? {} : {
            target: 'node18', // Target Node.js environment
            node: {
                __dirname: false, // Prevent Webpack from mocking __dirname
                __filename: false, // Prevent Webpack from mocking __filename
            },
            externals: [(0, webpack_node_externals_1.default)()], // Externalize all node_modules
        },
        resolve: {
            extensions: [`.tsx`, `.ts`, `.js`, `.json`], // Resolve files
            ...isWebApp ? {} : {
                mainFields: [`module`, `main`],
                conditionNames: [`import`, `default`],
                aliasFields: [],
                preferRelative: true,
            },
            ...resolveOptions,
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: `ts-loader`,
                },
                ...isWebApp ? [] : [{
                        test: /\.node$/,
                        loader: 'node-loader',
                        options: {
                            name: '[name].[ext]',
                        },
                    }],
                ...customWebRules
            ],
        },
        plugins: [
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerMode: params.openAnalyzer == undefined ? `disabled` : `server`,
                openAnalyzer: params.openAnalyzer || false, // Prevents auto-opening the browser
            }),
            new webpack_1.default.DefinePlugin(envKeys),
            ...licenseText ? [new webpack_1.default.BannerPlugin({
                    banner: licenseText,
                    raw: true,
                })] : [],
            new clean_webpack_plugin_1.CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['code/*.js', 'code/*.js.LICENSE.txt'],
            }),
            ...obfuscateON ? [obfuscate_1.obfuscationSettings] : [],
            ...configWebPlugins,
        ],
        optimization: {
            minimize: minimiseON, // Enable minimization
            minimizer: [
                new terser_webpack_plugin_1.default({
                    terserOptions: {
                        compress: {
                            drop_console: false, // Do not remove console logs
                        },
                    },
                    ...isWebApp ? {} : {
                        extractComments: false, // Prevent duplicate comments for external modules
                    },
                }),
                ...cssMinimise,
            ],
            ...isWebApp ? {} : {
                usedExports: true, // Enable tree-shaking
                sideEffects: false, // Mark the project as free of side effects
            },
        }, // @ts-ignore
        devServer: {
            static: {
                directory: path_1.default.join(process.cwd(), productionDir),
            },
            port, // Specify your desired port
            open: true, // Automatically open the browser
            compress: true, // Enable gzip compression for files served
        },
        mode
    };
};
exports.build = build;
