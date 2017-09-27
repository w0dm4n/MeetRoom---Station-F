import { Component, ViewChild, OnInit } from '@angular/core';
import { HeaderComponent } from './layout/header'
import { HomeComponent } from './pages/home/home'

@Component({
  selector: 'MeetRoom',
  templateUrl: "views/app.component.html",
})
export class AppComponent implements OnInit {
  name = 'MeetRoom';

  ngAfterViewInit() {
   
  }

  ngOnInit() {
    
  }
}
