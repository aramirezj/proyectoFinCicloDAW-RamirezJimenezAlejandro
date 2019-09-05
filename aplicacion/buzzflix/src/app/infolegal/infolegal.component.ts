import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-infolegal',
  templateUrl: './infolegal.component.html',
  styleUrls: ['./infolegal.component.scss']
})
export class InfolegalComponent implements OnInit {
  opcion: number
  constructor(
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.opcion = params['opcion'];
    });
  }

}
