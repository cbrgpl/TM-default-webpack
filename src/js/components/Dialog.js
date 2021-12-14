import Element from './_Element'

const elements = {
  root: {
    events: [
      [ 'click', closeDialog ]
    ]
  },
  close: {
    selector: '.dialog-close',
    events: [
      [ 'click', closeDialog ]
    ]
  },
  window: {
    selector: '.dialog-window',
    events: [
      [ 'click', stop ]
    ]
  }
}

// this refs to vm
function closeDialog( event ) {
  event.stopPropagation()
  this.hide()
}

function stop( event ) {
  event.stopPropagation()
}

let zIndexBase = 9999

export default class Dialog extends Element {
  constructor( $el, name, created ) {
    super( $el, name, created )

    this.applyCrucialHandlers( elements )
  }

  show( nativeEvent ) {
    const $dialog = this.$el

    $dialog.classList.add( 'dialog-wrapper--visible' )
    $dialog.style.zIndex = zIndexBase++

    this.eventer.emit( 'show', nativeEvent )
  }

  hide( nativeEvent ) {
    const $dialog = this.$el

    $dialog.classList.remove( 'dialog-wrapper--visible' )


    this.eventer.emit( 'hide', nativeEvent )
  }
}
