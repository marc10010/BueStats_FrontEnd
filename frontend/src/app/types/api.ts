export interface ApiResponse<T> {
    errorCode: number;
    errorMessage: string;
    response: T
}

export interface optionsMap{
    index: string;
    value: string
}

export interface Team{
    team: string;
}

export interface dialogData{
    title: string;
    msg: string;
}

export interface Language {
    name: string,
    code: string,
    flag: string
  }
  