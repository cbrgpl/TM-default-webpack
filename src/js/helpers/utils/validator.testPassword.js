export default function testPassword( password ) {
  return /[A-Z]/.test( String( password ) ) & /[0-9]/.test( String( password ) ) & !/ /.test( String( password ) )
}
