const settings = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  staleTime: 120000, // 2 mins,
  requestTimeout: 180000, // 3 mins
  idleTimeout: 3000, // 3 sec
  rowsPerPage: 10,
  messageDuration: 3,
  defaultLanguage: "en",
  project: {},
} as const;

export default settings;
