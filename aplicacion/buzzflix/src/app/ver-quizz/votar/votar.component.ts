import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import React from 'react';
import { QuizzService } from 'src/app/services/quizz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-votar',
  templateUrl: './votar.component.html',
  styleUrls: ['./votar.component.scss']
})



export class VotarComponent implements OnInit {
  @Input() id:number
  @Input() rating: number;
  @Input() itemId: number;
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();

  inputName: string;

  constructor(
    private quizzService:QuizzService,
    private router: Router,
  ) {
    
  }

  ngOnInit() {
    this.inputName = this.itemId + '_rating';
  }
  onClick(rating: number): void {
    this.rating = rating;
    this.ratingClick.emit({
      itemId: this.itemId,
      rating: rating
    });
    this.quizzService.votaQuizz(this.id,this.rating)
    .subscribe((resp)=>{
      this.router.navigate(['ver/todos'])
    })

  }


  

  

  



  
}
