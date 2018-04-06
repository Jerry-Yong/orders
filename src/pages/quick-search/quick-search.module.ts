import { SharedModule } from './../../app/shared/shared.module';
import { ComponentsModule } from './../../components/components.module';
import { QuickSearchPage } from './quick-search';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    QuickSearchPage,
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(QuickSearchPage),
  ],
})
export class QuickSearchPageModule {}
