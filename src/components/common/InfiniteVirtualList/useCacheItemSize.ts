import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  defaultHeight?: number;
};

export const useCacheItemSize = ({ defaultHeight }: Props) => {
  const [cache, setCache] = useState<Array<number>>([0]);
  const [listHeight, setListHeight] = useState(defaultHeight);

  const mutationObserver = useRef<ResizeObserver>(
    new ResizeObserver((entries) => {
      entries.forEach(({ target, borderBoxSize }) => {
        const index = +target.getAttribute("data-index");
        const size = borderBoxSize[0].blockSize;


        if (size) {
          setCache((cache) => {
            const newCache = [...cache];
            const next = index + 1;

            if (newCache[next]) {
              const delta = size + newCache[index] - newCache[next];

              if (delta <= 0) return cache;
              setListHeight((listLength) => listLength + delta);

              for (let j = next; j < newCache.length; j++) {
                newCache[j] = newCache[j] + delta;
              }
            } else {
              setListHeight((listLength) => listLength + size);

              if (newCache[index] === undefined) {
                newCache[index] = newCache[index - 1];
              }
              newCache[next] = index ? size + newCache[index] : size;
            }
            return newCache;
          });
        } else {
          mutationObserver.current.unobserve(target);
        }
      });
    }),
  );

  const creatItemHandler = useCallback((element: Element) => {
    if (element) mutationObserver.current.observe(element);
  }, []);

  useEffect(() => {
    const observer = mutationObserver.current;
    return () => {
      observer.disconnect();
    };
  }, []);

  return { cache, listHeight, creatItemHandler };
};
