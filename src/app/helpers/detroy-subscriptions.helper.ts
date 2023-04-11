import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
    template: ''
  })
export abstract class OnDestroySubscriptions implements OnDestroy {

    subscriptions: Subscription = new Subscription();

	ngOnDestroy(): void {
        //destroy todas as subscriptions filhas para liberar memoria e evitar memoryLeak's no angular 
		this.subscriptions.unsubscribe(); 
	}

}