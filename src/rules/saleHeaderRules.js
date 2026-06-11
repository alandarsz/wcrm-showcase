import { requiredRule } from '../helper/rules';
import { maxStringRule } from '../helper/rules';

export const saleHeaderEdit = {
  SALE_ID: [requiredRule()],
  SALE_CUSTOMER_CODE: [],
  CUSTOMER_NAME: [],
  SALE_PO_NO: [],
  WAREHOUSE_ID: [],
  SERVICE_CODE: [],
  SALE_REMARKS: [maxStringRule(300)],
  SALE_PAY_DUE: [requiredRule()],
  DUE_DAY_REMARKS: [],
  SALE_PERSON: [],
};

export const saleHeaderInsert = {
  SALE_CUSTOMER_CODE: [requiredRule()],
  SALE_PO_NO: [],
  WAREHOUSE_ID: [requiredRule()],
  SERVICE_CODE: [],
  SALE_REMARKS: [maxStringRule(300)],
  SALE_PAY_DUE: [requiredRule()],
  DUE_DAY_REMARKS: [],
  SALE_PERSON: [requiredRule()],
};

export const salePaymentRules = {
  CUSTOMER_CODE: [requiredRule()]
};

export default {
  saleHeaderEdit,
  saleHeaderInsert,
  salePaymentRules,
};
