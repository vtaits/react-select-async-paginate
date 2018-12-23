const menu = (baseStyles, { selectProps }) => {
  const newStyles = {
    ...baseStyles,
  };

  if (selectProps.isFirstLoad) {
    newStyles.opacity = 0;
  }

  return newStyles;
};

export default menu;
