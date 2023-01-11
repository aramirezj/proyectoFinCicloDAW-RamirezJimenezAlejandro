import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import { AppBrowserModule } from './app.browser.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    FlexLayoutServerModule,
    AppBrowserModule,
    ServerModule,
    ServerTransferStateModule
],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
