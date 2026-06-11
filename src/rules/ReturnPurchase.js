export const returnPurchaseRule = {
  PURCHASE_INVOICE_NO: [
    {
      required: true,
      message: 'Please input invoice number',
      trigger: 'blur',
    },
    {
      min: 1,
      message: 'invoice number length should be at least 1 characters',
      trigger: ['blur', 'change'],
    },
    {
      max: 50,
      message: 'invoice number length should be at maximum 50 characters',
      trigger: ['blur', 'change'],
    },
  ],
  PURCHASE_RETURN_DATE: [
    {
      required: true,
      message: 'please input return date',
      trigger: ['blur', 'change'],
    },
  ],
  PURCHASE_RETURN_REMARKS: [
    {
      max: 300,
      message: 'text length should be at maximum 300 characters',
      trigger: ['blur', 'change'],
    },
  ],
};

export const searchPoRule = {
  NO_PO: [
    {
      required: true,
      message: 'Please input no PO',
      trigger: [],
    },
  ],
};
export const returnPurchaseLinesRule = {
  PURCHASE_RETURN_QTY: [
    {
      min: 0,
      message: 'return qty should be at least 0',
      trigger: ['blur', 'change'],
    },
  ],
  PURCHASE_RETURN_REMARKS: [
    {
      max: 300,
      message: 'text length should be at maximum 300 characters',
      trigger: ['blur', 'change'],
    },
  ],
};

export default {
  returnPurchaseRule,
  searchPoRule,
  returnPurchaseLinesRule,
};
