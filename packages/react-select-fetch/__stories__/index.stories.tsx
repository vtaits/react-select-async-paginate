import { storiesOf } from '@storybook/react';

import Simple from './Simple';
import ManualControl from './ManualControl';
import InitialOptions from './InitialOptions';
import CreatableWithNewOptions from './CreatableWithNewOptions';

storiesOf('react-select-fetch', module)
  .add('Simple', () => <Simple />)
  .add('Manual control', () => <ManualControl />)
  .add('Initial options', () => <InitialOptions />)
  .add('Creatable with adding new options', () => <CreatableWithNewOptions />);
