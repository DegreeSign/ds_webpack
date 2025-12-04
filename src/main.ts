import path from "path"
import webpack, { Configuration } from "webpack"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import nodeExternals from "webpack-node-externals"
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import {
    ConfigBuild,
    StringObj,
} from "./types"
import dotenv from "dotenv"
import { webConfig } from "./web"
import { obfuscationSettings } from "./obfuscate"
dotenv.config();

const build = (params: ConfigBuild): Configuration => {

    const
        isWebApp = params.type != `server`,
        {
            mode = `production`,
            obfuscateON = false,
            minimiseON = true,
            srcDir = `src`,
            productionDir = `public_html`,
            port = 3210,
            maxFileSizeMB = 2,
            resolveOptions = {},
            licenseText = ``,
        } = params,
        {
            filesList = [],
        } = isWebApp ? {} : params,
        {
            entryPoints = {},
            customWebRules = [],
            configWebPlugins = [],
            cssMinimise = []
        } = isWebApp ? webConfig(params) : {},
        fileSize = maxFileSizeMB * 1024 ** 2,
        envKeys: StringObj = {};

    // Environment keys
    for (const key in process.env)
        envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);

    // entry points
    if (!isWebApp)
        for (let i = 0; i < filesList.length; i++) {
            const fileName = filesList[i];
            entryPoints[fileName] =
                `./${srcDir}/${fileName}.ts`;
        };

    return {
        entry: entryPoints,
        performance: {
            maxAssetSize: fileSize,
            maxEntrypointSize: fileSize,
        },
        output: {
            path: path.resolve(process.cwd(), productionDir),
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
            externals: [nodeExternals()], // Externalize all node_modules
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
        plugins: [ // @ts-ignore
            new BundleAnalyzerPlugin({
                analyzerMode: params.openAnalyzer == undefined ? `disabled` : `server`,
                openAnalyzer: params.openAnalyzer || false, // Prevents auto-opening the browser
            }),
            new webpack.DefinePlugin(envKeys),
            ...licenseText ? [new webpack.BannerPlugin({
                banner: licenseText,
                raw: true,
            })] : [],
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['code/*.js', 'code/*.js.LICENSE.txt'],
            }),
            ...obfuscateON ? [obfuscationSettings] : [],
            ...configWebPlugins,
        ],
        optimization: {
            minimize: minimiseON, // Enable minimization
            minimizer: [
                new TerserPlugin({ // Minify JavaScript
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
                usedExports: true,        // Enable tree-shaking
                sideEffects: false,       // Mark the project as free of side effects
            },
        }, // @ts-ignore
        devServer: {
            static: {
                directory: path.join(process.cwd(), productionDir),
            },
            port, // Specify your desired port
            open: true, // Automatically open the browser
            compress: true, // Enable gzip compression for files served
        },
        mode
    };
};

export { build };