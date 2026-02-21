import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: any = {};

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDashboard().subscribe((res) => (this.data = res));
  }
}
