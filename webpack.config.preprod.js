const imagemin = require( 'imagemin' )
const globby = require( 'globby' )
const path = require( 'path' )
const { normalizeConfig } = require( 'image-minimizer-webpack-plugin' )

const imageminConfig = normalizeConfig( {
  plugins: [
    [ 'imagemin-webp', { quality: 100, method: 6 } ],
  ]
} )


async function doCompress( srcFile, outDir ) {
  await imagemin( [ srcFile ],{
    destination: 'src/assets/images/' + outDir,
    plugins: imageminConfig.plugins,
  } )
}

async function proccessing() {
  globby( 'src/assets/images/**/*.{jpg,png,gif}', { nodir: true } ).then( filePaths => {
    filePaths.forEach( filePath => {
      let fileDir = path.dirname( filePath ).replace( 'src/assets/images', '' )
      doCompress( filePath, 'webp/' + fileDir )
    } )
  } )
}

proccessing()
