import React, { CSSProperties, useEffect, useRef, useState } from "react";
import classes from "./Articles.module.scss";
import { LoadedArticle } from "components/Articles/Loaded";
import { Article } from "components/Articles/Article";
import { useLoadArticles } from "components/Articles/useLoadArticles";

const LOADER_COUNT = 15;
const LOADER_SIZE = 530;
const LOADERS_SIZE = LOADER_SIZE * LOADER_COUNT;

const getStyle = (shift: number): CSSProperties => ({
  transform: `translateY(${shift}px)`,
});

const Loaders = () =>
  Array.from({ length: LOADER_COUNT }).map((_, index) => (
    <LoadedArticle key={index} />
  ));

export const Articles = () => {
  const [page, setPage] = useState(0);
  const listEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const nextPageObserver = useRef(
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((page) => page + 1);
        }
      },
      { rootMargin: "-800px 0px 800px 0px" },
    ),
  );
  const [cache, setCache] = useState<Array<number>>([0]);
  const articles = useLoadArticles({ cache, page, listRef });
  const [listLength, setListLength] = useState(LOADERS_SIZE);
  const [scroll, setScroll] = useState(0);

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
              setListLength((listLength) => listLength + delta);

              for (let j = next; j < newCache.length; j++) {
                newCache[j] = newCache[j] + delta;
              }
            } else {
              setListLength((listLength) => listLength + size);

              if (!newCache[index]) newCache[index] = newCache[index - 1];
              newCache[next] = index ? size + newCache[index] : size;
            }
            return newCache;
          });
        } else mutationObserver.current.unobserve(target);
      });
    }),
  );

  useEffect(() => {
    const observer = nextPageObserver.current;
    observer.observe(listEndRef.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div
      className={classes.list_container}
      ref={listRef}
      onScroll={({ currentTarget }) => {
        setScroll(currentTarget.scrollTop);
      }}
    >
      <div
        style={{ height: listLength, position: "relative" }}
        className={classes.list}
      >
        {articles.map((article, index) => {
          const shift = cache[index];
          if (
            shift + 1000 < scroll ||
            shift - 1000 > scroll + window.innerHeight
          ) {
            return null;
          }

          return (
            <div
              style={getStyle(shift)}
              key={index}
              data-index={index}
              ref={(elem) => {
                if (elem) {
                  mutationObserver.current.observe(elem);
                }
              }}
            >
              <Article article={article} key={article.id}/>
            </div>
          );
        })}
        <div style={getStyle(cache.at(-1))} ref={listEndRef}>
          <Loaders/>
        </div>
      </div>
    </div>
  );
};
