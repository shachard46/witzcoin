export interface Command {
  name: string
  alias: string
  params: Params
}

export interface Params {
  [key: string]: string
}
