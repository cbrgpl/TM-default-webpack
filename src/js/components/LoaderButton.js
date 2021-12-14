import Element from './_Element'

export default class ButtonLoader extends Element {
  constructor( $el, name, created ) {
    super( $el, name, created )
  }

  showLoader( event ) {
    const $loader = this.$el.querySelector( '.btn-loader' )

    setTimeout( () => {
      $loader.style.display='none'
      this.eventer.emit( 'loaderHidden', { timeoutHide: true } )
    }, 15000 )

    $loader.style.display = 'flex'

    this.eventer.emit( 'loaderShown', event )
  }

  hideLoader( event ) {
    const $loader = this.$el.querySelector( '.btn-loader' )
    $loader.style.display='none'

    this.eventer.emit( 'loaderHidden', event )
  }
}
