import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import * as xml2js from 'xml2js';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage implements OnInit {
  LieferadressePage: any = 'LieferadressePage';
  RegisterPage: any = 'RegisterPage';
  MengePage: any = 'MengePage';
  BigpcPage: any = 'BigpcPage';


  constructor(private loadingCtrl: LoadingController,
    private dataProvide: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions,
    public modalCtrl: ModalController) {
  }
  heatoil: boolean = true;
  pellets: boolean = false;
  lieferadresse = 'Lieferadresse';
  menge_data = "Menge in Liter";
  lieferadresse_original: any;
  preis_berechnen_button: boolean = false;
  callback: any;
  getallimgtags: any;
  loading: any;

  showLoader() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Bitte warte',
        spinner: 'dots',
        duration:20000
      });
      this.loading.present();
    }
  }

  otherway(page) {
    if (page == 'lieferadresse') {
      let options: NativeTransitionOptions = {
        direction: 'left',
        duration: 600,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 100,
        androiddelay: 150,
      };
      this.nativePageTransitions.flip(options);
      let profileModal = this.modalCtrl.create(this.LieferadressePage, { product_H: this.heatoil, product_P: this.pellets, lieferadresse: this.lieferadresse_original, menge: this.menge_data })
      profileModal.onDidDismiss(data => {
        if (data) {
          this.lieferadresse = data.lieferadresse.country_code + ' ' + data.lieferadresse.place_name + ' ' + data.lieferadresse.suburb;
          this.lieferadresse_original = data.lieferadresse;
          if (this.lieferadresse != 'Lieferadresse' && this.menge_data != "Menge in Liter" && this.menge_data != 'Menge in Kg') {
            this.preis_berechnen_button = true;
          }
        }
      });
      profileModal.present();
    } else {
      let options: NativeTransitionOptions = {
        direction: 'left',
        duration: 600,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 100,
        androiddelay: 150,
      };
      this.nativePageTransitions.flip(options);
      let profileModal = this.modalCtrl.create(this.MengePage, { product_H: this.heatoil, product_P: this.pellets, lieferadresse: this.lieferadresse_original, menge: this.menge_data })
      profileModal.onDidDismiss(data => {
        if (data) {
          this.menge_data = data.menge;
          if (this.lieferadresse != 'Lieferadresse' && this.menge_data != "Menge in Liter" && this.menge_data != 'Menge in Kg') {
            this.preis_berechnen_button = true;
          }
        }
      });
      profileModal.present();

    }
  }


  preiscalc() {
    if (this.lieferadresse_original && this.menge_data && this.lieferadresse_original != 'Lieferadresse' && this.menge_data != 'Menge in Kg' && this.menge_data != 'Menge in Liter') {
      let data = {
        lieferadresse: this.lieferadresse_original,
        menge: this.menge_data,
        heatoil: this.heatoil,
        pellets: this.pellets
      }
      let options: NativeTransitionOptions = {
        direction: 'left',
        duration: 600,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 100,
        androiddelay: 150,
      };
      this.nativePageTransitions.flip(options);
      this.navCtrl.push(this.BigpcPage, data);
    }
  }

  ngOnInit() {

  }

  xmltojson: any;
  description: any;

  ionViewDidLoad() {
    this.getxmldata();
  }

  // when you transition from page this adds flip effect during page transition
  registernav() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 600,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
    };
    this.nativePageTransitions.flip(options);
    this.navCtrl.push('RegisterPage')
  }

  // get xmldata from provider then parse as sting to convert it to json
  getxmldata() {
    this.showLoader();
    this.dataProvide.getxmldata().subscribe(res => {
      this.xmldata(res).then(xml2json => {
        this.loading.dismiss();
        this.xmltojson = xml2json.rss.channel.item;
        if (this.xmldata.length != 0) {
          this.getallimgtags = [];
          for (var i = 0; i < this.xmltojson.length; i++) {
            var domParser = new DOMParser();
            var docElement = domParser.parseFromString(this.xmltojson[i].description, "text/html");
            var imgs = docElement.getElementsByTagName("img")[0].src
            this.getallimgtags.push(imgs);
          }
        }
      })
    }, (err) => {
      console.log(err)
    })
  }

  // parsing xmlstring to convert it to json
  xmldata(xmlText): Promise<any> {
    var parser = new xml2js.Parser({ explicitArray: false });
    return new Promise(function (resolve, reject) {
      parser.parseString(xmlText, function (err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err);
        }
      })
    })
  }

  // opening news article when user tap on every item
  opennews(data) {
    console.log(data)
    this.navCtrl.push("ViewnewsPage", { message: data });
  }

}
