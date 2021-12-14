import(
  '@scss/general/_predefined.scss' )

import(
  /* webpackMode: "lazy" */
  '@plugins' )

import(
  '@service' )

import(
  /* webpackMode: "lazy" */
  '@js/events'
)

import( '@js/modules' )

let loadingAttributePolyfill;

( async function() {
  loadingAttributePolyfill = ( await import(
    'loading-attribute-polyfill/dist/loading-attribute-polyfill.module.js' ) ).default
} )()
