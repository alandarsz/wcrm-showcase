export const routerReq = [
  {
    GROUP_HEADER: 'Dashboard',
    MENU_HEADER_INDEX: 1,
    MENU_HEADER_PICTURE: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16">
    <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z"/>
    <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z"/>
  </svg>`,
    MENU_HEADER_PATH: 'dashboard',
    children: [
      {
        MENU_DETAIL_CODE: 'PROD001',
        MENU_HEADER_CODE: 'PROD',
        MENU_DETAIL_NAME: 'Dashboard',
        MENU_DETAIL_DESCRIPTION: 'Menu untuk list product dan setup product',
        MENU_DETAIL_FORM_NAME: 'product-setup',
        MENU_DETAIL_PATH: 'dashboard',
        MENU_DETAIL_PICTURE: '',
        MENU_DETAIL_INDEX: '1001',
        GROUP_HEADER: 'Product',
      },
    ],
  },
  {
    GROUP_HEADER: 'Product',
    MENU_HEADER_INDEX: 1,
    MENU_HEADER_PICTURE: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grid-fill" viewBox="0 0 16 16">
    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
  </svg>`,
    MENU_HEADER_PATH: 'product',
    children: [
      {
        MENU_DETAIL_CODE: 'PROD001',
        MENU_HEADER_CODE: 'PROD',
        MENU_DETAIL_NAME: 'Daftar Produk',
        MENU_DETAIL_DESCRIPTION: 'Menu untuk list product dan setup product',
        MENU_DETAIL_FORM_NAME: 'product-setup',
        MENU_DETAIL_PATH: 'product-setup',
        MENU_DETAIL_PICTURE: '',
        MENU_DETAIL_INDEX: '1001',
        GROUP_HEADER: 'Product',
      },
    ],
  },
  {
    GROUP_HEADER: 'Purchase',
    MENU_HEADER_INDEX: 2,
    MENU_HEADER_PICTURE: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-check-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zm-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
    </svg>`,
    MENU_HEADER_PATH: 'purchase',
    children: [
      {
        MENU_DETAIL_CODE: 'PURC001',
        MENU_HEADER_CODE: 'PURC',
        MENU_DETAIL_NAME: 'Daftar Pembelian',
        MENU_DETAIL_DESCRIPTION: 'Menu untuk menampilkan daftar pembelian',
        MENU_DETAIL_FORM_NAME: 'purchase',
        MENU_DETAIL_PATH: 'purchase',
        MENU_DETAIL_PICTURE: '',
        MENU_DETAIL_INDEX: '2001',
        GROUP_HEADER: 'Purchase',
      },
    ],
  },
  {
    GROUP_HEADER: 'Sale',
    MENU_HEADER_INDEX: 3,
    MENU_HEADER_PICTURE: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tags-fill" viewBox="0 0 16 16">
      <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
      <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z"/>
    </svg>`,
    MENU_HEADER_PATH: 'sale',
    children: [
      {
        MENU_DETAIL_CODE: 'SALE001',
        MENU_HEADER_CODE: 'SALE',
        MENU_DETAIL_NAME: 'Daftar Penjualan',
        MENU_DETAIL_DESCRIPTION: 'Menu untuk menampilkan daftar penjualan',
        MENU_DETAIL_FORM_NAME: 'purchase-list',
        MENU_DETAIL_PATH: 'purchase-list',
        MENU_DETAIL_PICTURE: '',
        MENU_DETAIL_INDEX: '3001',
        GROUP_HEADER: 'Sale',
      },
    ],
  },
  {
    GROUP_HEADER: 'Return',
    MENU_HEADER_INDEX: 4,
    MENU_HEADER_PICTURE: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder-symlink-fill" viewBox="0 0 16 16">
      <path d="M13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2l.04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3zM2.19 3c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672a1 1 0 0 1 .707.293L7.586 3H2.19zm9.608 5.271-3.182 1.97c-.27.166-.616-.036-.616-.372V9.1s-2.571-.3-4 2.4c.571-4.8 3.143-4.8 4-4.8v-.769c0-.336.346-.538.616-.371l3.182 1.969c.27.166.27.576 0 .742z"/>
    </svg>`,
    MENU_HEADER_PATH: 'return',
    children: [
      {
        MENU_DETAIL_CODE: 'RET001',
        MENU_HEADER_CODE: 'RET',
        MENU_DETAIL_NAME: 'Daftar Retur Pembelian',
        MENU_DETAIL_DESCRIPTION: 'Menu untuk melihat daftar retur pembelian',
        MENU_DETAIL_FORM_NAME: 'purchase-return-list',
        MENU_DETAIL_PATH: 'purchase-return',
        MENU_DETAIL_PICTURE: '',
        MENU_DETAIL_INDEX: '4001',
        GROUP_HEADER: 'Return',
      },
      {
        MENU_DETAIL_CODE: 'RET003',
        MENU_HEADER_CODE: 'RET',
        MENU_DETAIL_NAME: 'Daftar Retur Penjualan',
        MENU_DETAIL_DESCRIPTION: 'Menu untuk melihat daftar retur penjualan',
        MENU_DETAIL_FORM_NAME: 'sale-return-list',
        MENU_DETAIL_PATH: 'sale-return-list',
        MENU_DETAIL_PICTURE: '',
        MENU_DETAIL_INDEX: '4003',
        GROUP_HEADER: 'Return',
      },
    ],
  },
];

export default routerReq;
