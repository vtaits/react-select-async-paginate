const AVAILABLE_DELTA = 10;

const defaultShouldLoadMore = (scrollHeight, clientHeight, scrollTop) => {
  const bottomBorder = scrollHeight - clientHeight - AVAILABLE_DELTA;

  return bottomBorder < scrollTop;
};

export default defaultShouldLoadMore;
