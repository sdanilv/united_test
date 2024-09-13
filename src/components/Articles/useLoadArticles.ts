import { useCallback, useEffect, useRef, useState } from "react";
import { articleApi } from "api/article";
import { ArticleT } from "api/article/types";

const COUNT = 10;

export const useLoadArticles = () => {
  const loading = useRef(false);
  const [articles, setArticles] = useState<(ArticleT | null)[]>([]);
  const [page, setPage] = useState(0);

  const moreArticlesHandler = useCallback( () => {
    if (!loading.current) {
      loading.current = true;
      setPage((page) => page + 1);
      articleApi
        .all({ offset: page * COUNT, limit: COUNT })
        .then(({ data }) => {
          setArticles((articles) => [...articles, ...data.results]);
          loading.current = false;
        })
        .catch(() => {});
    }
  }, [page]);

  useEffect(() => {
    moreArticlesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { articles, moreArticlesHandler };
};
