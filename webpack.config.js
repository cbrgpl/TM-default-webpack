const webpack = require( 'webpack' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' )
const ImageMinimizerPlugin = require( 'image-minimizer-webpack-plugin' )
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const TerserJSPlugin = require( 'terser-webpack-plugin' )
const path = require( 'path' )
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin

const VIEWS = [
  [ 'index', 'Название во VIEWS' ],
]

const dotenv = require( 'dotenv' ).config( {
  path: path.join( __dirname, '.env' )
} )

const devMode = process.env.NODE_ENV !== 'production'
// console.log( process.env.NODE_ENV )

function generateBundels( viewsList ) {
  return viewsList.reduce( ( accumulator, view ) => {
    const anPageBundles = [
      `./src/js/entries/${ view[ 0 ] }.js`,
      `./src/scss/${ view[ 0 ] }/_critical.scss`
    ]

    accumulator[ view[ 0 ] ] = anPageBundles
    return accumulator
  }, {} )
}

function generateViews( viewsList ) {
  return viewsList.reduce( ( accumulator, view ) => {
    const anPage = new HtmlWebpackPlugin( {
      title: view[ 1 ],
      template: `!!ejs-compiled-loader!views/${ view[ 0 ] }.ejs`,
      filename: `${ view[ 0 ] }.html`,
      chunks: [ 'general', view[ 0 ] ]
    } )

    accumulator.push( anPage )
    return accumulator
  }, [] )
}

module.exports = ( env, argv ) => {
  return {
    entry: {
      general: [
        './src/js/general.js',
        './src/scss/general/_critical.scss'
      ],
      ...generateBundels( VIEWS )
    },
    devtool: devMode ? 'eval-source-map' : 'nosources-source-map', // source-map used for TerserJSPlugin
    mode: devMode ? 'development' : 'production',
    devServer: {
      static: './dist',
      hot: true,
      compress: true,
      devMiddleware: {
        index: true,
        mimeTypes: { 'text/html': [ 'html' ] },
        writeToDisk: true,
      },
    },
    output: {
      path: path.resolve( __dirname, './dist' ),
      filename: '[name].js',
      publicPath: devMode ?  '../' : './',
      assetModuleFilename: 'images/[hash][ext][query]',
    },
    module: {
      rules: [
        {
          test: /\.ejs$/,
          loader: 'ejs-compiled-loader',
          options: {
            tmlmin: true,
            htmlminOptions: {
              minifyCSS: true,
              minifyJS: true,
              removeComments: true
            }
          }
        },
        {
          test: /\.svg$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 0 * 1024
            }
          },
          use: 'svgo-loader'
        },
        {
          test: /\.(jpe?g|png|gif|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 0 * 1024 // 8kb как и по дефолту, это просто напоминалка
            }
          },
        },
        {
          test: /\.ico$/i,
          type: 'asset/resource',
        },
        {
          test:  /\.s?[ac]ss$/, // css||scss||sass
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader:  'css-loader',
              options: {
                sourceMap: true,
              }
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                implementation: require( 'sass' ),
                additionalData: `
                @import '~@scss/_variables.scss';
                @import '~@scss/_utils.scss';
                `
              }
            },
          ],
        },
        {
          test: /\.m?js$/,
          exclude: '/node_modules/',
          loader: 'babel-loader',
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext][query]',
          }
        },
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      minimize: true,
      minimizer: [
        new TerserJSPlugin( {} ),
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      ...generateViews( VIEWS ),
      new CleanWebpackPlugin( {
        cleanStaleWebpackAssets: false,
      } ),
      new webpack.DefinePlugin( {
        'process.env': dotenv.parsed
      } ),
      new MiniCssExtractPlugin( {
        filename: devMode  ? 'css/[name].css' : 'css/[name].[fullhash].css',
        chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[fullhash].css',
        ignoreOrder: false,
      } ),
      new ImageMinimizerPlugin( {
        test: /\.(jpe?g|png)$/i,
        filename: '[path][name][ext][query]',
        minimizerOptions: {
          plugins: [
            [ 'gifsicle', { interlaced: true } ],
            [ 'jpegtran', { progressive: true } ],
            [ 'optipng', { optimizationLevel: 1 } ],
          ]
        }
      } ),
    ],
    resolve: {
      alias: {
        '@': path.resolve( __dirname, 'src' ),
        '@icons': path.resolve( __dirname, 'src', 'assets', 'icons' ),
        '@webp': path.resolve( __dirname, 'src', 'assets', 'images', 'webp' ),
        '@images': path.resolve( __dirname, 'src', 'assets', 'images' ),
        '@enums': path.resolve( __dirname, 'src', 'enums' ),
        '@js': path.resolve( __dirname, 'src', 'js' ),
        '@classes': path.resolve( __dirname, 'src', 'js', 'helpers', 'classes' ),
        '@utils': path.resolve( __dirname, 'src', 'js', 'helpers', 'utils' ),
        '@plugins': path.resolve( __dirname, 'src', 'js', 'plugins' ),
        '@service': path.resolve( __dirname, 'src', 'js', 'service' ),
        '@scss': path.resolve( __dirname, 'src', 'scss' ),
        '@templates': path.resolve( __dirname, 'src', 'templates' )
      },
    },
  }
}
