/**
 * * Этот класс используется для того, чтобы анимировать элементы во время скроллинга при помощи Intersection observer
 */

/*
  * Дата атрибуты работы с классом:
  - data-animator-name="animatorName" - указывает имя действующего аниматора
  - data-animate-entry="actionName" - указывает имя действия инициализации анимации
  - data-animate-arg-*="*" - указывает аргумент функции действия

*/

const basicDataAttrs = {
  animatorName: 'data-animator-name',
  animateAction: 'data-animate-action',
  animateArg: 'data-animate-arg-',
  animated: 'data-animate-animated'
}

function setAnimatedStatus( $elem ) {
  $elem.setAttribute( basicDataAttrs.animated, true )
}

function getAnimatedElems( name ) {
  return [ ...document.querySelectorAll( `[${ basicDataAttrs.animatorName }]` ) ].filter( ( $el ) => $el.getAttribute( basicDataAttrs.animatorName ) === name )
}

function getActionArgs( $el ) {
  const argAttrRegexp = new RegExp( basicDataAttrs.animateArg + '[a-zA-Z]+' )
  const elAttrs = [ ...$el.attributes ]
  const actionArgs = elAttrs.filter( ( attr ) => argAttrRegexp.test( attr.name ) )

  return actionArgs.map( ( attr ) => {
    return {
      name: attr.name.replace( basicDataAttrs.animateArg, '' ),
      value: attr.value !== '' ? attr.value : true
    }
  } )

}

function initObserver( { root = null, rootMargin = '0px 0px 0px 0px', threshold = 0 } ) {
  const options = {
    root,
    rootMargin,
    threshold
  }

  return new IntersectionObserver( callAction, options )
}

async function callAction( entries, observer ) {
  const actionsLib = observer.actionsLib$
  const actions = observer.actions$

  entries.forEach( ( entry ) => {
    const $target = entry.target

    if( entry.isIntersecting && $target.getAttribute( basicDataAttrs.animated ) !== 'true' ) {
      setAnimatedStatus( $target )
      const actionName = $target.getAttribute( basicDataAttrs.animateAction )
      const actionArgs = getActionArgs( $target )

      if( actions.includes( actionName ) ) {
        const action = actionsLib[ actionName ]
        action( entry, actionArgs )
      } else {
        console.warn( `В actionsLib нет action с именем ${ actionName }` )
      }
    }
  } )
}

export default class Animator {
  constructor( name, actionsLib = {}, observerParams = {} ) {
    this.name = name
    this.observer = initObserver( observerParams )

    this.observer.actionsLib$ = actionsLib
    this.observer.actions$ = Object.keys( actionsLib )
  }

  startObserving( preprocessor = ( $el ) => $el ) {
    const $animatedElems = getAnimatedElems( this.name )

    $animatedElems.forEach( ( $elem ) => {
      preprocessor( $elem )
      this.observer.observe( $elem )
    } )
  }
}
