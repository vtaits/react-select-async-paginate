import React from 'react';
import { storiesOf } from '@storybook/react';

import Simple from './Simple';
import Multi from './Multi';
import Creatable from './Creatable';
import CreatableWithNewOptions from './CreatableWithNewOptions';
import InitialOptions from './InitialOptions';
import Autoload from './Autoload';
import Debounce from './Debounce';
import RequestByPageNumber from './RequestByPageNumber';
import CustomScrollCheck from './CustomScrollCheck';
import GroupedOptions from './GroupedOptions';
import Manual from './Manual';

storiesOf('react-select-async-paginate', module)
  .add('Simple', () => <Simple />)
  .add('Multi', () => <Multi />)
  .add('Creatable', () => <Creatable />)
  .add('Creatable with adding new options', () => <CreatableWithNewOptions />)
  .add('Intial options', () => <InitialOptions />)
  .add('Autoload', () => <Autoload />)
  .add('Debounce', () => <Debounce />)
  .add('Request by page number', () => <RequestByPageNumber />)
  .add('Customization check of the need of load options', () => <CustomScrollCheck />)
  .add('Grouped options', () => <GroupedOptions />)
  .add('Manual control of input value and menu opening', () => <Manual />);
