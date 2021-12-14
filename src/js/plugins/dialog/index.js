import DialogController from './dialogController'

export default function initPlugin() {
  if( window.$show ) {
    console.warn( 'window.$show уже существует. Инициализация плагина преравана' )
    return
  }

  if( window.$hide ) {
    console.warn( 'window.$hide уже существует. Инициализация плагина преравана' )
    return
  }


  window.$show = function( dialogName ) {
    DialogController.changeState( dialogName, true )
  }

  window.$hide = function( dialogName ) {
    DialogController.changeState( dialogName, false )
  }
}
