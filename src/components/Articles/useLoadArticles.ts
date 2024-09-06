import { MutableRefObject, useEffect, useState } from "react";
import { articleApi } from "api/article";
import { ArticleT } from "api/article/types";

type Props = {
  page: number;
  listRef: MutableRefObject<HTMLDivElement>;
  listEndRef: MutableRefObject<HTMLDivElement>;
}
export const useLoadArticles = ({page, listEndRef, listRef}: Props) => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<(ArticleT | null)[]>([]);


  useEffect(() => {
    setLoading(true)
    if (!loading) articleApi.all({ offset: page * 15, limit: 15 })
      .then(({ data }) => {
        setArticles((articles) => [...articles, ...data.results,]);
        setLoading(false);
        if (listRef.current.scrollTop > listEndRef.current.offsetTop) listRef.current.scrollTo(0, listEndRef.current.offsetTop - window.innerHeight);
        console.log(listRef.current.scrollTop);
      }).catch(()=>{});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return articles;
}
