import bcrypt from 'bcryptjs';

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

export function formatDate(date: Date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}

export function hashPassword(password: string) {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}