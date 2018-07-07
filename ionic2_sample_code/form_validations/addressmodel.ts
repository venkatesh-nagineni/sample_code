import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Address } from '../../interface/address';

@IonicPage()
@Component({
  selector: "page-addressmodel",
  templateUrl: "addressmodel.html"
})
export class AddressmodelPage {
  @ViewChild("mangeinput", { read: ElementRef })
  elm: ElementRef;

  lieferform: FormGroup;
  addresstitle: string;
  lieferstatus: boolean;
  hidesomefields: boolean = false;
  mangestatusvalid: boolean;
  remainingmange: number;
  mangestatus: boolean;
  noofliters: number;
  totalmenge: number;
  presentmangevalue: number;
  genderhide: boolean;

  constructor(
    public rendere: Renderer,
    public events: Events,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {
    let address = this.navParams.get("address");
    let number = this.navParams.get("number");
    let preinfo = this.navParams.get("preinfo");
    this.noofliters = this.navParams.get("liters");
    this.totalmenge = this.navParams.get("totalmenge");
    this.presentmangevalue = this.navParams.get("presentmangevalue");
    const numberRegex: RegExp = /^[\d ]*$/;

    if (number == 1) {
      this.addresstitle = "Lieferform";
      this.lieferstatus = true;
      this.genderhide = true;
      this.lieferform = <FormGroup>address;
      this.lieferform.controls["menge"].setValue(this.noofliters);
      this.lieferform.controls["PLZ"].setValue(preinfo.countrycode);
      this.lieferform.controls["Ort"].setValue(preinfo.placename);
      this.mangestatus = false;
    } else if (number == 2) {
      this.addresstitle = "Lieferform";
      this.lieferform = <FormGroup>address;
      this.lieferstatus = true;
      this.genderhide = true;
      this.lieferform.controls["menge"].enable();
      this.lieferform.controls["Ort"].setValue(preinfo.placename);
      this.lieferform.controls["PLZ"].setValue(preinfo.countrycode);
      this.remainingmange = Number(this.noofliters) - Number(this.totalmenge);
      this.mangestatus = true;
    } else {
      this.addresstitle = "Lieferform";
      this.lieferform = <FormGroup>address;
      this.mangestatusvalid = true;
      this.genderhide = false;
      this.hidesomefields = true;
      this.remainingmange = Number(this.noofliters) - Number(this.totalmenge);
      this.mangestatus = true;
    }
  }

  ngAfterViewInit() {
    if(this.mangestatus == true){
      if (Math.sign(this.remainingmange) == -1) {
        this.mangeinvaliderror();
      } else {
        this.mangevalid();
      }
    }
  }

  // setting error manually, when menge exceeds than no of liters
  mangeinvaliderror() {
    this.elm.nativeElement.style.borderBottom = "1px solid red";
    this.elm.nativeElement.style.backgroundImage = "url('../assets/imgs/invalid.png')";
    this.elm.nativeElement.style.backgroundRepeat = "no-repeat";
    this.elm.nativeElement.style.backgroundPosition = "100%";
    this.elm.nativeElement.style.backgroundSize = "25px";
  }

  // setting valid styling manually, when menge value enter correctly
  mangevalid() {
    let value = Number(this.lieferform.controls["menge"].value);
    if (value != 0) {
      this.elm.nativeElement.style.backgroundImage = "url('../assets/imgs/valid.png')";
      this.elm.nativeElement.style.backgroundRepeat = "no-repeat";
      this.elm.nativeElement.style.backgroundPosition = "100%";
      this.elm.nativeElement.style.backgroundSize = "25px";
      this.elm.nativeElement.style.borderBottom = "none";
    }
  }

  // form data in loop addresses
  liefersubmit(lieferformdata) {
    let formdata = lieferformdata.getRawValue();
    console.log(formdata)
    if (this.lieferform.invalid || this.lieferform.status == "INVALID") {
      this.validateAllFormFields(this.lieferform);
    } else {
      if (formdata.Telefon == "") {
        this.showPopup();
      } else {
        if (Math.sign(this.remainingmange) == -1) {
          this.mangeinvaliderror();
        } else {
          this.mangevalid();
          this.viewCtrl.dismiss(this.remainingmange);
          // send form data to back end
        }
      }
    }
  }

  // single form data and first form data in loop forms
  singleliefersubmit(lieferformdata) {
    let formdata = lieferformdata.getRawValue();
    console.log(formdata)
    if (this.lieferform.invalid || this.lieferform.status == "INVALID") {
      this.validateAllFormFields(this.lieferform);
    } else {
      if (formdata.Telefon == "") {
        this.showPopup();
      } else {
        this.viewCtrl.dismiss(this.remainingmange);
        // send form data to back end
      }
    }
  }

  // dismissing form when user click on ignore button
  dismiss() {
    this.viewCtrl.dismiss(this.remainingmange);
  }

  // validate form on submit button press
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  // remaing value calculate on each value enter by user
  mangevalueupdate(event) {
    let updatemange = Number(event.target.value);
    this.remainingmange = Number(this.noofliters) - Number(this.totalmenge);
    this.remainingmange = this.remainingmange + this.presentmangevalue - updatemange;

 // pushing remaining menge to the parent to use there again
    this.events.publish("remaingmange", this.remainingmange);

    // showing error sign if it exceeds than total no of liters
    if (Math.sign(this.remainingmange) == -1) {
      this.mangeinvaliderror();
    } else if (Number(this.lieferform.controls["menge"].value == 0)) {
      this.mangeinvaliderror();
    }
     else {
      this.mangevalid();
    }
  }

  // showing pop up if phone field is empty
  showPopup() {
    let alert = this.alertCtrl.create({
      title: "Warning",
      subTitle:
        "Telefonnumern machen die Lieferterminabsprache leichter. Bitte tragen Sie daher auch die Telefonnummern ein.",
      buttons: [
        {
          text: "Korrigieren",
          handler: data => {
            // handle after click on correct button
          }
        },
        {
          text: "Ignorieren",
          handler: data => {
            this.viewCtrl.dismiss();
            // handle if click on ignore button
          }
        }
      ]
    });
    alert.present();
  }

  // return color of remaining menge value
  mangestyle() {
    if (this.remainingmange != 0) {
      return { color: "red" };
    } else {
      return { color: "black" };
    }
  }
}
