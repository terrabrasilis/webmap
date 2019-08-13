import { Directive, ViewContainerRef } from '@angular/core';

/**
 * http://blog.bogdancarpean.com/angular-how-to-dynamically-inject-a-component-to-dom/
 * 
 * https://malcoded.com/posts/angular-dynamic-components
 */
@Directive({
  selector: '[appToolInjectDirective]'
})
export class ToolInjectDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
