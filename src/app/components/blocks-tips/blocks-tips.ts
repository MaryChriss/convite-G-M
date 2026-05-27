import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-blocks-tips',
  imports: [],
  templateUrl: './blocks-tips.html',
  styleUrl: './blocks-tips.css',
})
export class BlocksTips {
  @Input() title: string = '';
}
