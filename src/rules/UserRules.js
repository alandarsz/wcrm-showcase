import { requiredRule } from '../helper/rules';


export const login = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, message: 'Username length should be at least 3 characters', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 4, message: 'Password length should be at least 4 characters', trigger: ['blur', 'change'] },
  ],
};

export const register = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, message: 'Username length should be at least 3 characters', trigger: ['blur', 'change'] },
  ],
  firstname: [
    { required: true, message: 'Please input first name', trigger: 'blur' },
  ],
  lastname: [
    { required: true, message: 'Please input last name', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input valid email address', trigger: ['blur', 'change'] },
  ],
  phone: [
    { required: true, message: 'Please input phone number', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 4, message: 'Password length should be at least 4 characters', trigger: ['blur', 'change'] },
  ],
};


const userRules = (status) => {
  return {
    COMPANY_USER_PHONE: [
      {
        required: true,
        message: 'Please input user phone',
        trigger: 'blur',
      },
      {
        min: 4,
        message: 'User id length should be at least 3 characters',
        trigger: ['blur', 'change'],
      },
    ],
    COMPANY_USER_PASSWORD: [
      { required: true, message: 'Password is required', trigger: 'blur' },
      {
        min: 4,
        message: 'Password length should be at least 4 characters',
        trigger: ['blur', 'change'],
      },
    ],
    PASSWORD_EXPIRED_DATE: [{ required: true, message: 'Please input password expired date', trigger: 'blur' }],
    USER_ID: [
      requiredRule(),
      {
        min: 5,
        message: 'User id length should be at least 5 characters',
        trigger: ['blur', 'change'],
      },
    ],
    USER_NAME: [
      requiredRule(),
      {
        min: 3,
        message: 'User id length should be at least 3 characters',
        trigger: ['blur', 'change'],
      },
    ],
    BRANCH_ID: [requiredRule()],
    ROLE_CODE: [requiredRule()],
    USER_PASSWORD: [
      requiredRule('Required field', status),
      {
        min: 4,
        message: 'Password length should be at least 4 characters',
        trigger: ['blur', 'change'],
      },
    ],
    PASSWORD_EXPIRED_DATE: [{ required: true, message: 'Please input password expired date', trigger: 'blur' }],
  };
};

const passwordChecker = (rule, value, callback) => {
  // // console.log(value);
};

export const changePassword = {
  USER_PASSWORD_OLD: [
    requiredRule(),
    {
      min: 4,
      message: 'Password length should be at least 4 characters',
      trigger: ['blur', 'change'],
    },
  ],
  USER_PASSWORD: [
    requiredRule(),
    {
      min: 4,
      message: 'Password length should be at least 4 characters',
      trigger: ['blur', 'change'],
    },
  ],
  USER_PASSWORD_CHECK: [
    requiredRule(),
    {
      min: 4,
      message: 'Password length should be at least 4 characters',
      trigger: ['blur', 'change'],
    },
  ],
};

export const userRulesAdd = userRules(true);
export const userRulesEdit = userRules(false);
