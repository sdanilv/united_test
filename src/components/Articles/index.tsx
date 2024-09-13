import React, { CSSProperties, useRef } from "react";
import classes from "./Articles.module.scss";
import { LoadedArticle } from "./Loaded";
import { Article } from "./Article";
import { useLoadArticles } from "./useLoadArticles";
import { useCacheItemSize } from "components/Articles/useCacheItemSize";
import { usePerformScrollAction } from "./useScroll";

const LOADER_COUNT = 5;
const LOADER_SIZE = 530;
const defaultLength = LOADER_SIZE * LOADER_COUNT;
const VIRTUALIZATION_OVERSCAN = 1000;

const getStyle = (shift: number): CSSProperties => ({
  transform: `translateY(${shift}px)`,
});

const Loaders = () => Array.from({ length: LOADER_COUNT }).map((_, index) => (<LoadedArticle key={index} />));

export const Articles = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { cache, listLength, creatItemHandler } = useCacheItemSize({ defaultLength });
  const { articles, moreArticlesHandler } = useLoadArticles();
  const { scrollHandler, scroll } = usePerformScrollAction({
    action: moreArticlesHandler,
    offset: defaultLength,
  });

  return (
    <div
      className={classes.list_container}
      ref={listRef}
      onScroll={scrollHandler}
    >
      <div style={{ height: listLength }} className={classes.list}>
        {articles.map((article, index) => {
          const shift = cache[index];
          if (
            shift + VIRTUALIZATION_OVERSCAN < scroll ||
            shift - VIRTUALIZATION_OVERSCAN > scroll + window.innerHeight
          ) {
            return null;
          }

          return (
            <div
              style={getStyle(shift)}
              key={index}
              data-index={index}
              ref={creatItemHandler}
            >
              <Article article={article} />
            </div>
          );
        })}
        <div style={getStyle(cache.at(-1))}>
          <Loaders />
        </div>
      </div>
    </div>
  );
};
