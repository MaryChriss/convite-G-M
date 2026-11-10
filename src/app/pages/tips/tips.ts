import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { BlocksTips } from '../../components/blocks-tips/blocks-tips';

@Component({
  selector: 'app-tips',
  imports: [Header, BlocksTips, RouterLink],
  templateUrl: './tips.html',
  styleUrl: './tips.css',
})
export class Tips {}
