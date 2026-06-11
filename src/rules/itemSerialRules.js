import { requiredRule, maxStringRule, maxNumberRule, minNumberRule } from '../helper/rules';

export const addSerialNumber = {
  ITEM_SERIAL_NUMBER: [requiredRule()],
  ITEM_ID: [requiredRule()],
  ITEM_SERIAL_REMARKS: [requiredRule()],
};

export const registerSerial = {
  ITEM_SERIAL_CONTRACT_NO: [requiredRule()],
  EFFECTIVE_FROM_DATE: [requiredRule()],
  EXPIRED_TO_DATE: [requiredRule()],
};

export default {
  addSerialNumber,
  registerSerial,
};
