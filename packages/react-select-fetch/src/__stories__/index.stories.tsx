import React from 'react';
import { storiesOf } from '@storybook/react';

import Simple from './Simple';
import ManualControl from './ManualControl';

storiesOf('react-select-fetch', module)
  .add('Simple', () => <Simple />)
  .add('Manual control', () => <ManualControl />);
