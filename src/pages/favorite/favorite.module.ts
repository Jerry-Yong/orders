import { SharedModule } from './../../app/shared/shared.module';
import { ComponentsModule } from './../../components/components.module';
import { FavoritePage } from './favorite';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    FavoritePage,
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(FavoritePage),
  ],
})
export class FavoritePageModule {}
