import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  MarkerOptions,
  Marker, LatLng, CameraPosition, ILatLng
} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation';
import {ToastProvider} from '../../../../providers/utility/toast/toast';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  map: GoogleMap;
  @ViewChild('map') mapElement: ElementRef;
  private selfmarker: Marker;

  constructor(private toastProvider: ToastProvider, private geoLocation: Geolocation, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 1.347679,
          lng: 103.681268
        },
        zoom: 12,
        tilt: 30
      }
    };
    let markerIcon = {
      'url': 'https://firebasestorage.googleapis.com/v0/b/fyp03-136e5.appspot.com/o/Doge.png?alt=media&token=e0ff153d-f580-414c-b45c-9e07307705c7',
      'size': {
        width: 35,
        height: 30,
      }
    }

    this.map = GoogleMaps.create(this.mapElement.nativeElement, mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        this.geoLocation.getCurrentPosition().then((resp) => {
          if (resp.coords != undefined && resp.coords != null) {
            let cameraPos: CameraPosition<ILatLng> = {
              target: new LatLng(resp.coords.latitude, resp.coords.longitude),
              zoom: 18,
            }
            this.map.moveCamera(cameraPos);
          }
          else {
            this.toastProvider.showToast("You need to enable location manually :)");
          }
        });

        const subscription = this.geoLocation.watchPosition()
          .subscribe(position => {
            if (position.coords != undefined && position.coords != null) {
              let userPosition: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
              if (this.selfmarker != null) {
                this.selfmarker.setPosition(userPosition);
                this.map.addMarker(this.selfmarker);
              } else {
                let markerOptions: MarkerOptions = {
                  position: userPosition,
                  icon: markerIcon,
                  animation: 'DROP'
                };
                this.map.addMarker(markerOptions).then((marker) => {
                  this.selfmarker = marker;
                });
              }
            }
          });
      }
    );
  }

}
