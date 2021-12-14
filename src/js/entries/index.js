import(
  '@scss/index/_predefined.scss' )

// * Пример импорта модуля
// * () => import( /* webpackPrefetch: true */ '@js/modules/stickyHeader.js' ),
const modules = [
]


import(
  /* webpackPreload: true */
  '@js/modules/pageModulesRequirer.js' )
  .then( moduleInner => {
    const importModules = moduleInner.default

    importModules( modules )
  } )
  .catch( error => {
    console.group( 'Module Requirer error' )
    console.error( 'При загрузке запрощика модулей произошла какая-то ошибка...' )
    console.error( error )
    console.groupEnd()
  } )
