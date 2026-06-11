import { requiredRule, minStringRule, maxStringRule, emailRule } from '../helper/rules';

export const addCustomerRules = {
  CUSTOMER_CODE: [requiredRule(), minStringRule(3), maxStringRule(5)],
  CUSTOMER_TYPE: [requiredRule()],
  CUSTOMER_NAME: [requiredRule(), maxStringRule(50)],
  CUSTOMER_COUNTRY: [requiredRule()],
  CUSTOMER_PROVINCE: [requiredRule()],
  CUSTOMER_CITY: [requiredRule()],
  PROVINCE_NAME: [requiredRule()],
  CUSTOMER_ADDRESS_1: [requiredRule(), maxStringRule(150)],
  CUSTOMER_ADDRESS_2: [maxStringRule(150)],
  CUSTOMER_PHONE_1: [requiredRule(), maxStringRule(50)],
  CUSTOMER_PHONE_2: [maxStringRule(50)],
  CUSTOMER_EMAIL: [requiredRule(), maxStringRule(50), emailRule()],
  CUSTOMER_PIC: [maxStringRule(50)],
  CUSTOMER_PIC_PHONE: [maxStringRule(50)],
  CUSTOMER_PAYMENT_DUE: [maxStringRule(50)],
  CUSTOMER_REMARKS: [maxStringRule(50)],
  CUSTOMER_NOTE: [maxStringRule(300)],
  CUSTOMER_ACCOUNT_ID: [requiredRule()],
};

//const createEditCustomerRules = () => Object.assign(addCustomerRules, { CUSTOMER_CODE: [requiredRule(), maxStringRule(50)] });
export const editCustomerRules = addCustomerRules;
