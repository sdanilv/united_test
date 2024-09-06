import axios from "axios";
import { ArticleT, ArticleRequest, ListResponse } from "./types";

export const articleApi = {
  all: (params: ArticleRequest) => axios.get<ListResponse<ArticleT>>("https://api.spaceflightnewsapi.net/v4/articles/", { params })
};
