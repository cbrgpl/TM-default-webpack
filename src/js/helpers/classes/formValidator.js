import DomHandler from '@classes/DomHandler'
/*
    * Дата-атрибуты поля
    - data-field - определяет поля
    - data-error-state="false||true" - состояние ошибки поля

    * Доступные дата атрибуты валидатора:
    - data-validator-[NAME]="params" - определяет валидатор с параметрами валидирования
    - data-validator-[NAME]-label="customLabel" - определяет текст error label'a для валидатора

    * Группы элементов
    - data-checkbox-group="maxSelectedItems" - максимальное количество выбранных чекбоксом
    - data-radio-group - определяет группу радио-кнопок
    - data-validator-group-label="customLabel" - определяет текст error label'a для группы эл-ов

    * Ошибка
    - data-field-error-container - error labels container
    - data-field-error - error label валидатора


    * Форматы:
    <div data-field-name="NAME" data-error-state="false">
        <input data-validator-NAME="params" data-error-label="Error number 2" type="text" />
        <span data-field-error></span>
    </div>

    <div data-field-name="NAME" data-error-state="false">
        <div data-radio-group data-error-label="LABEL" class="form-field-group"></div>
        <span data-field-error></span>
    </div>

    <div data-field-name="NAME" data-error-state="false">
        <div data-checkbox-group data-error-label="LABEL" class="form-field-group"></div>
        <span data-field-error></span>
    </div>

*/

// Валидатор должен возвращать isError значение
const validatorsList = {
  minLength: {
    validator( value, minLength ) {
      return value.length <= minLength
    },
    paramsParser( rawParams ) {
      return Number( rawParams )
    },
    getError( minLength ) {
      return `Длина меньше ${ minLength }!`
    }
  },
  required: {
    validator( value ){
      return !value
    },
    getError() {
      return 'Обязательно'
    }
  },
  email: {
    validator( value, emailRegexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ ) {
      return !emailRegexp.test( value )
    },
    paramsParser( rawParams ) {
      return new RegExp( rawParams )
    },
    getError() {
      return 'Введите правильный email'
    }
  },
  phone: {
    validator( value, phoneRegexp = /\+\d \(\d{3}\) \d{3}-\d\d-\d\d/ ) {
      return !phoneRegexp.test( value )
    },
    paramsParser( rawParams ) {
      return new RegExp( rawParams )
    },
    getError() {
      return 'Введите телефон в верном формате'
    }
  }
}

// TODO Лучше переделать к формату создания инстанса для каждой формы, т.к. можно будет кешировать ошибки и не парсить их каждый раз
// TODO Всю логику установки валидаторов лучше все-таки перенести в JS.
export default class FormValidator {
  static validate( $form ) {
    const $fields = $form.querySelectorAll( '[data-field-name]' )
    const validationResult = {
      formError: false,
    }

    FormValidator.clearErrors( $form )

    $fields.forEach( $field => {
      const fieldName = $field.getAttribute( 'data-field-name' )

      if( FormValidator._fieldIsGroup( $field ) ) {
        validationResult[ fieldName ] = FormValidator._validateGroup( $field )
      } else {
        validationResult[ fieldName ] = FormValidator._validateSingleField( $field )
      }

      FormValidator._updateErrorState( $field, validationResult[ fieldName ] )
      FormValidator._setFieldErrorLabels( $field, validationResult[ fieldName ] )

      if( validationResult[ fieldName ].fieldError ) {
        if( FormValidator._isFieldContainsErrors( $field ) ) {
          FormValidator._updateErrors( $field, validationResult[ fieldName ] )
        }

        validationResult.formError = true
      }
    } )

    return validationResult
  }

  static _updateErrors( $field, validationResult ) {
    const errors = FormValidator._getFieldErrors( validationResult ) // returns [ str ]
    const $errors = []

    for( const error of errors ) {
      $errors.push( FormValidator._createErrorNode( error ) )
    }

    FormValidator._insertErrors( $field, $errors )
  }

  static _insertErrors( $field, $errors ) {
    const $errorContainer = $field.querySelector( 'div[data-field-error-container]' )

    DomHandler.addChildren( $errorContainer, $errors )
  }

  static clearErrors( $form ) {
    const $fields = $form.querySelectorAll( '[data-field-name]' )

    for( const $field of $fields ) {
      const $errorContainer = $field.querySelector( 'div[data-field-error-container]' )
      if( $errorContainer ){
        DomHandler.deleteChildren( $errorContainer )
      }
    }
  }

