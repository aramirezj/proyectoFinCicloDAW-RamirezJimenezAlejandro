import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-votar',
  templateUrl: './votar.component.html',
  styleUrls: ['./votar.component.scss']
})



export class VotarComponent implements OnInit {
  @Input() id: number
  @Input() rating: number;
  @Input() itemId: number;
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();

  inputName: string;

  constructor(
    private QuizService: QuizService,
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
    this.QuizService.votaQuizz(this.id, this.rating)
      .subscribe((resp) => {
      })

  }











}
