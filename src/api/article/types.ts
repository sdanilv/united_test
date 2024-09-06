export type ListResponse<Result> = {
  count: number
  next: string
  previous: null
  results: Result[]
}

export type ArticleT =  {
  id: number
  title: string
  url: string
  image_url: string
  news_site: string
  summary: string
  published_at: string
  updated_at: string
  featured: boolean
  launches: never[]
  events: never[]
}

export type ArticleRequest = {
  limit: number;
  offset: number;
}
