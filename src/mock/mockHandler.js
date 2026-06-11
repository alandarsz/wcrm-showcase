import MockAdapter from 'axios-mock-adapter';
import { axiosFree, axiosAuth, axiosAuthLong } from '../helper/axiosConfig';

const mock = new MockAdapter(axiosAuth, { delayResponse: 400 });
const mockFree = new MockAdapter(axiosFree, { delayResponse: 400 });
const mockLong = new MockAdapter(axiosAuthLong, { delayResponse: 400 });

const today = new Date().toISOString().split('T')[0];

// ─── AUTH ──────────────────────────────────────────────────────────────────
mockFree.onPost('a/auth/login').reply(200, {
  code: 0,
  data: {
    token: 'dummy-token-portfolio',
    body: {
      name: 'Yudha Pratama',
      role: 'SLS',
      group: 'GRP-JKT',
      id: 'USR-001',
      code: 'SLS-001',
    },
  }
});

// ─── COUNT ──────────────────────────────────────────────────────────────────
mock.onGet(/totalNewLead/).reply(200, { code: 0, data: { body: [{ LEADS_COUNT: 7 }] } });
mock.onGet(/totalContact/).reply(200, { code: 0, data: { body: [{ LEADS_COUNT: 7 }] } });
mock.onGet(/totalTask/).reply(200, { code: 0, data: { body: [{ TASK_COUNT: 6, baru: 3, ditunda: 2, selesai: 1 }] } });
mock.onGet(/salesCount/).reply(200, { code: 0, data: { body: [{ count: 4 }] } });

mock.onGet(/totalFollowUp/).reply(200, {
  code: 0,
  data: {
    body: [
      { Status_FollowUp: 'LEADS-PERKENALAN DAN ANALISA KEBUTUHAN', LEADS_COUNT: 2 },
      { Status_FollowUp: 'LEADS-PROPOSAL HARGA', LEADS_COUNT: 2 },
      { Status_FollowUp: 'LEADS-NEGOSIASI', LEADS_COUNT: 1 },
      { Status_FollowUp: 'LEADS-TEKNIS', LEADS_COUNT: 1 },
      { Status_FollowUp: 'LEADS-TTD KONTRAK', LEADS_COUNT: 1 },
    ],
  }
});

// ─── COUNT ──────────────────────────────────────────────────────────────────
mock.onGet('a/query/getCountLeads').reply(200, {
  body: [{ LEADS_COUNT: 7 }],
});
mock.onGet('a/count/leads').reply(200, { body: [{ LEADS_COUNT: 7 }] });

mock.onGet(/a\/count\/leads/).reply(200, { body: [{ LEADS_COUNT: 7 }] });
mock.onGet(/a\/query\/getCountLeads/).reply(200, { body: [{ LEADS_COUNT: 7 }] });
mock.onGet(/countLeads/).reply(200, { body: [{ LEADS_COUNT: 7 }] });
mock.onGet(/countContacts/).reply(200, { body: [{ LEADS_COUNT: 7 }] });
mock.onGet(/countTask/).reply(200, {
  body: [{ TASK_COUNT: 6, baru: 3, ditunda: 2, selesai: 1 }],
});
mock.onGet(/salesCount/).reply(200, { body: [{ count: 4 }] });

mock.onGet(/getCountFollowUp/).reply(200, {
  body: [
    { Status_FollowUp: 'LEADS-PERKENALAN DAN ANALISA KEBUTUHAN', LEADS_COUNT: 2 },
    { Status_FollowUp: 'LEADS-PROPOSAL HARGA', LEADS_COUNT: 2 },
    { Status_FollowUp: 'LEADS-NEGOSIASI', LEADS_COUNT: 1 },
    { Status_FollowUp: 'LEADS-TEKNIS', LEADS_COUNT: 1 },
    { Status_FollowUp: 'LEADS-TTD KONTRAK', LEADS_COUNT: 1 },
  ],
});

mock.onGet(/getTargetSalesPercentage/).reply(200, { code: 0, data: [
  { bulan: 'Jan', count: 12000000, target: 15000000, percent: 80 },
  { bulan: 'Feb', count: 18500000, target: 15000000, percent: 123 },
  { bulan: 'Mar', count: 14200000, target: 15000000, percent: 95 },
  { bulan: 'Apr', count: 20000000, target: 15000000, percent: 133 },
  { bulan: 'Mei', count: 11000000, target: 15000000, percent: 73 },
  { bulan: 'Jun', count: 16500000, target: 15000000, percent: 110 },
]});

