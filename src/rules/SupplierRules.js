import { requiredRule, maxStringRule, maxNumberRule, minNumberRule } from '../helper/rules';

export const addSupplierRules = {
  SUPPLIER_CODE: [requiredRule()],
  SUPPLIER_NAME: [requiredRule(), maxStringRule(50)],
  SUPPLIER_COUNTRY: [requiredRule()],
  SUPPLIER_PROVINCE: [requiredRule('Required field', true, [])],
  SUPPLIER_CITY: [requiredRule('Required field', true, [])],
  SUPPLIER_ADDRESS_1: [requiredRule(), maxStringRule(150)],
  SUPPLIER_ADDRESS_2: [maxStringRule(150)],
  SUPPLIER_PHONE_NO_1: [requiredRule(), maxStringRule(50)],
  SUPPLIER_PHONE_NO_2: [maxStringRule(50)],
  SUPPLIER_EMAIL: [requiredRule(), maxStringRule(50)],
  SUPPLIER_PIC: [requiredRule(), maxStringRule(50)],
  SUPPLIER_PIC_PHONE: [requiredRule(), maxStringRule(50)],
  SUPPLIER_PAYMENT_DUE: [requiredRule(), maxStringRule(50)],
  SUPPLIER_REMARKS: [requiredRule(), maxStringRule(50)],
  SUPPLIER_TAX_REGISTRATION_CODE: [maxStringRule(50)],
  SUPPLIER_NOTE: [requiredRule(), maxStringRule(300)],
  SUPPLIER_ACCOUNT_ID: [requiredRule()],
};

// const createEditSupplierRules = () => Object.assign(addSupplierRules, { SUPPLIER_CODE: [requiredRule(), maxStringRule(50)] });
export const editSupplierRules = addSupplierRules;
