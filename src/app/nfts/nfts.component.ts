import { Component, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as helius_sources from '../../helius_sources.json';
import * as helius_types from '../../helius_types.json';
import { ActivatedRoute } from '@angular/router';
import { resolve } from 'path';
const { api_key } = require('../../config.json');

const axios = require('axios')

@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.scss']
})


export class NftsComponent implements OnInit {

  fvc = ''
  mintAddress = ''
  expandEv = false
  loading = false
  nft = null
  events = null
  eventsPagination = null
  expandAtt = false
  moreLoading = false
  searchLoading = false
  mints = []

  sources = []
  selectedSources = []

  types = []
  selectedTypes = []

  listing = []

  fp = null
  collectionName = null
  listingCount = null
  listingContinuation = null

  constructor(private route: ActivatedRoute) { 

    Object.keys(helius_sources).forEach((x, i, array) => {
      this.sources.push({
        id: i+1,
        name: x
      })
    })

    Object.keys(helius_types).forEach((x, i, array) => {
      this.types.push({
        id: i+1,
        name: x
      })
    })

  }

  ngOnInit(): void {
    
    this.route.params.subscribe( params => 
      {
        this.mintAddress = this.route.snapshot.params['mint']
        if(this.mintAddress)
        {
          this.search()
        }
      }
    );
  }

  async search(){

    this.loading = true;
    this.nft = null;
    this.getNftMetadata(this.mintAddress).then((data) => {
      this.loading = false
      this.nft = data[0]
      this.collectionName = this.nft.offChainData.name.split(' #')[0]
      //console.log(data[0].offChainData.attributes)
      //console.log(this.nft)
    })

    this.getNftEvents(this.mintAddress).then(data => {
      
      //console.log(JSON.stringify(data) + ' !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    })

    this.listing = await this.checkListing();

    this.getFpAndListingCount();

    if(this.listing.length != 0){
      this.listing[0].amount = this.listing[0].amount / LAMPORTS_PER_SOL
    }
    
  }

  getNftMetadata(mint){
    return new Promise(async (resolve, reject) => {
      const url = "https://api.helius.xyz/v0/tokens/metadata?api-key="+api_key
      const nftAddresses = [mint] 
      const { data } = await axios.post(url, { mintAccounts: nftAddresses})
      //console.log("metadata: ", data)
      resolve(data)
    })
  }
  //amount

  getNftEvents(mint){
    return new Promise(async (resolve, reject) => {
      const url = "https://api.helius.xyz/v1/nft-events?api-key="+api_key
      const { data } = await axios.post(url, {
          query: {
              accounts: [mint],
          }
      });

      const boo = new Promise((resolve, reject) => {
        data.result.forEach((x, i, array) => {
          x.amount = x.amount / LAMPORTS_PER_SOL
          if(i == array.length -1) resolve(true)
        })
      })

      boo.then(() => {
        this.events =  data.result
        this.eventsPagination = data.paginationToken
      })
      
      resolve(data)
    })
  }

  attClicked(){
    this.expandAtt = !this.expandAtt
  }

  evClicked(){
    this.expandEv = !this.expandEv
  }

  moreClicked(){
    return new Promise(async (resolve, reject) => {
      this.moreLoading = true
      
      const url = "https://api.helius.xyz/v1/nft-events?api-key="+api_key
      const { data } = await axios.post(url, {
          query: {
              accounts: [this.mintAddress],
          },
          options: {
            paginationToken: this.eventsPagination
          }
      });

      const boo = new Promise((resolve, reject) => {
        data.result.forEach((x, i, array) => {
          x.amount = x.amount / LAMPORTS_PER_SOL
          if(i == array.length -1) resolve(true)
        })
      })

      boo.then(() => {
        //this.events.push(data.result)
        data.result.forEach(x => {
          this.events.push(x)
        })
        console.log(this.events.length + ' ******************************')
        this.eventsPagination = data.paginationToken
        this.moreLoading = false
      })
      
      resolve(data)
    })
  }

  onSourceChange(ss){
  }

  async searchWithFilters(){

    this.searchLoading = true

    var stypes = []
    var ssources = []

    const boo = new Promise((resolve, reject) => {
      if(this.selectedTypes.length == 0) resolve(true)
      this.selectedTypes.forEach((x, i, array) => {
        stypes.push(x.name)
        if(i == array.length -1 ) resolve(true)
      })
    })

    const boo2 = new Promise((resolve, reject) => {
      if(this.selectedSources.length == 0) resolve(true)
      this.selectedSources.forEach((x, i, array) => {
        ssources.push(x.name)
        if(i == array.length -1 ) resolve(true)
      })
    })

    boo.then(async () => {
      boo2.then(async () => {
        var query1 = {accounts: [this.mintAddress], types: [], sources: []}
        console.log(stypes )
        console.log(ssources)
        if(stypes.length){
          if(ssources.length){
            query1 = {
                accounts: [this.mintAddress],
                types: stypes,
                sources: ssources
            }
          }
          else{
            query1 = {
              accounts: [this.mintAddress],
              types: stypes,
              sources: []
            }
          }
        }else{

          if(ssources.length){
            query1 = {
              accounts: [this.mintAddress],
              sources: ssources,
              types: []
            }
          }
        }
        
          const url = "https://api.helius.xyz/v1/nft-events?api-key="+api_key
          const { data } = await axios.post(url, {
              query: query1
          });
          
          const boo3 = new Promise((resolve, reject) => {
            if(data.result.length == 0) resolve(true)
            data.result.forEach((x, i, array) => {
              x.amount = x.amount / LAMPORTS_PER_SOL
              if(i == array.length -1) resolve(true)
            })
          })
    
          boo3.then(() => {
            this.events =  data.result
            this.eventsPagination = data.paginationToken

            this.searchLoading = false
            return(data)
          })
      })
    })
      
  }

  async checkListing(){

    const url = `https://api.helius.xyz/v1/nfts?api-key=`+api_key

    const { data } = await axios.post(url, {
          mints: [this.mintAddress]
    });

    this.fvc = data[0].firstVerifiedCreator
    console.log(this.fvc + ' ------------------------------------------')
    return data[0].activeListings;
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
  
        console.log(data)
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
