import { componentContainer, componentTypes } from '@classes/componentContainer'

function getEvent() {
  return  { controllerEvent: true }
}

export default class DialogController {
  static changeState( dialogName, newState ) {
    const dialog = componentContainer.getComponent( dialogName, componentTypes.dialog )

    if( !dialog ) {
      console.error( `Диалог с именем "${ dialogName }" не был найден в контейнере` )
      return
    }

    if( newState ) {
      dialog.show( getEvent() )
    } else {
      dialog.hide( getEvent() )
    }
  }
}
