import APIService from './ApiService'

export default class Service extends APIService {
  /*
    {
      "serviceType": "string",
      "description": "string",
      "budget": "string",
      "companyName": "string",
      "phone": "string",
      "name": "string",
      "email": "string",
      "howDidKnow": "string"
    }
  */
  static briefAdd( data ) {
    const key = 'briefAdd'
    const body = JSON.stringify( data )
    const options = {
      headers: {
        Accept: 'application/json'
      }
    }

    return APIService.postable( key, body, options )
  }
}
