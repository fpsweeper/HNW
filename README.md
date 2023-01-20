# [HNW-Helius NFT Wiki](https://hnw-hackathon.web.app) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&logo=twitter)](https://twitter.com/FpSweeper/status/1616546789590716416?s=20&t=-G78TldYbVU5xJ3my7_gPw)



 ![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
 
**Description**

HNW is a Solana web3 platform developped in the Sandstorm Hackathon in January 2023, it is a platform using Helius.xyz API to get metadata, events, listing and sales and other informations about any solana NFT or collection, it has also a marketplace engine which help users to track latest sales/listing in the biggest marketplaces in solana, the app modules will be detailed in the below sections.

**NFT Engine**

<img src="https://github.com/fpsweeper/HNW/blob/main/src/assets/docs/colls.png?raw=true"/>
It is a module where you can get any data related to any solana NFT by its mint address. Using this module you can get the bellow informations:
* Collection
* Floor-price (this info use an alpha endpoint, so it can show wrong data)
* Listing (this info use an alpha endpoint, so it can show wrong data)
* NFT image
* Listing price 
* NFT events
* Filter events by sources and types.


**Collections Engine**

<img src="https://github.com/fpsweeper/HNW/blob/main/src/assets/docs/colls.png?raw=true"/>
Using this module you can get the bellow infos about any collection in solana:
* Floor-price (this info use an alpha endpoint, so it can show wrong data)
* Listing (this info use an alpha endpoint, so it can show wrong data)
* The mint list
* Download mint list (JSON file)
* Latest sales
* Active listing


**Marketplaces Engine**

<img src="https://github.com/fpsweeper/HNW/blob/main/src/assets/docs/marketplaces.png?raw=true"/>
The marketplace engine show realtime sales and listing in the biggest solana marketplaces, using this module you can benefit from the following:
* Get latest sales/listing in the biggest marketplaces
* Get top 10 collections in listing/sales
* Get metadata of any NFT listed/sold
* Get the listing/sold price of the latest events in those marketplaces
