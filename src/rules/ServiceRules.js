import { maxStringRule, minNumberRule, minNumberNotEqualRule, requiredRule } from '../helper/rules';

export const addServiceRules = {
  WAREHOUSE_ID: [requiredRule()],
  SERVICE_DATE: [maxStringRule(50)],
  SERVICE_CUSTOMER_CODE: [requiredRule()],
  SERVICE_PRODUCT_CATEGORY_ID: [requiredRule()],
  SERVICE_PRODUCT_BRAND_ID: [requiredRule()],
  SERVICE_PRODUCT_NAME: [requiredRule(), maxStringRule(150)],
  SERVICE_PRODUCT_SERIAL: [requiredRule(), maxStringRule(150)],
  SERVICE_ISGUARANTEE_SERVICE: [requiredRule()],
  SERVICE_COMPLAINT: [requiredRule(), maxStringRule(500)],
  SERVICE_PO_NO: [maxStringRule(50)],
  SERVICE_ISHAS_AFTER_SERVICE_GUARANTEE: [requiredRule()],
  SERVICE_AFTER_SERVICE_GUARANTEE_TIME_DAYS: [],
  // SERVICE_TECHNICIAN_ID: [requiredRule('Required field', true, [])],
  SERVICE_REMARKS: [maxStringRule(150)],
};

export const editServiceRules = {
  ...addServiceRules,
  SERVICE_CODE: [requiredRule()],
};

export const addQuotationLineRules = {
  SERVICE_QUOTATION_LINE_ITEM_ID: [requiredRule()],
  SERVICE_QUOTATION_LINE_UOM_ID: [requiredRule()],
  SERVICE_QUOTATION_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  SERVICE_QUOTATION_LINE_ITEM_PRICE: [requiredRule(), minNumberRule(0)],
};

export const editQuotationRules = {
  SERVICE_QUOTATION_CODE: [requiredRule()],
  SERVICE_QUOTATION_REMARKS: [maxStringRule(150)],
};

export const quotationStatusUpdateDataRules = {
  SERVICE_QUOTATION_IS_APPROVED: [requiredRule()],
};

export const addServiceStatus = {
  SERVICE_CODE: [requiredRule()],
  SERVICE_STATUS_ID: [requiredRule()],
  SERVICE_STATUS_REMARKS: [requiredRule()],
};

export const addServiceStatusCancel = {
  SERVICE_STATUS_REMARKS: [requiredRule()],
};

export const addMaterialRules = {
  SERVICE_USAGE_ITEM_ID: [requiredRule()],
  SERVICE_USAGE_UOM_ID: [requiredRule()],
  SERVICE_USAGE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  SERVICE_USAGE_ITEM_PRICE: [requiredRule(), minNumberRule(0)],
};

export const updateMaterialRules = {
  SERVICE_USAGE_ITEM_PRICE: [requiredRule(), minNumberRule(0)],
};

export const addRequestMaterialRules = {
  SERVICE_REQUEST_MATERIAL_TO_WH_ID: [requiredRule()],
  SERVICE_PRODUCT_REQUEST_REMARK: [],
};

export const addRequestMaterialLineRules = {
  SERVICE_REQUEST_MATERIAL_LINE_ITEM_ID: [requiredRule()],
  SERVICE_REQUEST_MATERIAL_LINE_UOM_ID: [requiredRule()],
  SERVICE_REQUEST_MATERIAL_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  SERVICE_REQUEST_MATERIAL_LINE_REMARK: [],
};

export const addServicePoRules = {
  SERVICE_PO_NO: [requiredRule()],
};

export const addServiceGuaranteeRules = {
  SERVICE_GUARANTEE_DAY: [requiredRule(), minNumberRule(0)],
};

export const generateInvoice = {
  TAX_CODE: [requiredRule()],
};

export default {
  addServiceRules,
  editServiceRules,
  editQuotationRules,
  addQuotationLineRules,
  quotationStatusUpdateDataRules,
  addServiceStatus,
  addMaterialRules,
  updateMaterialRules,
  addServiceStatusCancel,
  addRequestMaterialRules,
  addRequestMaterialLineRules,
  addServicePoRules,
  addServiceGuaranteeRules,
  generateInvoice
};
