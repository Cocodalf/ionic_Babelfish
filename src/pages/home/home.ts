import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { NavController } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';

import { HttpClient } from '@angular/common/http';

import languages from '../../data/languages';
import { identifierModuleUrl } from '@angular/compiler';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  public matches: string[] = ["Bonjour"];
  public languages = languages;
  public translatorForm ;
  public from;
  public to;
  public sentenceTrad = "Hello";



  constructor(
    public navCtrl: NavController,
    private speechRecognition : SpeechRecognition, 
    private textToSpeech : TextToSpeech, 
    private formBuilder : FormBuilder,
    private http : HttpClient,
  ) 
  {
    
    this.from = 'fr';
    this.to = 'en';

    this.buildForm();
  }
  ngOnInit(){
    this.checkPermission();
  }

//Fonctions pour speechRecognition 
// *******************************


  startListening(): void{
    this.speechRecognition.startListening()
      .subscribe(
        (matches:string[])=>{
          this.matches = matches;
          console.log("Matches => " , matches)
        },(err:any)=>{
          console.error(err);
        })
  }

  checkFeatureAvailable():void{
    this.speechRecognition.isRecognitionAvailable()
      .then((available:boolean)=>console.log(available))
  }

  getLanguagesList():void{
    this.speechRecognition.getSupportedLanguages()
      .then(
        (languages: Array<string>) => console.log(languages),
        (error) => console.log(error)
      )
  }

  checkPermission():void{
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      if (!hasPermission){
        this.getPermission();
      }
      else{
        console.log("Permission Granted");
      }


    })
  }

  getPermission():void{
    this.speechRecognition.requestPermission()
    .then(
      () => console.log('Granted'),
      () => console.log('Denied'),
    )
  }

// *******************************

//Fonctions pour textToSpeech 
// *******************************

  readTranslation(sentence:string):void {
    this.textToSpeech.speak(sentence)
    .then(() => console.log('Success'))
    .catch((reason:any) => console.log(reason));
  }

// Fonctions pour translate la sentence utilisateur
// *******************************
translateSentence():void{
  const post = {
    sentence: this.matches[0],
    from: this.from,
    to: this.to
  };

  this.http.post('localhost:3000', post).subscribe(data => {
    this.sentenceTrad = data['results'];
  });
}

buildForm(): void {

  this.translatorForm = this.formBuilder.group({
    from: new FormControl(this.from, []),
    to : new FormControl(this.to, [])
  });
}

onSubmit(): void {
  console.log(this.translatorForm.from.value);
  console.log(this.from);
  console.log(this.translatorForm.to.value);
  console.log(this.to);
}

}
