import React, {
  CSSProperties,
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import classes from "./Articles.module.scss";
import { LoadedArticle } from "./Loaded";
import { Article } from "./Article";
import { useLoadArticles } from "./useLoadArticles";
import { useVirtualization } from "./useVirtualization";

const LOADER_COUNT = 15;
const LOADER_SIZE = 530;
const defaultLength = LOADER_SIZE * LOADER_COUNT;

const getStyle = (shift: number): CSSProperties => ({
  transform: `translateY(${shift}px)`,
});

const Loaders = () =>
  Array.from({ length: LOADER_COUNT }).map((_, index) => (
    <LoadedArticle key={index} />
  ));

let timer: NodeJS.Timeout;

export const Articles = () => {
  const [page, setPage] = useState(0);
  const listEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { cache, listLength, creatItemHandler } = useVirtualization({
    defaultLength,
  });
  const articles = useLoadArticles({ cache, page, listRef });
  const [scroll, setScroll] = useState(0);
  const nextPageObserver = useRef(
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((page) => page + 1);
      }
    }),
  );

  const scrollHandler: UIEventHandler = useCallback(({ currentTarget }) => {
    if (!timer)
      timer = setTimeout(() => {
        setScroll(currentTarget.scrollTop);
        timer = undefined;
      }, 80);
  }, []);

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
      onScroll={scrollHandler}
    >
      <div style={{ height: listLength }} className={classes.list}>
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
              ref={creatItemHandler}
            >
              <Article article={article} />
            </div>
          );
        })}
        <div style={getStyle(cache.at(-1))} ref={listEndRef}>
          <Loaders />
        </div>
      </div>
    </div>
  );
};