  static _createErrorNode( error ) {
    const $error = document.createElement( 'span' )
    $error.setAttribute( 'data-field-error', '' )
    $error.innerText = error

    return $error
  }

  static _getFieldErrors( validationResult ) {
    const errors = []

    for( const validator in validationResult.validators ) {
      if( validationResult.validators[ validator ].errorState ) {
        errors.push( validationResult.validators[ validator ].error )
      }
    }

    return errors
  }

  static reset( $form ) {
    const $fields = $form.querySelectorAll( '[data-field-name]' )

    for( const $field of $fields ) {
      FormValidator._updateErrorState( $field, { fieldError: false } )
    }
  }

  static _isFieldContainsErrors( $field ) {
    return $field.querySelector( 'div[data-field-error-container]' ) !== null
  }

  static _updateErrorState( $field, fieldValidation ) {
    $field.setAttribute( 'data-error-state', fieldValidation.fieldError )
  }

  static _fieldIsGroup( $field ) {
    return $field.querySelector( '.form-field-group' ) !== null
  }

  static _validateSingleField( $field ) {
    const $input = $field.querySelector( 'input' ) || $field.querySelector( 'textarea' )
    const validationObject = FormValidator._parseValidators( $input )
    const inputValue = $input.value

    return FormValidator._applyValidators( inputValue, validationObject )
  }

  static _setFieldErrorLabels( $field, fieldValidationResult ) {
    if( fieldValidationResult.fieldError ) {
      for( const validatorName in fieldValidationResult.validators ) {
        if( fieldValidationResult.validators[ validatorName ].errorState ) {
          const $input = $field.querySelector( 'input' ) || $field.querySelector( 'textarea' )
          fieldValidationResult.validators[ validatorName ].error = $input.getAttribute( `data-validator-${ validatorName }-label` ) || fieldValidationResult.validators[ validatorName ].error
        }
      }
    }
    return fieldValidationResult
  }


  static _parseValidators( $validateElem ){
    const validationObject = {
      validators: {},
      params: {}
    }

    const attrs = $validateElem.attributes
    const validatorRegexp = new RegExp( 'data-validator-[a-zA-Z]+$' )

    for( const attribute of attrs ) {
      if( validatorRegexp.test( attribute.name ) ) {
        const validatorName = attribute.name.replace( 'data-validator-', '' )
        validationObject.validators[ validatorName ] = validatorsList[ validatorName ]
        validationObject.params[ validatorName ] = attribute.value
      }
    }

    return validationObject
  }

  static _applyValidators( value, validationObject ) {
    const fieldValidationResult = {
      fieldError: false,
      validators: {

      }
    }

    for( const validatorName in validationObject.validators ) {
      const validator = validationObject.validators[ validatorName ]
      const validatorParams = validationObject.params[ validatorName ] ? validator.paramsParser( validationObject.params[ validatorName ] ) : undefined
      fieldValidationResult.validators[ validatorName ] = {
        errorState: validator.validator( value, validatorParams ),
        error: validator.getError()
      }

      if( fieldValidationResult.validators[ validatorName ].errorState ) {
        fieldValidationResult.fieldError = true
      }
    }
    return fieldValidationResult
  }

  static _validateGroup( $field ) {
    const $group = $field.querySelector( '.form-field-group' )
    const $elems = $group.querySelectorAll( 'input' )

    if( $group.hasAttribute( 'data-checkbox-group' ) ) {
      const attrValue = $group.getAttribute( 'data-checkbox-group' ).getAttribute( 'data-checkbox-group' )
      const maxSelectedItems = attrValue === '' ? null : Number( attrValue )
      return FormValidator._validateCheckboxGroup( $elems, maxSelectedItems )
    } else if( $group.hasAttribute( 'data-radio-group' ) ) {
      return FormValidator._validateRadioGroup( $elems )
    } else {
      console.warn( 'В поле ' )
      console.warn()

    }
  }

  // return error state
  static _validateCheckboxGroup( $elems, maxSelectedItems ) {
    let selectedItemsCounter = 0

    for( const $elem of $elems ) {
      selectedItemsCounter += $elem.checked
    }

    return { fieldError: selectedItemsCounter > maxSelectedItems, validators: { group: { errorState: selectedItemsCounter > maxSelectedItems, error:  `Выберите до ${ maxSelectedItems } вариантов` } } }
  }

  static _validateRadioGroup( $elems ) {
    let checked = false

    for( const $elem of $elems ) {
      checked = $elem.checked

      if( checked ) {
        break
      }
    }


    return { fieldError: !checked, validators: { group: { errorState: !checked, error: 'Выберите хотя бы 1 вариант' } } }
  }
}
