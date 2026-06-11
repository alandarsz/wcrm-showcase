// Dummy menu list — format harus sama persis dengan response API asli Wahana CRM.
// Aturan: untuk single-item (items.length == 1), pastikan name == parentMenu
// agar LeftMenuItemV2.vue tidak menggabungkan keduanya menjadi string ganda.
export const menuList = [
  {
    parentMenu: 'Dashboard',
    items: [
      {
        route: JSON.stringify({ path: 'dashboard' }),
        name: 'Dashboard',
        icon: 'dashboard',
      },
    ],
  },
  {
    parentMenu: 'Corporate Deals',
    items: [
      {
        route: JSON.stringify({ path: 'new-lead' }),
        name: 'New Lead',
        icon: 'business_center',
      },
      {
        route: JSON.stringify({ path: 'follow-up' }),
        name: 'Follow Up',
        icon: 'forum',
      },
    ],
  },
  {
    parentMenu: 'Top Deals',
    items: [
      {
        route: JSON.stringify({ path: 'new-lead-top' }),
        name: 'New Lead TOP',
        icon: 'stars',
      },
      {
        route: JSON.stringify({ path: 'follow-up-top' }),
        name: 'Follow Up TOP',
        icon: 'support_agent',
      },
    ],
  },
  {
    parentMenu: 'Contact List',
    items: [
      {
        route: JSON.stringify({ path: 'contact-list' }),
        name: 'Contact List',
        icon: 'contacts',
      },
    ],
  },
  {
    parentMenu: 'Input Task',
    items: [
      {
        route: JSON.stringify({ path: 'input-task' }),
        name: 'Input Task',
        icon: 'add_task',
      },
    ],
  },
  {
    parentMenu: 'Team',
    items: [
      {
        route: JSON.stringify({ path: 'team' }),
        name: 'Team',
        icon: 'groups',
      },
    ],
  },
  {
    parentMenu: 'Report',
    items: [
      {
        route: JSON.stringify({ path: 'insentif' }),
        name: 'Insentif Kiriman',
        icon: 'assessment',
      },
      {
        route: JSON.stringify({ path: 'insentif-trucking' }),
        name: 'Insentif Trucking',
        icon: 'local_shipping',
      },
    ],
  },
];
