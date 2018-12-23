const menuList = (baseStyles, { selectProps }) => {
  const newStyles = {
    ...baseStyles,
  };

  if (selectProps.isFirstLoad) {
    newStyles.height = 1;
  }

  return newStyles;
};

export default menuList;
