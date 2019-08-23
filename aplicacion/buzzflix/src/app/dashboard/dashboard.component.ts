import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { QuizzService } from '../services/quizz.service';
import { Quizz } from '../modelo/Quizz';
import { MatPaginatorIntl, PageEvent } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  quizzs:Array<Quizz>
  isLoaded:boolean=false;
  inicio:number=0;
  fin:number=2;
  quizporPagina:number=2;
  totalQuizzes:number=0;
  pageEvent: PageEvent;
  constructor(
    private quizzService: QuizzService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getQuizzes();
    
  }

  getQuizzes(){
    this.quizzService.obtenerQuizzSeguidos(this.inicio,this.fin)
    .subscribe(resp=>{
      this.totalQuizzes=resp["total"];
      this.quizzs = resp["cont"].length>0 ? resp["cont"] : null;
      this.isLoaded=true;
    })
  }

  muevoPagina(){
    if(this.pageEvent.pageIndex>this.pageEvent.previousPageIndex){
      this.inicio+=this.quizporPagina;
      this.fin+=this.quizporPagina;
    }else{
      this.inicio-=this.quizporPagina;
      this.fin-=this.quizporPagina;
    }
    this.getQuizzes();
  }

}
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel = '';
  nextPageLabel     = 'Siguiente';
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
