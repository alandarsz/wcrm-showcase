import { requiredRule } from '../helper/rules';

export const receiptHeaderRules = {
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
  PURCHASE_RECEIPT_DATE: [
    {
      required: true,
      message: 'please input receipt date',
      trigger: ['blur', 'change'],
    },
  ],
  PURCHASE_RECEIPT_REMARKS: [
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
export const inputReceiptQtyRule = {
  INPUT_RECEIPT_QTY: [
    {
      min: 0,
      message: 'receipt qty should be at least 0',
      trigger: ['blur', 'change'],
    },
  ],
};

export const addItemSerialRules = {
  PURCHASE_RECEIPT_SERIAL_NUMBER: [requiredRule()],
};

export const addItemLicenseRules = {
  PURCHASE_RECEIPT_LICENSE_CONTRACT_NO: [requiredRule()],
  PURCHASE_RECEIPT_LICENSE_VALIDITY_EFFECTIVE_DATE: [requiredRule()],
  PURCHASE_RECEIPT_LICENSE_VALIDITY_EXPIRED_DATE: [requiredRule()],
  PURCHASE_RECEIPT_LICENSE_SERIAL_NUMBER: [requiredRule()],
};

export default {
  receiptHeaderRules,
  searchPoRule,
  inputReceiptQtyRule,
  addItemSerialRules,
  addItemLicenseRules,
};
