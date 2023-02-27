const { merge } = require('webpack-merge');
const webpack = require('webpack');
const resolve = require('resolve');

const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const toolkitWebpackConfig = require('@cerner/webpack-config-terra');

const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

const fs = require('fs');
const path = require('path');

const getClientEnvironment = require('./env');
const paths = require('./paths');

const modules = require('./modules');

const publicUrl = process.env.PUBLIC_URL;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const appSrc = resolveApp('src');

const clientEnv = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
const useTypeScript = fs.existsSync(paths.appTsConfig);
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');

const TerserPlugin = require('terser-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appWebpackConfig = (env, argv) => {
    const isProd = env === 'production';
    const publicPath = publicUrl;
    const filename = isProd ? '[name].bundle.[hash].js' : '[name].bundle.js';
    const runWebpackBundleAnalyzer = process.env.npm_config_runWebpackBundleAnalyzer ? true : false;
    env =
        env == null
            ? { disableAggregateTranslations: true }
            : Object.assign({}, env, { disableAggregateTranslations: true });

    return {
        entry: {
            index: './src/index.tsx',
        },
        output: {
            path: path.resolve(__dirname, '../build/'),
            publicPath: publicPath,
            chunkFilename: filename,
            filename: filename,
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: './index.html',
                template: './public/index.html',
            }),
            new webpack.DefinePlugin(clientEnv.stringified),
            new ManifestPlugin({
                fileName: 'asset-manifest.json',
                publicPath: publicUrl,
                generate: (seed, files, entrypoints) => {
                    const manifestFiles = files.reduce((manifest, file) => {
                        manifest[file.name] = file.path;
                        return manifest;
                    }, seed);
                    return {
                        files: manifestFiles,
                    };
                },
            }),
            useTypeScript &&
                new ForkTsCheckerWebpackPlugin({
                    typescript: resolve.sync('typescript', {
                        basedir: paths.appNodeModules,
                    }),
                    async: env === 'development',
                    useTypescriptIncrementalApi: true,
                    checkSyntacticErrors: true,
                    resolveModuleNameModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
                    resolveTypeReferenceDirectiveModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
                    tsconfig: paths.appTsConfig,
                    reportFiles: [
                        '**',
                        '!**/__tests__/**',
                        '!**/?(*.)(spec|test).*',
                        '!**/src/setupProxy.*',
                        '!**/src/setupTests.*',
                    ],
                    silent: true,
                    // The formatter is invoked directly in WebpackDevServerUtils during development
                    formatter: env === 'production' ? typescriptFormatter : undefined,
                }),
        ].concat(runWebpackBundleAnalyzer ? [new BundleAnalyzerPlugin()] : []),
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: ['ts-loader'],
                    exclude: ['/node_modules/'],
                    include: appSrc,
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.tsx'],
            modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
            alias: {
                react: path.resolve('node_modules/react'),
                'react-dom': path.resolve('node_modules/react-dom'),
            },
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'async',
                name: false,
                minSize: 100000,
                maxSize: 100000,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 100000,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        },
    };
};

const minimizerConfig = () => ({
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        typeofs: false,
                    },
                    minify: (file, sourceMap) => {
                        const uglifyJsOptions = {
                            /* your `uglify-js` package options */
                        };

                        if (sourceMap) {
                            uglifyJsOptions.sourceMap = {
                                content: sourceMap,
                            };
                        }

                        return require('uglify-js').minify(file, uglifyJsOptions);
                    },
                },
            }),
        ],
    },
});

const mergedConfig = (env, argv) => {
    let config =
        env === 'production'
            ? merge(toolkitWebpackConfig(env, argv), appWebpackConfig(env, argv), minimizerConfig())
            : merge(toolkitWebpackConfig(env, argv), appWebpackConfig(env, argv));

    // This is required to bundle the web compatible octokit/rest.
    config.resolve.mainFields = ['browser', 'module', 'main'];

    return config;
};

module.exports = mergedConfig;
