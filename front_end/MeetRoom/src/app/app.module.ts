import { NgModule }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { HomeComponent } from './pages/home/home'
import { RoomsListComponent } from './pages/rooms/rooms-list'
import { ReservationsListComponent } from './pages/reservations/reservations-lists'
import { HeaderComponent } from './layout/header'
import { FooterComponent } from './layout/footer'
import { ROUTES } from './app.routes'
import { MeetRoomProvider } from './providers/meetRoom'

import { filterSearch } from './pages/rooms/filterSearch';

@NgModule({
  imports:      [ BrowserModule, RouterModule.forRoot(ROUTES), HttpModule, FormsModule],
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RoomsListComponent,
    ReservationsListComponent,
    filterSearch],
  bootstrap:    [ AppComponent ],
  entryComponents: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    RoomsListComponent,
    ReservationsListComponent
  ],
  providers: [MeetRoomProvider]
})
export class AppModule { }
