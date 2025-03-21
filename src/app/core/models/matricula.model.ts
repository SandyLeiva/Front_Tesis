export interface Matricula {
  id_matricula?: number;
  cod_matricula: string;
  fecha_matricula: string;
  periodo: string;
  concepto_pago: string;
  id_padre?: number;
  padre_nombre: string;
  alumnos: number[];

}

