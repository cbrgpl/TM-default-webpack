async function requireAnModule( moduleImport ) {
  const anModuleEntry = ( await moduleImport() ).default

  if( typeof anModuleEntry === 'function' ) {
    anModuleEntry()
  }

}

async function importModules( modules ) {
  for( const moduleImport of modules ) {
    requireAnModule( moduleImport )
  }
}

export default importModules
