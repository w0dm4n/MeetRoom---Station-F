import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RoomsListComponent } from './pages/rooms/rooms-list';
import { ReservationsListComponent } from './pages/reservations/reservations-lists'

export const ROUTES: Routes = [
    { path: '',  component: HomeComponent },
    { path: 'home',  component: HomeComponent },
    { path: 'rooms-lists',  component: RoomsListComponent },
    { path: 'reservations-lists', component: ReservationsListComponent}
];