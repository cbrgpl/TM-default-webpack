import EventController from './_Eventer'

/**
 * elements: {
 *  root: {
 *    events: [
 *      [ 'eventName', handlerFn ]
 *    ]
 *  },
 *  any: {
 *    selector: '',
 *    events: [...]
 *  }
 * }
 */

export default class Element {
  constructor( $el, name, created = () => 1 ) {
    this.$el = $el
    this.name = name
    this.eventer = new EventController()

    created( this )
  }

  applyCrucialHandlers( elements ) {
    for( const element of Object.entries( elements ) ) {
      const elementName = element[ 0 ]
      const elementParams = element[ 1 ]

      const $elem = elementName === 'root' ? this.$el : this.$el.querySelector( elementParams.selector )

      for( const event of elementParams.events ) {
        const eventName = event[ 0 ]
        const handler = Element.getBindedHandler( event[ 1 ], this )

        $elem.addEventListener( eventName, handler )
      }
    }
  }

  on( eventName, handler, options ) {
    const bindedHandler = Element.getBindedHandler( handler, this )
    this.eventer.addHandler( eventName, bindedHandler, options )
  }

  static getBindedHandler( handler, vm ) {
    return handler.bind( vm )
  }
}
