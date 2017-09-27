import { Component } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: "views/pages/home.html",
})
export class HomeComponent  { 
    constructor()
    {
        console.log("Home page !");
    }
}
