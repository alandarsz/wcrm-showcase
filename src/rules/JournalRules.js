import { requiredRule, maxStringRule, maxNumberRule, minNumberRule } from '../helper/rules';

export const addJournalRules = {
  JOURNAL_DATE: [requiredRule()],
  JOURNAL_SOURCE_TYPE_ID: [requiredRule()],
  JOURNAL_REMARK: [],
};

export const addJournalLineRules = {
  JOURNAL_NO: [requiredRule()],
  JOURNAL_LINE_SEQ_NO: [],
  JOURNAL_LINE_ACCOUNT_ID: [requiredRule()],
  JOURNAL_LINE_REMARK: [],
};

export default {
  addJournalRules,
  addJournalLineRules,
};
