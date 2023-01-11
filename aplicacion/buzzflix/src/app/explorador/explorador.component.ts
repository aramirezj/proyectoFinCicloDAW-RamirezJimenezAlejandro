import { Component, OnInit, Injectable } from '@angular/core';
import { Quiz } from '../modelo/Quiz';
import { QuizService } from '../services/quiz.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-explorador',
  templateUrl: './explorador.component.html',
  styleUrls: ['./explorador.component.scss']
})
export class ExploradorComponent implements OnInit {
  opcion: string
  quizzs: Array<Quiz>
  isLoaded: boolean = false;
  inicio: number = 0;
  fin: number = 3;
  quizporPagina: number = 10;
  totalQuizzes: number = 0;
  pageEvent: PageEvent;
  subsRouter: Subscription;
  encabezado: string;
  constructor(
    private QuizService: QuizService,
    private router: ActivatedRoute
  ) {

  }
  ngOnInit() {
    this.subsRouter = this.router.params.subscribe((params) => {
      this.opcion = params['opcion'];
      this.getQuizzes();
    })
  }
  ngOnDestroy() {
    this.subsRouter.unsubscribe();
  }

  getQuizzes() {
    this.opcion = (this.opcion == null || this.opcion == "todos") ? "todos" : this.opcion;
    this.encabezado = this.opcion == "todos" ? "Quizzes de la web" : "Quizzes de los seguidos";
    this.QuizService.ObtenerQuizzes(this.opcion, this.inicio + "-" + this.quizporPagina)
      .subscribe(resp => {
        this.totalQuizzes = resp["total"];
        this.quizzs = resp["cont"].length > 0 ? resp["cont"] : null;
        this.isLoaded = true
      })
  }

  muevoPagina() {
    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex) {
      this.inicio += this.quizporPagina;
      this.fin += this.quizporPagina;
    } else {
      this.inicio -= this.quizporPagina;
      this.fin -= this.quizporPagina;
    }
    this.getQuizzes();
  }

}
@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel = '';
  nextPageLabel = 'Siguiente';
  previousPageLabel = 'Volver';

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };

}
