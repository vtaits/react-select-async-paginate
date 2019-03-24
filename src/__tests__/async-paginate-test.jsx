import React from 'react';
import { shallow } from 'enzyme';

import AsyncPaginateBase from '../async-paginate-base';
import AsyncPaginate from '../async-paginate';

const defaultProps = {
  loadOptions: Function.prototype,
};

class PageObject {
  constructor(props) {
    this.wrapper = shallow(
      <AsyncPaginate
        {...defaultProps}
        {...props}
      />,
    );
  }

  setState(...args) {
    return this.wrapper.setState(...args);
  }

  state(...args) {
    return this.wrapper.state(...args);
  }

  getBaseNode() {
    return this.wrapper.find(AsyncPaginateBase);
  }
}

const setup = (props) => new PageObject(props);

test('should custom prop AsyncPaginateBase', () => {
  const page = setup({
    customProp: 'test',
  });

  const baseNode = page.getBaseNode();

  expect(baseNode.prop('customProp')).toBe('test');
});

test('should provide inputValue to AsyncPaginateBase', () => {
  const page = setup({});

  page.setState({
    inputValue: 'test',
  });

  const baseNode = page.getBaseNode();

  expect(baseNode.prop('inputValue')).toBe('test');
});

test('should change inputValue from AsyncPaginateBase', async () => {
  const page = setup({});

  await page.getBaseNode().prop('onInputChange')('test');

  expect(page.state('inputValue')).toBe('test');
});
