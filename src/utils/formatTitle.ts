export const formatTitle = (title: string) => {
  const clean = title.replace(/[^A-Za-z0-9\s]/g, ' ');

  console.log('CLEAN: ', clean);

  return clean
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};