mock.onGet(/getTargetOmzetPercentage/).reply(200, { code: 0, data: [
  { bulan: 'Jan', count: 45000000, target: 50000000, percent: 90 },
  { bulan: 'Feb', count: 52000000, target: 50000000, percent: 104 },
  { bulan: 'Mar', count: 48000000, target: 50000000, percent: 96 },
  { bulan: 'Apr', count: 61000000, target: 50000000, percent: 122 },
  { bulan: 'Mei', count: 39000000, target: 50000000, percent: 78 },
  { bulan: 'Jun', count: 55000000, target: 50000000, percent: 110 },
]});

mock.onGet(/getPerformanceCorpTim/).reply(200, { code: 0, data: [
  { namasales: 'Yudha Pratama', omset: 45000000, targetomset: 50000000 },
  { namasales: 'Rika Sari', omset: 62000000, targetomset: 50000000 },
  { namasales: 'Budi Santoso', omset: 38000000, targetomset: 50000000 },
  { namasales: 'Diana Putri', omset: 57000000, targetomset: 50000000 },
]});

mock.onGet(/getPerformanceCorpTimClos/).reply(200, { code: 0, data: [
  { namasales: 'Yudha Pratama', closing: 3, targetclosing: 5 },
  { namasales: 'Rika Sari', closing: 6, targetclosing: 5 },
  { namasales: 'Budi Santoso', closing: 2, targetclosing: 5 },
  { namasales: 'Diana Putri', closing: 5, targetclosing: 5 },
]});

mock.onGet(/insentifDashboard/).reply(200, { code: 0, data: { body: [{ totalInsentifPersen: 2350000 }] } });
mock.onGet(/insentifTruckingDashboard/).reply(200, { code: 0, data: { body: [{ NominalInsentif: 1750000 }] } });

mock.onGet(/notifTask/).reply(200, {
  code: 0,
  data: {
    body: [
      {
        customer: 'PT Maju Bersama Logistik',
        agenda: 'Presentasi proposal pengiriman kargo',
        waktu: today,
        jam: '09:00',
        status: 'Pending',
      },
      {
        customer: 'CV Nusantara Cargo',
        agenda: 'Follow up negosiasi harga kontrak',
        waktu: today,
        jam: '14:00',
        status: 'Completed',
      },
    ],
  }
});

