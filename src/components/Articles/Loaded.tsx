import React, { memo } from "react";
import classes from "components/Articles/Loaded.module.scss";

export const LoadedArticle = memo(() => (
  <article className={classes.article}>
    <div className={classes.img}/>
    <div className={classes.text} />
    <div className={classes.text} />
    <div className={classes.text} />
  </article>
));
