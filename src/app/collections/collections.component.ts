import { Component, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { resolve } from 'path';
import { ActivatedRoute } from '@angular/router';
const { api_key } = require('../../config.json');

const axios = require('axios')

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  fvc = ''
  loading = false
  expandMints = false
  mints = []
  moreMintsLoading = false
  mintContinuation = null
  downloadJsonMintsHref = null;
  expandEv = false;
  events = []
  moreSalesLoading = false
  salesContinuation = null
  listing = []
  expandListing = false
  moreListingLoading = false
  listingContinuation = null
  fp = ''
  collectionName = ''
  listingCount = null

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => 
      {
        this.fvc = this.route.snapshot.params['fvc']
        if(this.fvc)
        {
          this.search()
        }
      })
  }

  async search(){
    this.mints = []
    this.events = []
    this.listing = []

    this.loading = true;
    await this.getMintList(this.mintContinuation)
    this.generateDownloadJsonUri()
    
    this.getCollEvents(this.salesContinuation)

    this.getActiveListings(this.listingContinuation)

    this.getFpAndListingCount()

    this.loading = false;
  }

  getMintList = async (continuation) => {
    const url = `https://api.helius.xyz/v1/mintlist?api-key=`+api_key

    const options = {}

    if(continuation != null)
      options['paginationToken'] = continuation

      const { data } = await axios.post(url, {
          "query": {           
              "firstVerifiedCreators": [this.fvc]
          },
          "options": options
      });

      this.collectionName = data.result[0].name.split(' #')[0]

      data.result.forEach(x => {
        
        this.mints.push(x)
      })

      if(data.paginationToken)
        this.mintContinuation = data.paginationToken
      else
        this.mintContinuation = null

  };

  mintClicked() {
    this.expandMints = !this.expandMints
  }

  async moreMintsClicked(){
    this.moreMintsLoading = true
    await this.getMintList(this.mintContinuation)
    this.moreMintsLoading = false
    this.generateDownloadJsonUri()
  }

  generateDownloadJsonUri() {
      var theJSON = JSON.stringify(this.mints);
      var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
      this.downloadJsonMintsHref = uri;
  }

  evClicked(){
    this.expandEv = !this.expandEv
  }

  getCollEvents(continuation){
    return new Promise(async (resolve, reject) => {
      const options = {}

      if(continuation != null)
        options['paginationToken'] = continuation

      const url = "https://api.helius.xyz/v1/nft-events?api-key="+api_key
      const { data } = await axios.post(url, {
          query: {
            types: ["NFT_SALE"],
            nftCollectionFilters: {
              "firstVerifiedCreator": [this.fvc]
            }
          },
          options: options
      });


      if(data.paginationToken)
        this.salesContinuation = data.paginationToken
      else
        this.salesContinuation = null

      const boo = new Promise((resolve, reject) => {
        data.result.forEach((x, i, array) => {
          x.amount = x.amount / LAMPORTS_PER_SOL
          this.events.push(x)
          if(i == array.length -1) resolve(true)
        })
      })

      boo.then(() => {
        //this.events =  data.result
        //this.eventsPagination = data.paginationToken
      })
      
      resolve(data)
    })
  }

  async moreSalesClicked(){
    this.moreSalesLoading = true
    await this.getCollEvents(this.salesContinuation)
    this.moreSalesLoading = false
  }

  getActiveListings = async (continuation) => {
    const url = `https://api.helius.xyz/v1/active-listings?api-key=`+api_key
    const options = {}

    if(continuation != null)
      options['paginationToken'] = continuation

      const { data } = await axios.post(url, {
          "query": {
              // ABC collection
              "firstVerifiedCreators": [this.fvc]
          },
          options: options
      });

      if(data.paginationToken)
        this.listingContinuation = data.paginationToken
      else
        this.listingContinuation = null

      data.result.forEach(x => {
        x.activeListings[0].amount = x.activeListings[0].amount / LAMPORTS_PER_SOL
        this.listing.push(x)
      })

  };

  listingClicked() {
    this.expandListing = !this.expandListing
  }

  async moreListingClicked() {
    this.moreListingLoading = true
    await this.getActiveListings(this.listingContinuation)
    this.moreListingLoading = false
  }

  async getFpAndListingCount(){
    const url = `https://api.helius.xyz/v1/active-listings?api-key=`+api_key

    var firstTime = true;
    var continuation = null
    var options = {}
    var prices = []

    const zz = new Promise(async (resolve, reject) => {

      while(firstTime || continuation != null){
        firstTime = false

        if(continuation != null)
          options['paginationToken'] = continuation
  
        const { data } = await axios.post(url, {
            "query": {
                "firstVerifiedCreators": [this.fvc]
            },
            options: options
        });
  
        if(data.paginationToken)
          continuation= data.paginationToken
        else
          continuation = null
  
        data.result.forEach(x => {
          x.activeListings[0].amount = x.activeListings[0].amount / LAMPORTS_PER_SOL
          prices.push(x.activeListings[0].amount)
        })
      }

      resolve(true)
    })
    
    zz.then(() => {

      prices.sort(function (a, b) {
          return a - b;
      });

      this.fp = prices[0]
      this.listingCount = prices.length
    })
  }
}
