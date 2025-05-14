import { Component, Injectable, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.visible()) {
      this.isVisible = true;
    }
  }

  hideAlert() {
    this.isVisible = false;
  }

  login() {
    this.isVisible = false;
    this.router.navigate(['/login']);
  }
}
