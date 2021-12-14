// Пространство инициализации плагинов
// import extendBaseTypes from './baseJsExtends'
// import initDialogPlugin from './dialog'
// import( './dialog' )

async function importExtendBaseTypes() {
  const extendBaseTypes = ( await import( /* webpackPrefetch: true */ './baseJsExtends' ) ).default
  extendBaseTypes()
}

async function importDialogPlugin() {
  const initDialogPlugin = ( await import( /* webpackPrefetch: true */ './dialog' ) ).default
  initDialogPlugin()
}

importExtendBaseTypes()
importDialogPlugin()




// extendBaseTypes()
