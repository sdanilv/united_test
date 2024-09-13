import { UIEventHandler, useCallback, useState } from "react";

let timer: NodeJS.Timeout;

type Props = { action: () => void; offset?: number };

export const usePerformScrollAction = ({action, offset}: Props) => {
  const [scroll, setScroll] = useState(0);
  const scrollHandler: UIEventHandler = useCallback(
    ({ currentTarget: { scrollTop, scrollHeight } }) => {
      if (!timer) {
        timer = setTimeout(() => {
          setScroll(scrollTop);
          timer = undefined;
          if (scrollTop > scrollHeight - offset - window.innerHeight) {
            action();
          }
        }, 40);
      }
    },
    [action, offset],
  );

  return { scroll, scrollHandler };
};
