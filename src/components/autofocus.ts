import { Directive, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';


@Directive({
  selector: '[autofocus]' // Attribute selector
})
export class AutoFocus {

  constructor(private renderer: Renderer, private elementRef: ElementRef, public keyboard: Keyboard) {
  }

  ngAfterViewInit() {
    const element = this.elementRef.nativeElement.querySelector('input');
    // to delay 
    setTimeout(() => {
      this.renderer.invokeElementMethod(element, 'focus', []);
      this.keyboard.show();
    }, 500);
  }

}