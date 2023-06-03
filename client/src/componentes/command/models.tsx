export interface Command {
  name: string
  params: Params
}

export interface Params {
  [key: string]: string
}
