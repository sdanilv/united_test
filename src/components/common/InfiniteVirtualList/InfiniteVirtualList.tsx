import React, { CSSProperties, ReactNode, useRef } from "react";
import classes from "./InfiniteVirtualList.module.scss";
import { useCacheItemSize } from "./useCacheItemSize";
import { usePerformScrollAction } from "./usePerformScrollAction";

const getStyle = (shift: number): CSSProperties => ({
  transform: `translateY(${shift}px)`,
});

type Props<Item> = {
  overScanHeight?: number;
  defaultHeight?: number;
  loaders?: ReactNode;
  renderItem: (item: Item) => ReactNode;
  list: Item[];
  moreItemsHandler: () => void;
  className?: string;
};

export const InfiniteVirtualList = <Item,>({
  overScanHeight = 1000,
  defaultHeight = 0,
  loaders,
  list,
  renderItem,
  moreItemsHandler,
  className,
}: Props<Item>) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { cache, listHeight, creatItemHandler } = useCacheItemSize({
    defaultHeight,
  });
  const { scrollHandler, scroll } = usePerformScrollAction({
    action: moreItemsHandler,
    offset: cache.at(-1),
  });

  return (
    <div className={`${className} ${classes.list_wrapper}`} ref={listRef} onScroll={scrollHandler}>
      <div style={{ height: listHeight }} className={classes.list}>
        {list.map((item, index) => {
          const shift = cache[index];
          if (
            shift + overScanHeight < scroll ||
            shift - overScanHeight > scroll + window.innerHeight
          ) {
            return null;
          }

          return (
            <div
              style={getStyle(shift)}
              key={index}
              data-index={index}
              ref={creatItemHandler}
              className={classes.item}
            >
              {renderItem(item)}
            </div>
          );
        })}
        <div style={getStyle(cache.at(-1))} className={classes.item}>
          {loaders}
        </div>
      </div>
    </div>
  );
};
