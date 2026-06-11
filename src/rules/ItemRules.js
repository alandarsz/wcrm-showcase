import { requiredRule, maxStringRule, minNumberRule, minNumberNotEqualRule } from '../helper/rules';

export const addItemRules = {
  ITEM_SUB_CATEGORY_ID: [requiredRule()],
  ITEM_BRAND_ID: [requiredRule()],
  ITEM_NAME: [requiredRule(), maxStringRule(150)],
  ITEM_PART_NO: [requiredRule(), maxStringRule(150)],
  ITEM_QTY_REORDER: [requiredRule(), minNumberRule(0)],
  ITEM_BARCODE: [],
  ITEM_UOM_BUY: [requiredRule(), maxStringRule(50)],
  ITEM_UOM_SELL: [requiredRule(), maxStringRule(50)],
  ITEM_UOM_CONVERSION_BUY_TO_SELL: [requiredRule(), minNumberNotEqualRule()],
  ITEM_IMAGE_URL: [maxStringRule(150)],
  ITEM_SELL_PRICE_1: [requiredRule(), minNumberRule(0)],
  ITEM_SELL_PRICE_2: [requiredRule(), minNumberRule(0)],
};

export const itemHistoryRules = {
  // ITEM_ID:[requiredRule()],
  PURCHASE_CUSTOMER_PO_NO:[],
  SUPPLIER_CODE:[],
  CUSTOMER_CODE:[],
  ALT_NAME:[],
  ITEM_NO:[],
  MC_NO:[],
};

export default {
  addItemRules,
  itemHistoryRules,
};
