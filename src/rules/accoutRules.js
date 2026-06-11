import { requiredRule } from '../helper/rules';

export const addAccount = {
    ACCOUNT_CODE: [requiredRule()],
    ACCOUNT_DESC: [requiredRule()],
    ACCOUNT_GROUP_ID: [requiredRule()],
    ACCOUNT_ISALLOW: [requiredRule()],
};

export const updateAccount = addAccount

export default {
    addAccount,
    updateAccount
};
