export type ComponentCardItem = {
  className: string;
  images: { light: string; dark: string };
};

export type SubRouteProps = {
  title: string;
  images: string;
  href: string;
};

export type RouteProps = {
  title: string;
  images: string;
  href: string;
  group: boolean;
  card?: ComponentCardItem;
  subRoutes?: SubRouteProps[];
};

export const components: RouteProps[] = [
  {
    title: 'Panel de control',
    href: '/dashboard',
    group: false,
    images: 'home' // 🏠 Home
  },
  {
    title: 'Admin. Académica',
    href: '',
    group: true,
    images: 'graduation-cap', // 🎓 Educación
    subRoutes: [
      { title: 'Nivel Educativo', images: 'layers', href: '/dashboard/nivel-educativo' }, // 📚
      { title: 'Grado Académico', images: 'bookmark', href: '/dashboard/grado-academico' }, // 🏷️
    ],
  },
  {
    title: 'Admin. financiera',
    href: '',
    group: true,
    images: 'wallet', // 💰 Finanzas
    subRoutes: [
      { title: 'Concepto de pago', images: 'file-text', href: '/dashboard/concepto-de-pago' }, // 📄
      { title: 'Pagos', images: 'credit-card', href: '/dashboard/pagos' }, // 💳
      { title: 'Voucher Pago', images: 'receipt', href: '/dashboard/voucher-pago' }, // 🧾
    ],
  },
  {
    title: 'Admin. de Personal',
    href: '',
    group: true,
    images: 'users', // 👥 Personal
    subRoutes: [
      { title: 'Estudiantes', images: 'graduation-cap', href: '/dashboard/estudiantes' }, // 🎓
      { title: 'Padres', images: 'user-round', href: '/dashboard/padres' }, // 👤
    ],
  },
  {
    title: 'Matrículas',
    href: '/dashboard/matriculas',
    group: false,
    images: 'clipboard-pen-line', // 📋 Inscripciones
  },
  {
    title: 'Pensiones',
    href: '/dashboard/pensiones',
    group: false,
    images: 'dollar-sign', // 💵 Pensiones
  },
  {
    title: 'Reportes',
    href: '/dashboard/reportes',
    group: false,
    images: 'bar-chart-2', // 📊 Reportes
  },
  {
    title: 'Configuraciones',
    href: '/dashboard/configuraciones',
    group: false,
    images: 'settings', // ⚙️ Configuración
  }
];

