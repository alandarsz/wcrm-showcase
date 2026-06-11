export const requiredValMsg = () => `Field ini wajib diisi!`;

export const requiredRule = (message = requiredValMsg(), required = true, trigger = ['change']) => {
  return {
    message: message,
    required: required,
    trigger: trigger,
  };
};

export const minStringRule = (min, trigger = ['blur', 'change'], message) => {
  return {
    min: min,
    trigger: trigger,
    message: message ? message : `Minimal ${min} karakter!`,
  };
};

export const maxStringRule = (max, trigger = ['blur', 'change'], message) => {
  return {
    max: max,
    trigger: trigger,
    message: message ? message : `Maksimal ${max} karakter!`,
  };
};

export const emailRule = (message = 'Format email salah!', trigger = ['blur', 'change'], type = 'email') => {
  return {
    message: message,
    trigger: trigger,
    type: type,
  };
};

export const minNumberRule = (inputNumber = 1, trigger = ['blur', 'change']) => {
  return {
    validator: (_, value) => value >= inputNumber,
    message: `Harus lebih besar atau sama dengan ${inputNumber}!`,
    trigger: trigger,
  };
};

export const minNumberNotEqualRule = (inputNumber = 0, trigger = ['blur', 'change']) => {
  return {
    validator: (_, value) => value > inputNumber,
    message: `Harus lebih besar ${inputNumber}!`,
    trigger: trigger,
  };
};

export const maxNumberRule = (inputNumber = 2147483647, trigger = ['blur', 'change']) => {
  return {
    validator: (_, value) => value < inputNumber,
    message: `Harus lebih kecil atau sama dengan ${inputNumber}!`,
    trigger: trigger,
  };
};

