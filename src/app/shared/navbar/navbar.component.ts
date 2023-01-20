import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { PublicKey } from '@solana/web3.js';

import { SolWalletsService, Wallet } from "angular-sol-wallets" ;
import { HttpClient } from '@angular/common/http';

import {PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import {  SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { Connection, SystemProgram, TransactionMessage, VersionedTransaction, LAMPORTS_PER_SOL
        , AddressLookupTableProgram, Transaction } from '@solana/web3.js';

import { SendTransactionOptions, WalletAdapter, WalletName } from '@solana/wallet-adapter-base';
import e from 'express';

const QUICKNODE_RPC = 'https://aged-purple-layer.solana-mainnet.discover.quiknode.pro/302af2b26a38d66b0645055d51fc02c9c7d906cc/';
const DEV_RPC = 'https://api.devnet.solana.com '
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const DEV_SOLANA_CONNECTION = new Connection(DEV_RPC);

declare global {
    interface Window {
        phantom:any;
        solflare:any;
        solana:any;
        SolflareApp:any
    }
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    _disconnected
    _accountChanged
    public isCollapsed = true;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    connected = false
    walletaddress = ''

    profile = {
        name: 'fpsweeper',
        walletaddress: '',
        realwalladd: '',
        img: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
    }

    constructor(public location: Location, private router: Router, 
        private solWalletS : SolWalletsService) {
            solWalletS.setCluster("mainnet-beta");
            const wallets = [
                new PhantomWalletAdapter(),
                new SolflareWalletAdapter(),
              ]
          
    }

    ngOnInit() {

        
      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
        if (event instanceof NavigationStart) {
           if (event.url != this.lastPoppedUrl)
               this.yScrollStack.push(window.scrollY);
       } else if (event instanceof NavigationEnd) {
           if (event.url == this.lastPoppedUrl) {
               this.lastPoppedUrl = undefined;
               window.scrollTo(0, this.yScrollStack.pop());
           } else
               window.scrollTo(0, 0);
       }
     });
     this.location.subscribe((ev:PopStateEvent) => {
         this.lastPoppedUrl = ev.url;
     });

    if(sessionStorage.getItem('walletaddress') != null)
    {
            if(sessionStorage.getItem('walletaddress') != '')
            {
                this.profile.walletaddress = sessionStorage.getItem('walletaddress')
                this.profile.realwalladd = this.profile.walletaddress.substring(0, 7) + ' ... ' + 
                                        this.profile.walletaddress.substring(this.profile.walletaddress.length - 3, this.profile.walletaddress.length )
                this.connected = true

                const boo = new Promise(async (resolve, reject) => {
                    const response = await fetch("https://market8.club:9090/checkUser/" + sessionStorage.getItem('walletaddress'), {
                    method: 'GET',
                    headers: {'Content-Type':'application/json'}
                    });

                    if(response.ok){
                        var res0 = await response.text();
                        const res = JSON.parse(res0.valueOf())
                        
                        if(res.dcuser != null)
                          this.profile.img = res.dcimage
                        else
                          if(res.twpic != null)
                            this.profile.img = res.twpic
                    }
                    resolve(true)
                })
                
                boo.then(() => {})
            }
    }

    }

    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '#/home' ) {
            return true;
        }
        else {
            return false;
        }
    }

    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '#/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    /*connect(){
        this.connected = true
    }*/

    async connect(){
        let provider: any
        provider = await this.getProvider(); // see "Detecting the Provider"
        try {
            
            const resp = await provider.connect();
            
            this.profile.walletaddress = provider.publicKey.toString()
            this.profile.realwalladd = provider.publicKey.toString().substring(0, 7) + ' ... ' + 
                provider.publicKey.toString().substring(provider.publicKey.toString().length - 3, provider.publicKey.toString().length )
            this.connected = true    
            
            // To Do -> Get all socials and wallets from database
            sessionStorage.setItem('walletaddress', this.profile.walletaddress)

            const response = await fetch("https://market8.club:9090/checkUser/" + this.profile.walletaddress, {
                method: 'GET',
                headers: {'Content-Type':'application/json'}
            });

            if (!response.ok)
            {
                console.error("Error");
            }
            else{
                var res0 = await response.text();
                if(res0 === '')
                {
                    console.log('Saving user !!')
                    this.addUser({
                        "wallet": this.profile.walletaddress
                    })
                }
                else{
                    const res = JSON.parse(res0.valueOf())
                    if(res.dcuser != null)
                        this.profile.img = res.dcimage
                    else
                        if(res.twpic != null)
                            this.profile.img = res.twpic
                }
            }

        } catch (err) {
            console.log(err)
            // { code: 4001, message: 'User rejected the request.' }
        }


        /*this.solWalletS.connect().then(async wallet => {
            console.log("Wallet connected successfully with this address 1:", wallet.publicKey.toJSON());
            this.walletaddress = wallet.publicKey.toJSON()
            this.profile.walletaddress = wallet.publicKey.toJSON()
            this.profile.realwalladd = wallet.publicKey.toJSON().substring(0, 7) + ' ... ' + 
                                       wallet.publicKey.toJSON().substring(wallet.publicKey.toJSON().length - 3, wallet.publicKey.toJSON().length )
            this.connected = true    
            
            // To Do -> Get all socials and wallets from database
            sessionStorage.setItem('walletaddress', this.profile.walletaddress)

            const response = await fetch("https://market8.club:9090/checkUser/" + this.profile.walletaddress, {
                method: 'GET',
                headers: {'Content-Type':'application/json'}
            });

            if (!response.ok)
            {
                console.error("Error");
            }
            else{
                var res0 = await response.text();
                if(res0 === '')
                {
                    console.log('Saving user !!')
                    this.addUser({
                        "wallet": this.profile.walletaddress
                    })
                }
                else{
                    const res = JSON.parse(res0.valueOf())
                    if(res.dcuser != null)
                        this.profile.img = res.dcimage
                    else
                        if(res.twpic != null)
                            this.profile.img = res.twpic
                }
            }
        }).catch(err => {
            console.log("Error connecting wallet", err );
        }) */
    }

    async disconnect(){

        let provider: any
        provider = this.getProvider(); 
        await provider.disconnect();
        this.connected = false
        this.walletaddress = ''
        sessionStorage.setItem('walletaddress', '')
    }

    async addUser(obj) {
        const response = await fetch("https://market8.club:9090/addUser", {
                method: 'POST',
                body: JSON.stringify(obj),
                // mode: "no-cors",
                headers: {'Content-Type':'application/json'}
        });
    }

    setClass(){
        if(this.isCollapsed)
            return ''
        else
            return 'collapsedmenu'
    }


    getProvider = () => {
        if ('phantom' in window || 'solana' in window) {
          var provider = window.phantom?.solana;
      
          if (provider?.isPhantom) {
            return provider;
          }

          else{
            provider = window.solana;
            if (provider?.isPhantom) {
                return provider;
            }
          }

        }else{
            if (window.solflare?.isSolflare || window.SolflareApp){
                if(window.solflare?.isSolflare){
                    return window.solflare
                }
            }
        }
      
        window.open('https://phantom.app/', '_blank');
    };

    sendSol = async () => {
        // create array of instructions
        const instructions = [
            SystemProgram.transfer({
            fromPubkey: new PublicKey(this.profile.walletaddress),
            toPubkey: new PublicKey('6WLx17ztTVnU7BFGc8wEvAuTYv2dNDgvBFFTfuA2fDQv'),
            lamports: LAMPORTS_PER_SOL * 0.003,
            }),
        ];
        const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash('finalized');
        // create v0 compatible message
        const messageV0 = new TransactionMessage({
            payerKey: new PublicKey(this.profile.walletaddress),
            recentBlockhash: latestBlockHash.blockhash,
            instructions,
        }).compileToV0Message();
        
        // make a versioned transaction
        const transactionV0 = new VersionedTransaction(messageV0);
        
        const provider = this.getProvider(); // see "Detecting the Provider"
        const signedTransaction = await provider.signTransaction(transactionV0, { maxRetries: 10 });
        const signature = await SOLANA_CONNECTION.sendRawTransaction(signedTransaction.serialize());

        /*const { signature } = await provider.signAndSendTransaction(transactionV0, { maxRetries: 10 });
        console.log(signature + ' ?????????????????????????')*/
        var ss = await SOLANA_CONNECTION.getSignatureStatus(signature);
        console.log(ss + ' TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt')
    }

    simulate = async () => {
        const provider = this.getProvider(); // see "Detecting the Provider"
        const transaction = new Transaction();
        const { signature } = await provider.signAndSendTransaction(transaction);
        await DEV_SOLANA_CONNECTION.getSignatureStatus(signature);
    }

}
