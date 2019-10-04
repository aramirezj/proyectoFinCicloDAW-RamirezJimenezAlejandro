import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FollowService } from 'src/app/services/follow.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss']
})
export class FollowComponent implements OnInit, OnChanges {
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();
  @Input() currentProfileId
  public isFollowing
  public isLoading: boolean = true
  constructor(
    private followService: FollowService,
    private authService: AuthService
  ) { }

  ngOnChanges(changes) {
    this.checkIfFollowing();
  }

  ngOnInit() {
    this.checkIfFollowing();
  }

  checkIfFollowing() {
    if (this.authService.getAuthUserNickname() != this.currentProfileId) {
      this.followService.isFollowing(this.currentProfileId)
        .subscribe(resp => {
          this.isLoading = false;
          this.isFollowing = resp;
        })
    }

  }

  follow() {
    this.followService.follow(this.currentProfileId)
      .subscribe(resp => {
        this.isFollowing = true;
        this.notify.emit(1);
      })
  }
  unfollow() {
    this.followService.unfollow(this.currentProfileId)
      .subscribe(resp => {
        this.isFollowing = false;
        this.notify.emit(-1);
      })
  }






}
