export type RequestLog = {
  id?: null | number;
  method: string;
  url: string;
  user_agent: null | string;
};

export type DBProxy = {
  request_log: RequestLog[];
};
