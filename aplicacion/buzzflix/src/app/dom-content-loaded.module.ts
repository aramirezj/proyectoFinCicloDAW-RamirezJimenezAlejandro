


import { NgModule, APP_INITIALIZER } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export function domContentLoadedFactory(doc: Document) {
  return () => new Promise ((resolve, _reject) => {
    const contentLoaded = () => {
      doc.removeEventListener('DOMContentLoaded', contentLoaded);
      resolve();
    };
    if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
      resolve();
    } else {
      doc.addEventListener('DOMContentLoaded', contentLoaded);
    }
  });
}


@NgModule({
  providers: [
    {provide: APP_INITIALIZER, multi: true, useFactory: domContentLoadedFactory, deps: [DOCUMENT]},
  ]
})
export class StateTransferInitializerModule {

}
