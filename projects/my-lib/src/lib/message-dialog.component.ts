import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-app-message-dialog',
  template: `
    <div mat-dialog-content>
      {{message}}
    </div>
  `,
  styles: []
})
export class MessageDialogComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit() {
  }

}
