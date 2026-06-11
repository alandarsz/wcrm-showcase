const appName = import.meta.env.VITE_APP_NAME;

export const routeList = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: 'Home',
    },
    component: () => import('../views/notfound/DefaultPage.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login',
    },
    component: () => import('../views/auth/LoginPage.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    meta: {
      title: 'Forgot Password',
    },
    component: () => import('../views/auth/ForgotPassword.vue'),
  },
  {
    path: '/activate-account',
    name: 'activate-account',
    meta: {
      title: 'Activate Account',
    },
    component: () => import('../views/auth/Activate.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: 'Dashboard',
    },
    component: () => import('../views/dashboard/DashboardPage.vue'),
  },
  {
    path: '/corporate-deals',
    name: 'corporate-deals',
    meta: {
      title: 'Corporate Deals',
    },
    component: () => import('../views/WrapLayout.vue'),
    children: [
      {
        path: 'new-lead',
        name: 'new-lead',
        meta: {
          title: 'New Corporate Lead',
        },
        component: () => import('../views/deals/NewLead.vue'),
      },
      {
        path: 'follow-up',
        name: 'follow-up',
        meta: {
          title: 'Corporate Follow Up',
        },
        component: () => import('../views/deals/FollowUp.vue'),
      },
    ],
  },
  {
    path: '/top-deals',
    name: 'top-deals',
    meta: {
      title: 'Top Deals',
    },
    component: () => import('../views/WrapLayout.vue'),
    children: [
      {
        path: 'new-lead-top',
        name: 'new-lead-top',
        meta: {
          title: 'Daftar Top Lead',
        },
        component: () => import('../views/top-deals/TopNewLead.vue'),
      },
      {
        path: 'follow-up-top',
        name: 'follow-up-top',
        meta: {
          title: 'Top Follow Up',
        },
        component: () => import('../views/top-deals/TopFollowUp.vue'),
      },
    ],
  },
  {
    path: '/input-task',
    name: 'Task',
    meta: {
      title: 'task',
    },
    component: () => import('../views/task/TaskPage.vue'),
  },
  {
    path: '/contact-list',
    name: 'contact',
    meta: {
      title: 'Contact List',
    },
    component: () => import('../views/contact/ContactPage.vue'),
  },
  {
    path: '/order-report',
    name: 'order-report',
    meta: {
      title: 'Laporan Order',
    },
    component: () => import('../views/order/OrderReport.vue'),
  },
  {
    path: '/live-location',
    name: 'live-location',
    meta: {
      title: 'Live Location',
    },
    component: () => import('../views/live-location/LiveLocation.vue'),
  },
  {
    path: '/team',
    name: 'team',
    meta: {
      title: 'Daftar Anggota Team',
    },
    component: () => import('../views/team/TeamPage.vue'),
  },
  {
    path: '/report',
    name: 'report',
    meta: {
      title: 'Report',
    },
    component: () => import('../views/WrapLayout.vue'),
    children: [
      {
        path: 'insentif',
        name: 'insentif',
        meta: {
          title: 'Report Insentif',
        },
        component: () => import('../views/report/ReportInsentif.vue'),
        // component: () => import('../views/Repair.vue'),
      },
      {
        path: 'insentif-trucking',
        name: 'insentif truncking',
        meta: {
          title: 'Report Insentif Trucking',
        },
        component: () => import('../views/report/ReportInsentifTrucking.vue'),
        // component: () => import('../views/Repair.vue'),
      },
            {
        path: 'report-permCorp',
        name: 'Performance Corporate',
        meta: {
          title: 'Report Performance Corporate',
        },
        component: () => import('../views/report/ReportPermcorp.vue'),
        // component: () => import('../views/Repair.vue'),
      },
    ],
  },
  {
    path: '/agen-deals',
    name: 'agen-deals',
    meta: {
      title: 'Pengajuan Keagenan',
    },
    component: () => import('../views/agent/AgentDeals.vue'),
  },
  {
    path: '/team',
    name: 'team',
    meta: {
      title: 'Daftar Anggota Team',
    },
    component: () => import('../views/team/TeamPage.vue'),
  },
  {
    path: '/documents',
    name: 'documents',
    meta: {
      title: 'Documents',
    },
    component: () => import('../views/WrapLayout.vue'),
    children: [
      {
        path: 'input-harga',
        name: 'input-harga',
        meta: {
          title: 'Input Harga',
        },
        component: () => import('../views/doc/InputHarga.vue'),
        // component: () => import('../views/Repair.vue'),
      },
      {
        path: 'input-pks',
        name: 'input-pks',
        meta: {
          title: 'Input PKS',
        },
        component: () => import('../views/doc/InputPks.vue'),
        // component: () => import('../views/Repair.vue'),

      },
      {
        path: 'input-pks-armada',
        name: 'input-pks-armada',
        meta: {
          title: 'Input Pks Sewa Armada',
        },
        component: () => import('../views/doc/InputPksArmada.vue'),
        // component: () => import('../views/Repair.vue'),

      },
    ],
  },
  {
    path: '/print',
    name: 'print',
    meta: {
      title: 'Print Report',
    },
    component: () => import('../views/WrapLayout.vue'),
    children: [
      {
        path: 'print-insentif',
        name: 'print-insentif',
        meta: {
          title: 'Print Report Insentif',
        },
        component: () => import('../views/print/PrintReportInsentif.vue'),
      },
    ],
  },
  {
    path: '/dynamic-iframe',
    name: 'dynamic-iframe',
    meta: {
      title: 'Dynamic Iframe',
    },
    component: () => import('../views/DynamicIframeByJovi.vue'),
  },
  {
    path: '/:notfound(.*)',
    name: 'notfound',
    meta: {
      title: 'Halaman Tidak Ditemukan',
    },
    component: () => import('../views/notfound/NotFound.vue'),
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    meta: {
      title: 'Halaman Tidak Dapat Diakses',
    },
    component: () => import('../views/notfound/Unauthorized.vue'),
  },
];

export default routeList;

// {
//   path: 'input-harga',
//   name: 'input-harga',
//   meta: {
//     title: 'Input Harga',
//   },
//   component: () => import('../views/deals/InputHarga.vue'),
// },
