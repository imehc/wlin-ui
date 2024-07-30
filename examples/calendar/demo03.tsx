import React from "react";
import { Calendar } from '@wlintt/wlin-ui';
import { format } from 'date-fns';

export default () => {
  return (
    <>
      <Calendar
        value={new Date()}
        dateInnerContent={(value) => (
          <div>
            <p style={{ background: 'yellowgreen', height: '30px' }}>
              {format(value, 'yyyy-MM-dd')}
            </p>
          </div>
        )}
      />
    </>
  );
};
