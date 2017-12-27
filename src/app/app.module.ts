import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CanvasMainComponent } from './canvas-main/canvas-main.component';
import { CanvasNodeComponent } from './canvas-node/canvas-node.component';


@NgModule({
  declarations: [
    AppComponent,
    CanvasMainComponent,
    CanvasNodeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
