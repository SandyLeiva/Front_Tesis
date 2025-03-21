import { Routes } from "@angular/router";
import { MatriculasComponent } from "./matriculas.component";
import { MatriculasListComponent } from "./matriculas-list/matriculas-list.component";
import { MatriculasAddComponent } from "./matriculas-add/matriculas-add.component";

export const MATRICULA_ROUTES: Routes = [
  {path: '', component: MatriculasComponent,
    children: [
      {path: '', component: MatriculasListComponent},
      {path: 'add', component: MatriculasAddComponent}
    ]
  },
]
