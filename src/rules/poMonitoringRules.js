import { requiredRule, maxStringRule, maxNumberRule, minNumberRule, minNumberNotEqualRule } from '../helper/rules';

export const poMonitoringInsertRules = {
  BRANCH_ID: [requiredRule()],
  CUSTOMER_PO_NO: [requiredRule()],
  CUSTOMER_CODE: [requiredRule()],
  CUSTOMER_PO_DATE: [requiredRule()],
  CUSTOMER_PO_DELIVERY_DATE_SCHEDULE: [requiredRule()],
  CUSTOMER_PO_REMARKS: [],
};

export const headerEditRules = {
  BRANCH_ID: [requiredRule()],
  CUSTOMER_PO_NO: [requiredRule()],
  CUSTOMER_CODE: [requiredRule()],
  CUSTOMER_PO_DATE: [requiredRule()],
  CUSTOMER_PO_DELIVERY_DATE_SCHEDULE: [requiredRule()],
  CUSTOMER_PO_REMARKS: [],
};

export const addLineRules = {
  CUSTOMER_PO_NO: [requiredRule()],
  CUSTOMER_PO_LINE_ITEM_ID: [requiredRule(), minNumberRule(1)],
  CUSTOMER_PO_LINE_UOM_ID: [requiredRule()],
  CUSTOMER_PO_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  CUSTOMER_PO_LINE_REMARKS: [],
};

export const editLineRules = {
  CUSTOMER_PO_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  CUSTOMER_PO_LINE_REMARKS: [],
};

export default {
  poMonitoringInsertRules,
  headerEditRules,
  addLineRules,
};
