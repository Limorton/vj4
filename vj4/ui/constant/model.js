import attachObjectMeta from './util/objectMeta';

export const USER_GENDER_MALE = 0;
export const USER_GENDER_FEMALE = 1;
export const USER_GENDER_OTHER = 2;
// export const USER_GENDERS = [USER_GENDER_MALE, USER_GENDER_FEMALE, USER_GENDER_OTHER];
export const USER_GENDER_RANGE = {
  [USER_GENDER_MALE]: 'Boy ♂',
  [USER_GENDER_FEMALE]: 'Girl ♀',
  [USER_GENDER_OTHER]: 'Other',
};
attachObjectMeta(USER_GENDER_RANGE, 'intKey', true);
export const USER_GENDER_ICONS = {
  [USER_GENDER_MALE]: '♂',
  [USER_GENDER_FEMALE]: '♀',
  [USER_GENDER_OTHER]: '?',
};
attachObjectMeta(USER_GENDER_ICONS, 'intKey', true);

export const USER_GRADE_0 = 0;
export const USER_GRADE_1 = 1;
export const USER_GRADE_2 = 2;
export const USER_GRADE_3 = 3;
export const USER_GRADE_4 = 4;
export const USER_GRADE_5 = 5;
export const USER_GRADE_6 = 6;
export const USER_GRADE_7 = 7;
export const USER_GRADE_8 = 8;
export const USER_GRADE_9 = 9;
export const USER_GRADE_10 = 10;
export const USER_GRADE_11 = 11;
export const USER_GRADE_12 = 12;

export const USER_GRADE_RANGE = {
  [USER_GRADE_0]: '其他',
  [USER_GRADE_1]: '一年级',
  [USER_GRADE_2]: '二年级',
  [USER_GRADE_3]: '三年级',
  [USER_GRADE_4]: '四年级',
  [USER_GRADE_5]: '五年级',
  [USER_GRADE_6]: '六年级',
  [USER_GRADE_7]: '七年级',
  [USER_GRADE_8]: '八年级',
  [USER_GRADE_9]: '九年级',
  [USER_GRADE_10]: '高一',
  [USER_GRADE_11]: '高二',
  [USER_GRADE_12]: '高三',
};
attachObjectMeta(USER_GRADE_RANGE, 'intKey', true);
