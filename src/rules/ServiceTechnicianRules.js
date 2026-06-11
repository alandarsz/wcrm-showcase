import { maxStringRule } from '../helper/rules';
import { requiredRule } from '../helper/rules';

export const addServiceTechnicianRules = {
  TECHNICIAN_NAME: [requiredRule(), maxStringRule(50)],
  TECHNICIAN_PHONE_NO: [requiredRule(), maxStringRule(50)],
  TECHNICIAN_ADDRESS: [requiredRule(), maxStringRule(150)],
};

export const editServiceTechnicianRules = {
  ...addServiceTechnicianRules,
  TECHNICIAN_ID: [requiredRule()],
};

export default {
  addServiceTechnicianRules,
  editServiceTechnicianRules,
};
