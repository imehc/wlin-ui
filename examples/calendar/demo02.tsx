import React from "react";
import { Calendar } from '@wlintt/wlin-ui';
import { format } from 'date-fns';

export default () => {
  return (
    <>
      <Calendar
        value={new Date()}
        dateRender={(value) => (
          <div>
            <p style={{ background: 'yellowgreen', height: '50px' }}>
              {format(value, 'yyyy-MM-dd')}
            </p>
          </div>
        )}
      />
    </>
  );
};
