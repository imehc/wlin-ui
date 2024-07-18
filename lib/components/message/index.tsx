import { createRef, FC, forwardRef, ReactNode, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { useTimer } from '../../index';
import { useStore } from './use-message';
import './index.css';

export type Position = 'top' | 'bottom';

export interface MessageProps
  extends Pick<React.HTMLAttributes<HTMLElement>, 'style' | 'className'> {
  content: ReactNode | string;
  duration?: number;
  onClose?: (...args: any) => void;
  id?: number;
  position?: Position;
}
const MessageItem: FC<MessageProps> = (item) => {
  const { onMouseEnter, onMouseLeave } = useTimer({
    id: item.id!,
    duration: item.duration,
    remove: item.onClose!,
  });

  return (
    <div
      className="mb-4 px-4 py-2 text-sm pointer-events-auto shadow"
      border="1 solid #ccc"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {item.content}
    </div>
  );
};

export interface MessageRef
  extends Omit<ReturnType<typeof useStore>, 'messageList'> {}

export const MessageProvider = forwardRef<MessageRef, {}>((props, ref) => {
  const { messageList, add, update, remove, clearAll } = useStore('top');

  const positions = useMemo(
    () => Object.keys(messageList) as Position[],
    [messageList]
  );

  if ('current' in ref!) {
    ref.current = {
      add,
      update,
      remove,
      clearAll,
    };
  }

  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     add,
  //     update,
  //     remove,
  //     clearAll,
  //   }),
  //   [add, update, remove, clearAll]
  // );

  const messageWrapper = (
    <div className="fixed w-full h-full pointer-events-none flex flex-col justify-start items-center">
      {positions.map((direction) => (
        <TransitionGroup
          key={direction}
          className={clsx('absolute', [
            direction === 'top' ? 'top-5' : 'bottom-5',
          ])}
        >
          {messageList[direction].map((item) => {
            const nodeRef = createRef<HTMLElement>();
            return (
              <CSSTransition
                key={item.id}
                timeout={1000}
                classNames="message"
                nodeRef={nodeRef}
              >
                <MessageItem onClose={remove} {...item} />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      ))}
    </div>
  );

  const el = useMemo(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return el;
  }, []);

  return createPortal(messageWrapper, el);
});
