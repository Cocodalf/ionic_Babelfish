import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { HomePage } from '../pages/home/home';


class NetworkObserver {
  public isConnected:boolean = false;
  private connectionSubscription:any;
  private disconnectSubscription:any;
  private network:Network;
  constructor(network:Network) {
    this.network = network;
  }

  initNetworkObserver():void {
    this.connectionSubscription = this.network.onConnect().subscribe(() => {
      this.isConnected = true;
    });

    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.isConnected = false;
    });
  }

  stopNetworkObserver():void {
    this.connectionSubscription.unsubscribe();
    this.disconnectSubscription.unsubscribe();
  }

}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  isConnected:boolean = false;
  networkObserver: NetworkObserver;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, network: Network) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.networkObserver = new NetworkObserver(network);
      setTimeout(() => {
        if(this.networkObserver.isConnected){
          statusBar.styleDefault();
          splashScreen.hide();
        } else {
          console.log("connection error");
        }
      },2000)
    });
  }


}

