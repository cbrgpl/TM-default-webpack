import Dialog from '@/js/components/Dialog'
import ButtonLoader from '@/js/components/LoaderButton'
import Element from '@/js/components/_Element'

/**
 * Класс-контейнер, который создает функциональные элементы.
 * Все селекторы работают на основе data-attrs.
 */

/**
 * * Важные аттрибуты для работы контейнера
 * data-component-name* - имя компонента
 * data-component-type - тип компонента, по умолчанию - element
 */

function getAllComponents() {
  const dataKey = 'data-component-name'
  const dataType = 'data-component-type'

  const $componentNodes = document.querySelectorAll( `[${ dataKey }]` )
  const components = {}

  for( const $componentNode of $componentNodes ) {
    const componentName = $componentNode.getAttribute( dataKey )
    const componentType = $componentNode.getAttribute( dataType )

    if( !components[ componentName ] ) {
      components[ componentName ] = [ $componentNode, componentType ]
    } else {
      console.warn( `Компонент с именем ${ componentName } уже обработан. Повторная обработка была прервана` )
      console.warn( $componentNode )
    }
  }

  return components
}

function createComponent( componentName, componentDetails ) {
  switch( componentDetails[ 1 ] ) {
  case ComponentContainer.componentTypes.dialog:
    return { vm: new Dialog( componentDetails[ 0 ], componentName ), type: ComponentContainer.componentTypes.dialog }
  case ComponentContainer.componentTypes.loaderButton:
    return { vm: new ButtonLoader( componentDetails[ 0 ], componentName ), type: ComponentContainer.componentTypes.loaderButton }
  default:
    return { vm: new Element( componentDetails[ 0 ], componentName ), type: ComponentContainer.componentTypes.element }
  }
}

function getPropertyComponents() {
  const components = {}
  for( const type in ComponentContainer.componentTypes ) {
    components[ type ] = []
  }

  return components
}

class ComponentContainer {
    static componentTypes = {
      dialog: 'dialog',
      loaderButton: 'loaderButton',
      element: 'element'
    }

    constructor() {
      this.components = getPropertyComponents()

      const components = getAllComponents()
      for( const component in components ) {
        const { vm, type } = createComponent( component, components[ component ] )
        this.components[ type ].push( vm )
      }
    }

    getComponentsGroup( type ) {
      return this.components[ type ].reduce( ( acc, element ) => {
        acc.push( element )
        return acc
      }, [] )
    }

    getComponent( name, type ) {
      const elementIndex = this.components[ type ].findIndex( ( anElement ) => anElement.name === name )

      return elementIndex === -1 ? null : this.components[ type ][ elementIndex ]
    }
}

const componentContainer = new ComponentContainer()
const componentTypes = ComponentContainer.componentTypes

export {
  componentContainer,
  componentTypes
}
