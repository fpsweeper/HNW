import { Component, ViewChild } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { resolve } from 'path';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js';
const { api_key } = require('../../config.json');

const axios = require('axios')

@Component({
  selector: 'app-marketplaces',
  templateUrl: './marketplaces.component.html',
  styleUrls: ['./marketplaces.component.scss']
})
export class MarketplacesComponent {

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  salesLoading = false
  sales = []
  listingLoading = false
  listing = []
  marketplace = ''
  marketplaceTitle = ''


  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { color: 'white', beginAtZero: true }
      },
      x: {
        ticks: { color: 'white', beginAtZero: true }
      }
    },
    plugins: {
      title: {
          display: true,
          text: 'Top 10 collections sales',
          color: 'white',
          font: {
            size: 20
          }
      }
    }
  }

  barChartOptions1 = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { color: 'white', beginAtZero: true }
      },
      x: {
        ticks: { color: 'white', beginAtZero: true }
      }
    },
    plugins: {
      title: {
          display: true,
          text: 'Top 10 collections listing',
          color: 'white',
          font: {
            size: 20
          }
      }
    }
  }

  labels = ['11', '22', '33', '44', '55', '66'];
  barChartData = {
    labels: this.labels,
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(52, 235, 64, 0.2)'
      ],
      borderColor: [
        'rgb(52, 235, 64)'
      ],
      borderWidth: 1
    }]
  };

  labelsListing = ['11', '22', '33', '44', '55', '66'];
  barChartDataListing = {
    labels: this.labelsListing,
    datasets: [{
      label: 'Listing',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(235, 52, 52, 0.2)'
      ],
      borderColor: [
        'rgb(235, 52, 52)'
      ],
      borderWidth: 1,
    }]
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.params.subscribe( params => 
      {
        this.marketplace = this.route.snapshot.params['marketplace']

        if(this.marketplace.includes('_'))
        {
          this.marketplaceTitle = this.marketplace.replace('_', ' ')
          this.marketplace.replace(' ', '_')
        }else{
          this.marketplaceTitle = this.marketplace
        }
          
        this.getSales()
    
        this.getListing()

        setInterval(this.getSales.bind(this), 0.5 * 60 * 1000);

        setInterval(this.getListing.bind(this), 0.5 * 60 * 1000);
      }
    );
  }

  getSales = async () => {
    this.salesLoading = true
    var fruits = {}

      const url = `https://api.helius.xyz/v1/nft-events?api-key=`+api_key
      const { data } = await axios.post(url, {
            query: {
                sources: [this.marketplace],
                types: ["NFT_SALE"]
            }
      });

      const boo = new Promise((resolve, rejects) => {
        this.sales = []
        if(data.result.length === 0) resolve(true)
        data.result.forEach((x, i, array) => {
          if(x.nfts[0].name != ''){
            var date = new Date(x.timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            
            x.timestamp = formattedTime
            x.amount = x.amount / LAMPORTS_PER_SOL
            
            if(fruits[x.nfts[0].name.split(" #")[0]])
              fruits[x.nfts[0].name.split(" #")[0]] ++
            else
              fruits[x.nfts[0].name.split(" #")[0]] = 1
            this.sales.push(x)
          }
          if(i == array.length-1) resolve(true)
        })
      }) 

      this.barChartData.datasets[0].data.length = 0
      this.barChartData.labels.length = 0
      this.labels.length = 0

      await boo.then(() => {
        this.salesLoading = false
        var finalFruits = []

        const ss = new Promise((resolve, reject) => {
          if(Object.keys(fruits).length == 0) resolve(true)
          Object.keys(fruits).forEach((x, i, array) => {
            finalFruits.push({
              coll: x,
              sales: fruits[x]
            })
            if(i == array.length -1) resolve(true)
          })
        }) 

        ss.then(() => {
          finalFruits.sort(function (a, b) {
              return b.sales - a.sales;
          });

          const ss2 = new Promise((resolve, reject) => {
            if(finalFruits.length == 0) resolve(true)

            for(var i=0; i<=9; i++){
              this.labels.push(finalFruits[i].coll)
              this.barChartData.datasets[0].data.push(finalFruits[i].sales)
            }

            resolve(true)
          })

          ss2.then(() => {
            this.barChartData.labels = this.labels
            this.chart.chart.update();
            console.log(finalFruits)
          })
          
        })
        
      })
    
  };

  getListing = async () => {
    this.listingLoading = true
    var fruits = {}

      const url = `https://api.helius.xyz/v1/nft-events?api-key=`+api_key
      const { data } = await axios.post(url, {
            query: {
                sources: [this.marketplace],
                types: ["NFT_LISTING"]
            }
      });

      console.log(data)
      const boo = new Promise((resolve, rejects) => {
        this.listing = []
        if(data.result.length === 0) resolve(true)
        data.result.forEach((x, i, array) => {
          if(x.nfts[0].name != ''){
            var date = new Date(x.timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            
            x.timestamp = formattedTime
            x.amount = x.amount / LAMPORTS_PER_SOL
            
            if(fruits[x.nfts[0].name.split(" #")[0]])
              fruits[x.nfts[0].name.split(" #")[0]] ++
            else
              fruits[x.nfts[0].name.split(" #")[0]] = 1
            this.listing.push(x)
          }
          if(i == array.length-1) resolve(true)
        })
      }) 

      this.barChartDataListing.datasets[0].data.length = 0
      this.barChartDataListing.labels.length = 0
      this.labelsListing.length = 0

      await boo.then(() => {
        this.listingLoading = false
        var finalFruits = []

        const ss = new Promise((resolve, reject) => {
          if(Object.keys(fruits).length == 0) resolve(true)
          Object.keys(fruits).forEach((x, i, array) => {
            finalFruits.push({
              coll: x,
              sales: fruits[x]
            })
            if(i == array.length -1) resolve(true)
          })
        }) 

        ss.then(() => {
          finalFruits.sort(function (a, b) {
              return b.sales - a.sales;
          });

          const ss2 = new Promise((resolve, reject) => {
            if(finalFruits.length == 0) resolve(true)

            for(var i=0; i<=9; i++){
              this.labelsListing.push(finalFruits[i].coll)
              this.barChartDataListing.datasets[0].data.push(finalFruits[i].sales)
            }

            resolve(true)
          })

          ss2.then(() => {
            this.barChartDataListing.labels = this.labelsListing
            this.chart.chart.update();
            //console.log(finalFruits)
          })
          
        })
        
      })
    
  };

}
