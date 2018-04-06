import { SharedModule } from './../app/shared/shared.module';
import { AutoFocus } from './autofocus';
import { FavoriteListComponent } from './favorite-list/favorite-list';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
	declarations: [
		AutoFocus,
		FavoriteListComponent
	],
	imports: [
		SharedModule,
		IonicPageModule.forChild(FavoriteListComponent)
	],
	exports: [
		AutoFocus,
		FavoriteListComponent
	]
})
export class ComponentsModule { }
