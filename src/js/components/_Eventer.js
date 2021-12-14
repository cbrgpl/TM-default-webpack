export default class EventController {
  constructor() {
    this._emits = {}
  }

  emit( emitName, event ) {
    if( this._emits[ emitName ] ) {
      for( const handler of this._emits[ emitName ] ) {
        handler( event )
      }
    }
  }

  addHandler( emitName, handler, options = {} ) {
    if( this._emits[ emitName ] ) {
      if( options.once ){
        const onceWrapper = ( event ) => {
          handler( event )
          this.removeHandler( onceWrapper )
        }

        this._emits[ emitName ].push( onceWrapper )

      } else {
        this._emits[ emitName ].push( handler )

      }
    } else {
      this._emits[ emitName ] = []
      this._emits[ emitName ].push( handler )
    }
  }

  removeHandler( emitName, handler ) {
    if( this._emits[ emitName ] ) {
      this._emits[ emitName ].removeCallback( ( anHandler ) => anHandler === handler )
    }
  }
}
