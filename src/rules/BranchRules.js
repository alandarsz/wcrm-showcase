import { requiredRule } from '../helper/rules';
import { maxStringRule } from '../helper/rules';
import { emailRule } from '../helper/rules';

export const branchRules = {
  COMPANY_ID: [requiredRule('Please input company Id')],
  BRANCH_NAME: [maxStringRule(150), requiredRule()],
  BRANCH_ADDRESS_1: [maxStringRule(150), requiredRule()],
  BRANCH_ADDRESS_2: [maxStringRule(150)],
  BRANCH_PHONE_1: [maxStringRule(50), requiredRule()],
  BRANCH_PHONE_2: [maxStringRule(50)],
  BRANCH_EMAIL: [maxStringRule(50), requiredRule(), emailRule()],
  BRANCH_NOTE: [maxStringRule(150)],
};

export default {
  branchRules,
};

// const requiredValMsg = () => {
//   ('This field is required');
// };
// code above will return `BRANCH_NAME is required`
