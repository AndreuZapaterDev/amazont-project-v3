import { Component, Injectable, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
@Injectable({
  providedIn: 'root',
})
export class AlertComponent {
  isVisible: boolean = false;
  visible = input<boolean>();

  ngOnInit() {
    if (this.visible()) {
      this.isVisible = true;
    }
  }
  // hideAlert() {
  //   this.visible.set(false);
  // }
}
