import { storiesOf } from '@storybook/react';

import Simple from './Simple';
import SelectFetchBase from './SelectFetchBase';

storiesOf('react-select-fetch', module)
  .add('Simple', Simple)
  .add('SelectFetchBase', SelectFetchBase);
