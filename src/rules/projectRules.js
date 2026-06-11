import { requiredRule, maxStringRule, maxNumberRule, minNumberRule } from '../helper/rules';

//header
export const addProjectRules = {
  PROJECT_CUSTOMER_CODE: [requiredRule()],
  PROJECT_EFFECTIVE_DATE: [requiredRule()],
  PROJECT_ITEM_NAME: [requiredRule()],
  PROJECT_REMARK: [],
};

export const addProjectSaleGenerate = {
  WAREHOUSE_ID: [requiredRule()],
  SELL_PRICE: [requiredRule(), minNumberRule(0)],
};

//line
export const addProjectLineRules = {
  PROJECT_LINE_ITEM_ID: [requiredRule()],
  PROJECT_LINE_UOM_ID: [requiredRule()],
  PROJECT_LINE_QTY: [requiredRule(), minNumberRule(1)],
  PROJECT_LINE_PRICE: [requiredRule(), minNumberRule(0)],
  PROJECT_LINE_REMARK: [],
};

//move order header
export const addMoveOrderRules = {
  PROJECT_MOVE_ORDER_REQUEST_CODE: [requiredRule()],
  PROJECT_MOVE_ORDER_WAREHOUSE_ID: [requiredRule()],
  PROJECT_MOVE_ORDER_REMARK: [],
};

//move order line
export const addMoveOrderLineRules = {
  PROJECT_MOVE_ORDER_LINE_ITEM_ID: [requiredRule()],
  PROJECT_MOVE_ORDER_LINE_UOM_ID: [requiredRule()],
  PROJECT_MOVE_ORDER_LINE_QTY: [requiredRule(), minNumberRule(1)],
  PROJECT_MOVE_ORDER_LINE_SERIAL_NUMBER: [requiredRule()]
};

export const insertUpdateProjectUser = {
  PROJECT_LEAD_USER_ID: [requiredRule()],
  PROJECT_ADMIN_USER_ID: [requiredRule()],
  LEAD_NAME: [],
  ADMIN_NAME: [],
};

export default {
  addProjectRules,
  addProjectSaleGenerate,
  addProjectLineRules,
  addMoveOrderRules,
  addMoveOrderLineRules,
  insertUpdateProjectUser
};
