import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import {NftsComponent} from './nfts/nfts.component';
import {CollectionsComponent} from './collections/collections.component';
import { MarketplacesComponent } from './marketplaces/marketplaces.component';
const routes: Routes =[
    { path: 'home',             component: HomeComponent },
    { path: 'nfts',             component: NftsComponent },
    { path: 'nfts/:mint',             component: NftsComponent },
    { path: 'collections',             component: CollectionsComponent },
    { path: 'collections/:fvc',             component: CollectionsComponent },
    { path: 'marketplaces/:marketplace',             component: MarketplacesComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
