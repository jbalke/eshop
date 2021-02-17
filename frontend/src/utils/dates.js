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
    timeZone: 'UTC',
    timeZoneName: 'short',
  };

  return new Intl.DateTimeFormat('default', options).format(date);
};

export const getDate = (string) => {
  const date = new Date(string);

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('default', options).format(date);
};

export const toHTMLDateTime = (time) => {
  const isoTime = new Date(time).toISOString();
  return isoTime.substring(0, isoTime.lastIndexOf(':'));
};
