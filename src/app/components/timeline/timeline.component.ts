import { Component, OnInit, Input } from '@angular/core';
import { TimelineModel } from 'src/app/models';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

    @Input()
    timelineData: TimelineModel[] = [];

  constructor() { }

  ngOnInit() {
  }

}
