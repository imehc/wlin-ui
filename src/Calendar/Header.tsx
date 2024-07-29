import { format } from 'date-fns';
import React from "react";
import { useContext, type FC } from 'react';
import LocaleContext from './LocaleContext';
import allLocales from './locale';

interface HeaderProps {
  date: Date;
  onClickPrev(): void;
  onClickNext(): void;
  onClickToday(): void;
}

export const Header: FC<HeaderProps> = ({
  date,
  onClickPrev,
  onClickNext,
  onClickToday,
}) => {
  const localeContext = useContext(LocaleContext);
  const CalendarContext = allLocales[localeContext.locale];

  return (
    <div>
      <div className="flex items-center h-7 leading-7">
        <div
          className="w-7 h-7 leading-7 rounded-1/2 text-center text-xs select-none cursor-pointer mr-3 hover:bg-[#ccc]"
          onClick={onClickPrev}
        >
          &lt;
        </div>
        <div className="text-xl">{format(date, 'yyyy 年 MM 月')}</div>
        <div
          className="w-7 h-7 leading-7 rounded-1/2 text-center text-xs select-none cursor-pointer mx-3 hover:bg-[#ccc]"
          onClick={onClickNext}
        >
          &gt;
        </div>
        <button
          className="bg-[#eee] cursor-pointer b-0 py-0 px-4 leading-7 hover:bg-[#ccc]"
          onClick={onClickToday}
          type='button'
        >
          {CalendarContext.today}
        </button>
      </div>
    </div>
  );
};
