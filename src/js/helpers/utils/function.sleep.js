export default async function sleep( timeMS ) {
  await new Promise( ( resolve, reject ) => {
    setTimeout( () => {
      resolve()
    }, getRandomInt( 1000, 3500 ) )
  } )
}
