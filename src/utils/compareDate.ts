import moment from 'moment';

const today = moment(new Date()).format('YYYY/MM');

export const compareDate = (date: string) => {
  const dateFormat = moment(date).format('YYYY/MM');

  if (new Date(dateFormat) < new Date(today)) {
    return true;
  } else {
    return false;
  }
};
