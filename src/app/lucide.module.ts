import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Home,
  GraduationCap,
  Layers,
  Bookmark,
  Wallet,
  FileText,
  CreditCard,
  Receipt,
  Users,
  User,
  ClipboardList,
  ClipboardPenLine,
  DollarSign,
  UserRound,
  BarChart2,
  Settings
} from 'lucide-angular';

const icons = {
  Home,
  GraduationCap,
  Layers,
  Bookmark,
  Wallet,
  FileText,
  CreditCard,
  Receipt,
  Users,
  User,
  ClipboardList,
  ClipboardPenLine,
  DollarSign,
  UserRound,
  BarChart2,
  Settings
};

@NgModule({
  imports: [LucideAngularModule.pick(icons)],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
