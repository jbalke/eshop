export const formatDataTime = (string) => {
  const date = new Date(string);

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };

  return new Intl.DateTimeFormat('default', options).format(date);
};
