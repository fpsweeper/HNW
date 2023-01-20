import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'angular-dark-mode';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
    pageStyle = {
        "desc":"shape shape-style-1 shape-dark"
    }
    
    onToggle(){
        this.darkModeService.toggle();
    }

    model = {
        left: true,
        middle: false,
        right: false
    };

    focus;
    focus1;
    constructor(private darkModeService: DarkModeService) { }

    ngOnInit() {

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                
              const square = entry.target.querySelectorAll('.hr');
          
              square.forEach( x => {
                if (entry.isIntersecting) {
                    x.classList.add('hr-animation');
                    return; // if we added the class, exit the function
                  }
              
                  // We're not intersecting, so remove the class!
                  x.classList.remove('hr-animation');
              })
              
            });
          });
          
        observer.observe(document.querySelector('.hr-wrapper'));
          
        /*const observer1 = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                
              const square = entry.target.querySelectorAll('.hr1');
          
              square.forEach( x => {
                if (entry.isIntersecting) {
                    x.classList.add('hr-animation');
                    return; // if we added the class, exit the function
                  }
              
                  // We're not intersecting, so remove the class!
                  x.classList.remove('hr-animation');
              })
              
            });
          });
          
        observer1.observe(document.querySelector('.hr-wrapper1')); */

        const observer2 = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                
              const square = entry.target.querySelectorAll('.hr2');
          
              square.forEach( x => {
                if (entry.isIntersecting) {
                    x.classList.add('hr-animation');
                    return; // if we added the class, exit the function
                  }
              
                  // We're not intersecting, so remove the class!
                  x.classList.remove('hr-animation');
              })
              
            });
          });
          
        observer2.observe(document.querySelector('.hr-wrapper2'));

        this.darkMode$.subscribe(val => {
            if(!val)
                this.pageStyle.desc = "shape shape-style-1 shape-primary"
            else
                this.pageStyle.desc = "shape shape-style-1 shape-dark"
        })
    }
}
