import { requiredRule } from '../helper/rules';

export const sale = {
  SALE_PERSON_NAME: [requiredRule()],
  SALE_PERSON_ADDRESS: [requiredRule()],
  SALE_PERSON_PHONE_NO: [requiredRule()],
};

export default {
  sale,
};
