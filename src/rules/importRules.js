import { requiredRule } from '../helper/rules';

export const importData = {
    REPORT_DATE: [requiredRule()],
    REPORT_FILE: [requiredRule()],
};

export const importTutorialData = {
    REPORT_FILE: [requiredRule()],
};

export default {
    importData,
    importTutorialData
};
