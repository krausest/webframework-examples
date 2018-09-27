import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile.component';
import { ComplexComponent } from './complex.component';
import { ListComponent } from './list.component';

import { ListListComponent } from './list/list.component';
import { ListEditComponent } from './list/edit.component';
import { ListDetailComponent } from './list/detail.component';

import * as Validators from './validators';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    ComplexComponent,
    ListComponent,
    ListListComponent,
    ListEditComponent,
    ListDetailComponent,

    Validators.MyMaxLengthValidatorDirective,
    Validators.IsNumericValidatorDirective,
    Validators.MinLessThanMaxValidatorDirective,
    Validators.MyMaxValidatorDirective,
    Validators.MyMinValidatorDirective,
    Validators.CheckPasswordValidatorDirective,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
