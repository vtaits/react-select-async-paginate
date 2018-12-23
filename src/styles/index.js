import menu from './menu';
import menuList from './menu-list';

export const mergeStylesItem = (base, additional) => {
  if (!additional) {
    return base;
  }

  return (baseStyles, ...rest) => {
    const intermediateStyles = base(baseStyles, ...rest);
    const newStyles = additional(intermediateStyles, ...rest);

    return newStyles;
  };
};

const mergeStyles = (styles) => ({
  ...styles,
  menu: mergeStylesItem(menu, styles.menu),
  menuList: mergeStylesItem(menuList, styles.menuList),
});

export default mergeStyles;
