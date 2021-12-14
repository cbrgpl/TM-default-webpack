/*

    * Дата-атрибуты поля
    - data-field-name="[NAME]" - определяет имя поля
    - data-field-type="[TYPE]" - определяет тип поля
      Доступные типы:
        - text
        - radio
        - checkbox

*/

const fieldTypes = {
  checkbox: 'checkbox',
  radio: 'radio',
  text: 'text'
}

export default class FormParser {
  static getFormData( $form ) {
    const $fields = $form.querySelectorAll( '[data-field-name]' )
    const formData = {}

    $fields.forEach( ( $field ) => {
      const { fieldName, fieldValue } = FormParser.getFieldData( $field )
      formData[ fieldName ] = fieldValue
    } )

    return formData
  }

  static getFieldData( $field ) {
    const fieldType = FormParser._defineFieldType( $field )
    return FormParser._parseField( $field, fieldType )
  }

  static _defineFieldType( $field ) {
    return $field.getAttribute( 'data-field-type' )
  }

  static _parseField( $field, type ) {
    let fieldValue = null

    switch( type ) {
    case fieldTypes.text:
      fieldValue = FormParser._parseText( $field )
      break
    case fieldTypes.radio:
      fieldValue = FormParser._parseRadio( $field )
      break
    case fieldTypes.checkbox:
      fieldValue = FormParser._parseCheckbox( $field )
      break
    default:
      console.error( 'Неправильный тип поля' )
      return null
    }


    return {
      fieldName: $field.getAttribute( 'data-field-name' ),
      fieldValue
    }
  }

  static _parseText( $field ) {
    const $input = $field.querySelector( 'input' ) || $field.querySelector( 'textarea' )

    return $input.value
  }

  static _parseRadio( $field ) {
    const $radios = $field.querySelectorAll( 'input[type="radio"]' )

    for( const $radio of $radios ) {
      if( $radio.checked ) {
        return $radio.value
      }
    }
  }

  static _parseCheckbox( $field ) {
    const $checkboxes = $field.querySelectorAll( 'input[type="checkbox"]' )
    const values = []

    for( const $checkbox of $checkboxes ) {
      if( $checkbox.checked ) {
        values.push( $checkbox.value )
      }
    }

    return values
  }
}
