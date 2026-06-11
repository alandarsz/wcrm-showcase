import { maxStringRule } from '../helper/rules';
import { emailRule } from '../helper/rules';
import { requiredRule } from '../helper/rules';

export const companyRules = {
  COMPANY_ID: [requiredRule('Please input company Id')],
  COMPANY_NAME: [maxStringRule(150), requiredRule()],
  COMPANY_ADDRESS_1: [maxStringRule(150), requiredRule()],
  COMPANY_ADDRESS_2: [maxStringRule(150)],
  COMPANY_PHONE_1: [maxStringRule(50), requiredRule()],
  COMPANY_PHONE_2: [maxStringRule(50)],
  COMPANY_EMAIL: [maxStringRule(50), requiredRule(), emailRule()],
  NOTE: [maxStringRule(150)],
};

export default {
  companyRules,
};
