import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MainComponent],
  entryComponents: [MainComponent]
})
export class AdminModule { }
