import { requiredRule } from '../helper/rules';
import { maxStringRule, minNumberRule, minNumberNotEqualRule } from '../helper/rules';

export const saleLineInsert = {
  SALE_LINE_ITEM_ID: [requiredRule()],
  ITEM_NAME: [requiredRule()],
  SALE_LINE_UOM_ID: [requiredRule()],
  SALE_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  SALE_LINE_ITEM_PRICE: [requiredRule(), minNumberRule(0)],
  SALE_LINE_DISC_PERCENTAGE: [requiredRule(), minNumberRule(0)],
  SALE_LINE_DISC_TOTAL_AMOUNT: [requiredRule(), minNumberRule(0)],
  SALE_LINE_SERIAL_NUMBER: [requiredRule()],
  SALE_LINE_LICENSE: [requiredRule()],
};

export const saleLineEdit = {
  SALE_ID: [requiredRule()],
  ITEM_NAME: [requiredRule()],
  SALE_LINE_ID: [requiredRule()],
  SALE_LINE_ITEM_ID: [requiredRule()],
  SALE_LINE_UOM_ID: [maxStringRule(50), requiredRule()],
  SALE_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  SALE_LINE_ITEM_PRICE: [requiredRule(), minNumberRule(0)],
  SALE_LINE_DISC_PERCENTAGE: [requiredRule(), minNumberRule(0)],
  SALE_LINE_DISC_TOTAL_AMOUNT: [requiredRule(), minNumberRule(0)],
  SALE_LINE_SERIAL_NUMBER: [requiredRule()],
  SALE_LINE_LICENSE: [requiredRule()],
};

export default {
  saleLineInsert,
  saleLineEdit,
};
