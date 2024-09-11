import React, { memo } from "react";
import classes from "./Articles.module.scss";
import { ArticleT } from "../../api/article/types";

export const Article = memo(({ article }: { article: ArticleT }) => (
    <article className={classes.article}>
      <img src={article.image_url} alt={article.title} className={classes.img}/>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
    </article>
));