export const rulesTOPLead = (formData) => ({
  LT_SHOP_NAME: [{ required: true, message: 'Nama toko wajib', trigger: 'blur' }],
  LT_OWNER_NAME: [{ required: true, message: 'Nama pemilik wajib', trigger: 'blur' }],
  LT_WHATSAPP: [{ required: true, message: 'Nomor WhatsApp wajib', trigger: 'blur' }],
  LT_EMAIL: [{ required: true, message: 'Email wajib', trigger: 'blur' }],

  LT_PROVINCE_ID: [{ required: true, message: 'Provinsi wajib', trigger: 'change' }],
  LT_CITY_ID: [{ required: true, message: 'Kota wajib', trigger: 'change' }],
  LT_DISTRICT_ID: [{ required: true, message: 'Kecamatan wajib', trigger: 'change' }],
  LT_SUBDISTRICT_ID: [{ required: true, message: 'Kelurahan wajib', trigger: 'change' }],

  LT_ADDRESS: [{ required: true, message: 'Alamat wajib', trigger: 'blur' }],

  LT_MARKETPLACE: [{ required: true, message: 'Marketplace wajib', trigger: 'change' }],
  LT_MARKETPLACE_TYPE: [{ required: true, message: 'Jenis marketplace wajib', trigger: 'change' }],
  LT_PRODUCT_CATEGORY: [{ required: true, message: 'Kategori produk wajib', trigger: 'blur' }],

  LT_LONGITUDE: [{ required: true, message: 'Longitude wajib', trigger: 'blur' }],
  LT_LATITUDE: [{ required: true, message: 'Latitude wajib', trigger: 'blur' }],

  LT_DATA_SOURCE: [{ required: true, message: 'Sumber data wajib', trigger: 'change' }],
  LT_BUILDING_TYPE: [{ required: true, message: 'Jenis bangunan wajib', trigger: 'change' }],

  LT_OTHER_BUSINESS: [{ required: true, message: 'Pilih salah satu', trigger: 'change' }],

  LT_OTHER_BUSINESS_TYPE: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_OTHER_BUSINESS === 'Ada' && !value) {
          callback(new Error('Jenis usaha wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  LT_OTHER_BUSINESS_NAME: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_OTHER_BUSINESS === 'Ada' && !value) {
          callback(new Error('Nama brand wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

export const rulesTOPFollowUp = (formData) => ({
  LT_SHOP_NAME: [{ required: true, message: 'Nama toko wajib', trigger: 'blur' }],
  LT_OWNER_NAME: [{ required: true, message: 'Nama pemilik wajib', trigger: 'blur' }],
  LT_WHATSAPP: [{ required: true, message: 'Nomor WhatsApp wajib', trigger: 'blur' }],
  LT_EMAIL: [{ required: true, message: 'Email wajib', trigger: 'blur' }],

  LT_PROVINCE_ID: [{ required: true, message: 'Provinsi wajib', trigger: 'change' }],
  LT_CITY_ID: [{ required: true, message: 'Kota wajib', trigger: 'change' }],
  LT_DISTRICT_ID: [{ required: true, message: 'Kecamatan wajib', trigger: 'change' }],
  LT_SUBDISTRICT_ID: [{ required: true, message: 'Kelurahan wajib', trigger: 'change' }],

  LT_ADDRESS: [{ required: true, message: 'Alamat wajib', trigger: 'blur' }],

  LT_MARKETPLACE: [{ required: true, message: 'Marketplace wajib', trigger: 'change' }],
  LT_MARKETPLACE_TYPE: [{ required: true, message: 'Jenis marketplace wajib', trigger: 'change' }],
  LT_PRODUCT_CATEGORY: [{ required: true, message: 'Kategori produk wajib', trigger: 'blur' }],

  LT_LONGITUDE: [{ required: true, message: 'Longitude wajib', trigger: 'blur' }],
  LT_LATITUDE: [{ required: true, message: 'Latitude wajib', trigger: 'blur' }],

  LT_DATA_SOURCE: [{ required: true, message: 'Sumber data wajib', trigger: 'change' }],
  LT_BUILDING_TYPE: [{ required: true, message: 'Jenis bangunan wajib', trigger: 'change' }],

  LT_OTHER_BUSINESS: [{ required: true, message: 'Pilih salah satu', trigger: 'change' }],
  LT_STATUS: [{ required: true, message: 'Pilih salah satu', trigger: 'change' }],
  LT_OTHER_BUSINESS_TYPE: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_OTHER_BUSINESS === 'Ada' && !value) {
          callback(new Error('Jenis usaha wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  LT_OTHER_BUSINESS_NAME: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_OTHER_BUSINESS === 'Ada' && !value) {
          callback(new Error('Nama brand wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  LT_PHOTO_LOCATION: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_STATUS === 'TOP-CLOSING' && !value) {
          callback(new Error('Foto wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  LT_PHOTO_ACCESS: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_STATUS === 'TOP-CLOSING' && !value) {
          callback(new Error('Foto wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  LT_PHOTO_PRODUCT: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_STATUS === 'TOP-CLOSING' && !value) {
          callback(new Error('Foto wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  LT_PHOTO_MARKETPLACE: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_STATUS === 'TOP-CLOSING' && !value) {
          callback(new Error('Foto wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  LT_PHOTO_WA: [
    {
      validator: (rule, value, callback) => {
        if (formData.LT_STATUS === 'TOP-CLOSING' && !value) {
          callback(new Error('Foto wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  LT_BUKTI_AKTIVITAS: [
    {
      validator: (rule, value, callback) => {
        if ((formData.LT_STATUS === 'TOP-PROSES' || formData.LT_STATUS === 'TOP-BELUM MINAT') && !value) {
          callback(new Error('Foto wajib diisi'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

export const rulesFollowUpCorporate = (formData) => ({
  L_CUSTOMER_NAME: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CUSTOMER_COMPANY_TYPE: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CUSTOMER_ADDRESS: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_PROVINCE_ID: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CITY_ID: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CUSTOMER_COMPANY_INDUSTRI_TYPE: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CONTACT_PERSON: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CUSTOMER_COMPANY_POSITION: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_TYPE_OF_NEED: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_OMZET_ESTIMATION: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CURRENT_SHIPPING_VENDOR: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_PAYMENT_METHOD: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_JANGKA_PEMBAYARAN: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_ISHAVE_TRAVEL_DOCUMENT: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_FOLLOW_TYPE: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_FOLLOW_STATUS: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_SEWA_ARMADA: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_PHOTO_SELFIE: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_BUKTI_WA: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_GPS_ADDRESS: [{ required: true, message: 'Wajib Check in', trigger: 'blur' }],
  L_HASIL_FOLLOW_UP: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CUSTOMER_PHONE : [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_CUSTOMER_EMAIL : [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_KIRIMAN_AMOUNT_COUNT: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
  L_DESTINATION: [{ required: true, message: 'Wajib Di isi', trigger: 'blur' }],
});
