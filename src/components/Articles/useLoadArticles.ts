import { MutableRefObject, useEffect, useState } from "react";
import { articleApi } from "api/article";
import { ArticleT } from "api/article/types";

const COUNT = 15;

type Props = {
  page: number;
  cache: number[];
  listRef: MutableRefObject<HTMLDivElement>;
};

export const useLoadArticles = ({ page, cache, listRef }: Props) => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<(ArticleT | null)[]>([]);

  useEffect(() => {
    setLoading(true);
    console.log("=>setLoading");

    if (!loading) {
      articleApi
        .all({ offset: page * COUNT, limit: COUNT })
        .then(({ data }) => {
          setArticles((articles) => [...articles, ...data.results]);
          setLoading(false);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return articles;
};
