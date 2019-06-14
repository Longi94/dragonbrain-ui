import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { VoronoiComponent } from './components/voronoi/voronoi.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfirmDialogComponent,
    HomeComponent,
    VoronoiComponent
  ],
  imports: [
    BrowserModule,
    AdminModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class AppModule {
}
