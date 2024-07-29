import { Calendar } from '@wlintt/wlin-ui';
import React from 'React';

export default () => {
  return (
    <>
      <Calendar value={new Date()} locale="en-US" />
    </>
  );
};
