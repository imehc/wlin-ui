import React from "react";
import { Calendar } from '@wlintt/wlin-ui';

export default () => {
  return (
    <>
      <Calendar value={new Date()} locale="en-US" />
    </>
  );
};
