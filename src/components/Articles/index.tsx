import React, { useEffect, useRef, useState } from "react";
import classes from "./Articles.module.scss";
import { LoadedArticle } from "components/Articles/Loaded";
import { Article } from "components/Articles/Article";
import { useLoadArticles } from "components/Articles/useLoadArticles";

const Loaders = () => Array.from({ length: 15 }).map(() => <LoadedArticle/>);

export const Articles = () => {
  const [page, setPage] = useState(0);
  const listEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const articles = useLoadArticles({ listRef, page, listEndRef });
  const nextPageObserver = useRef(new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) setPage(page => page + 1);
  }));

  useEffect(() => {
    const observer = nextPageObserver.current;
    observer.observe(listEndRef.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className={classes.list} ref={listRef}>
      {articles.map((article) =>
        <Article article={article} key={article.id}/>
      )}
      <div className={classes.loading} ref={listEndRef}>
        <Loaders/>
      </div>
    </div>
  );
};
