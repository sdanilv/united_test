import React from "react";
import { LoadedArticle } from "./Loaded";
import { Article } from "./Article";
import { useLoadArticles } from "./useLoadArticles";
import { InfiniteVirtualList } from "components/common/InfiniteVirtualList/InfiniteVirtualList";
import classes from './Articles.module.scss';

const LOADER_COUNT = 5;

const Loaders = () =>
  Array.from({ length: LOADER_COUNT }).map((_, index) => (
    <LoadedArticle key={index} />
  ));

export const Articles = () => {
  const { articles, moreArticlesHandler } = useLoadArticles();

  return (
    <InfiniteVirtualList
      list={articles}
      renderItem={(article) => <Article article={article} />}
      moreItemsHandler={moreArticlesHandler}
      loaders={<Loaders />}
      className={classes.list_container}
    />
  );
};
