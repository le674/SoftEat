import { Injectable } from '@angular/core';
import * as Tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class FactureImgService {

  constructor(){
  }

  async parseFacturesImg(url_img:string){
    const Worker = await Tesseract.createWorker()
    await Worker.loadLanguage('fra');
    await Worker.initialize();
    const ouputs: Tesseract.OutputFormats = {
      text: false,
      blocks: true,
      hocr: false,
      tsv: false,
      box: false,
      unlv: false,
      osd: false,
      pdf: false,
      imageColor: false,
      imageGrey: false,
      imageBinary: false,
      debug: true
    };
    const { data: { blocks } } = await Worker.recognize(url_img, undefined,ouputs)
    console.log(blocks);
    
  }

}
