export const uomRules = {
  UOM_ID: [
    {
      required: true,
      message: 'Please input uom id',
      trigger: 'blur',
    },
  ],
  UOM_NAME: [
    {
      required: true,
      message: 'Please input uom name',
      trigger: 'blur',
    },
    {
      min: 1,
      message: 'uom name length should be at least 1 characters',
      trigger: ['blur', 'change'],
    },
  ],
  NOTE: [
    {
      max: 300,
      message: 'Note length should be at max 300 characters',
      trigger: ['blur', 'change'],
    },
  ],
};

export default {
  uomRules,
};
