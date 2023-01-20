import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { environment as env } from '../environments/environment';

import { SolWalletsModule } from 'angular-sol-wallets';
import { NftsComponent } from './nfts/nfts.component';
import { CollectionsComponent } from './collections/collections.component';

import { NgSelectModule } from "@ng-select/ng-select";
import { MarketplacesComponent } from './marketplaces/marketplaces.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    NftsComponent,
    CollectionsComponent,
    MarketplacesComponent
  ],
  imports: [
    SolWalletsModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    NgSelectModule,
    NgChartsModule
  ],
  /*providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: Window,
      useValue: window,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],*/
  bootstrap: [AppComponent]
})
export class AppModule { }
