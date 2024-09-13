import { UIEventHandler, useCallback, useState } from "react";

const DEFAULT_SCORE = 50;

let timer: NodeJS.Timeout;
let score = DEFAULT_SCORE;

type Props = { action: () => void; offset?: number };

export const usePerformScrollAction = ({ action, offset }: Props) => {
  const [scroll, setScroll] = useState(0);

  const scrollHandler: UIEventHandler = useCallback(
    ({ currentTarget: { scrollTop } }) => {

      if(score) {
        clearTimeout(timer);
        score--;
      }
      else score = DEFAULT_SCORE
      timer = setTimeout(() => {
        setScroll(scrollTop);
        if (scrollTop > offset - window.innerHeight) {
          action();
        }
      }, 80);
    },
    [action, offset],
  );

  return { scroll, scrollHandler };
};
