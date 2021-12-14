const API_URL = 'https://web-soft.dev/api'
const endpoints = {
  briefAdd: `${ API_URL }/brief/add`
}

const defaultOptions = {
  postable: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  },
  get: {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
}

const getDefaultOptions = ( requestType ) => JSON.parse( JSON.stringify( defaultOptions[ requestType ] ) )

export default class APIService {
  static async postable( key, body, options = {} ) {
    const requestOptions = APIService._getParams( options, 'postable' )

    requestOptions.body = body

    const url = endpoints[ key ]

    return APIService._request( {
      url,
      options: requestOptions,
    } )
  }

  static async get( key, props, options = {} ) {
    const requestOptions = APIService._getParams( options, 'get' )

    const url = APIService._prepareGetUrl( endpoints[ key ], props )

    return APIService._request( {
      url,
      options: requestOptions,
    } )
  }

  static _prepareGetUrl( url, props ) {
    for ( const prop in props ) {
      if ( props[ prop ] ) {
        url = url + `${ prop }=${ props[ prop ] }&`
      }
    }

    url = url.replace( /&$/, '' )

    return url
  }

  static _getParams( params, requestType ) {
    const options = getDefaultOptions( requestType )
    const headers = Object.assign( options.headers, params.headers )
    Object.assign( options, params )
    options.headers = headers

    return options
  }

  static async _request( { url, options  } ) {
    const response = await fetch( url, options )

    APIService._checkStatus( response )

    return await APIService._getFormattedResponse( response )
  }


  // Проверяю статус ответа, если не 200||400, throw'лю ошибку
  static _checkStatus ( response ) {
    const validStatuses = [ /2\d{2}$/, /4\d{2}$/ ]
    if( !validStatuses.some( ( statusGroup ) => statusGroup.test( response.status ) ) ) {
      throw {
        response,
        erorr: new Error( 'Невалидный статус ответа' )
      }
    }

    return response
  }

  static async _getFormattedResponse( response, type ) {
    return {
      response,
      data: await APIService._getResponseData( response, type )
    }
  }

  static async _getResponseData( response ) {
    const type = response.headers.get( 'Content-Type' ).lookbehindAlter( '^', /;.*/ )

    switch ( type ) {
    case 'application/json':
      return await response.json()
    case 'multipart/form-data':
      return await response.blob()
    case 'text/plain':
      return ( await response.text() ).replace( /"||'/g, '' )
    default:
      return null
    }
  }

}