// ─── CONTACT ────────────────────────────────────────────────────────────────
const contacts = Array.from({ length: 20 }, (_, i) => ({
  ID: i + 1,
  CONTACT_NAME: ['PT Maju Bersama Logistik', 'CV Nusantara Cargo', 'PT Sinar Jaya Express', 'UD Berkah Transport', 'PT Prima Logistik', 'CV Karya Mandiri', 'PT Delta Ekspres', 'PT Garuda Freight', 'CV Sentosa Kiriman', 'PT Harapan Kargo'][i % 10],
  PHONE: `0812${String(10000000 + i * 1234567).slice(0, 8)}`,
  EMAIL: `contact${i + 1}@example.com`,
  PROVINCE: ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Jawa Tengah', 'Banten'][i % 5],
  CITY: ['Jakarta Pusat', 'Bandung', 'Surabaya', 'Semarang', 'Tangerang'][i % 5],
  STATUS: ['LEADS-PERKENALAN DAN ANALISA KEBUTUHAN', 'LEADS-PROPOSAL HARGA', 'LEADS-NEGOSIASI', 'LEADS-TEKNIS', 'LEADS-TTD KONTRAK'][i % 5],
  SALES_NAME: 'Yudha Pratama',
  CREATED_AT: `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  NOTE: 'Potensial klien korporat pengiriman reguler.',
}));

mock.onGet(/contact/).reply(200, {
  code: 0, data: { body: contacts, total: contacts.length, 'data-count': contacts.length, pagination: { rows: contacts.length } }
});
mock.onGet(/getContact/).reply(200, { code: 0, data: { body: contacts, 'data-count': contacts.length } });
mock.onPost(/contact/).reply(200, { code: 0, data: { success: true } });
mock.onPut(/contact/).reply(200, { code: 0, data: { success: true } });
mock.onDelete(/contact/).reply(200, { code: 0, data: { success: true } });

// ─── TASK ────────────────────────────────────────────────────────────────────
const tasks = Array.from({ length: 12 }, (_, i) => ({
  ID: i + 1,
  CUSTOMER: contacts[i % contacts.length].CONTACT_NAME,
  AGENDA: ['Presentasi produk', 'Follow up proposal', 'Negosiasi kontrak', 'Penandatanganan PKS', 'Kunjungan lapangan'][i % 5],
  TANGGAL: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
  JAM: ['09:00', '10:30', '13:00', '14:30', '16:00'][i % 5],
  STATUS: ['Baru', 'Ditunda', 'Selesai'][i % 3],
  SALES_NAME: 'Yudha Pratama',
  KETERANGAN: 'Pertemuan rutin pembahasan kebutuhan pengiriman',
}));

mock.onGet(/task/).reply(200, { code: 0, data: { body: tasks, 'data-count': tasks.length, pagination: { rows: tasks.length } } });
mock.onGet(/getTask/).reply(200, { code: 0, data: { body: tasks, 'data-count': tasks.length } });
mock.onPost(/task/).reply(200, { code: 0, data: { success: true } });
mock.onPut(/task/).reply(200, { code: 0, data: { success: true } });
mock.onDelete(/task/).reply(200, { code: 0, data: { success: true } });

// ─── DEALS / FOLLOW-UP ────────────────────────────────────────────────────
const deals = contacts.map((c, i) => ({
  ...c,
  ID_LEAD: i + 1,
  SEGMENT: i % 2 === 0 ? 'CORPORATE' : 'TOP',
  LAST_FOLLOW_UP: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
  VALUE: (i + 1) * 15000000,
}));

mock.onGet(/follow/).reply(200, { code: 0, data: { body: deals, 'data-count': deals.length, pagination: { rows: deals.length } } });
mock.onGet(/newLead/).reply(200, { code: 0, data: { body: deals, 'data-count': deals.length, pagination: { rows: deals.length } } });
mock.onGet(/new-lead/).reply(200, { code: 0, data: { body: deals, 'data-count': deals.length, pagination: { rows: deals.length } } });
mock.onGet(/deals/).reply(200, { code: 0, data: { body: deals, 'data-count': deals.length, pagination: { rows: deals.length } } });
mock.onPost(/deals/).reply(200, { code: 0, data: { success: true } });
mock.onPut(/deals/).reply(200, { code: 0, data: { success: true } });
mock.onDelete(/deals/).reply(200, { code: 0, data: { success: true } });

// ─── TEAM ────────────────────────────────────────────────────────────────────
mock.onGet(/team/).reply(200, {
  code: 0,
  data: {
    body: [
      { ID: 1, name: 'Yudha Pratama', role: 'Sales', group: 'Jakarta', leads: 7, closing: 3 },
      { ID: 2, name: 'Rika Sari', role: 'Sales', group: 'Jakarta', leads: 9, closing: 6 },
      { ID: 3, name: 'Budi Santoso', role: 'Sales', group: 'Bandung', leads: 5, closing: 2 },
      { ID: 4, name: 'Diana Putri', role: 'Sales', group: 'Surabaya', leads: 8, closing: 5 },
    ],
    'data-count': 4,
  }
});

// ─── PROVINCE / CITY ─────────────────────────────────────────────────────────
mock.onGet(/Province/).reply(200, {
  code: 0, data: { body: ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Jawa Tengah', 'Banten', 'Sumatera Utara', 'Kalimantan Timur'].map((p, i) => ({ ID: i + 1, NAME: p })) }
});
mock.onGet(/City/).reply(200, {
  code: 0, data: { body: ['Jakarta Pusat', 'Jakarta Selatan', 'Bandung', 'Surabaya', 'Semarang', 'Tangerang', 'Bekasi'].map((c, i) => ({ ID: i + 1, NAME: c })) }
});
mock.onGet(/District/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/SubDistrict/).reply(200, { code: 0, data: { body: [] } });

// ─── USER ────────────────────────────────────────────────────────────────────
mock.onGet(/userWcrm/).reply(200, { code: 0, data: { body: [], 'data-count': 0, pagination: { rows: 0 } } });
mock.onGet(/sasLsRole/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/getSalesGroup/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/getHub/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/InferiorUser/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/inferiorUser/).reply(200, { code: 0, data: { body: [] } });
mock.onPost(/password/).reply(200, { code: 0, data: { success: true } });

// ─── REPORT ─────────────────────────────────────────────────────────────────
mock.onGet(/insentif/).reply(200, { code: 0, data: { body: [], 'data-count': 0 } });
mock.onGet(/report/).reply(200, { code: 0, data: { body: [], 'data-count': 0 } });
mock.onGet(/permcorp/).reply(200, { code: 0, data: { body: [], 'data-count': 0 } });

// ─── BRANCH / AGENT / CAMPAIGN ───────────────────────────────────────────────
mock.onGet(/branch/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/agent/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/campaign/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/liveLocation/).reply(200, { code: 0, data: { body: [] } });
mock.onGet(/live-location/).reply(200, { code: 0, data: { body: [] } });

// ─── FALLBACK ────────────────────────────────────────────────────────────────
mock.onAny().reply(200, { code: 0, data: { body: [], 'data-count': 0 } });
mockFree.onAny().reply(200, { code: 0, data: { body: [], 'data-count': 0 } });
mockLong.onAny().reply(200, { code: 0, data: { body: [], 'data-count': 0 } });

export default mock;
