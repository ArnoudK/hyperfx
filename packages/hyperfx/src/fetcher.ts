/**
 * Fetch JSON
 */
export const fetcher = {
  post,
};

interface FetchResult<T> {
  result: T | undefined;
  /**
   * Status will be 0 if err is caused by an exception
   *
   */
  err: { status: number; name: string; cause: string | object } | undefined;
}

/**
 *
 * @param url
 * @param headers
 * @param requestInit modify all the request init params. {method} will always be post. If {headers} is specified it will override the {requestInit})
 * @returns {result} is successful otherwise {{error}}
 */
async function get<T>(
  url: string,
  headers: {} | undefined | undefined,
  requestInit: Partial<RequestInit> | null | undefined,
): Promise<FetchResult<T>> {
  let res: FetchResult<T> = { result: undefined, err: undefined };
  if (!requestInit) requestInit = {};

  requestInit.method = "GET";

  if (headers) {
    requestInit.headers = headers;
  }
  await fetch(url, requestInit)
    .then(async (val) => {
      if (val.ok && val.status >= 200 && val.status <= 299) {
        res.result = await val.json();
      } else {
        res.err = {
          name: `Status: ${val.status} => ${val.statusText}`,
          cause: "Request did not succees!",
          status: val.status,
        } as any;
      }
    })
    .catch((e) => {
      res.err = e;
      res.err!.status = 0;
    })
    .finally(() => {});
  return res;
}

/**
 *
 * @param url
 * @param body
 * @param headers
 * @param requestInit modify all the request init params. {method} will always be post. If {body} or {headers} is specified it will override the {requestInit})
 * @returns {result} is successful otherwise {{error}}
 */
async function post<T>(
  url: string,
  body: string | null | undefined,
  headers: {} | undefined | undefined,
  requestInit: Partial<RequestInit> | null | undefined,
): Promise<FetchResult<T>> {
  let res: FetchResult<T> = { result: undefined, err: undefined };
  if (!requestInit) requestInit = {};

  requestInit.method = "POST";
  if (body) {
    requestInit.body = body;
  }
  if (headers) {
    requestInit.headers = headers;
  }
  await fetch(url, requestInit)
    .then(async (val) => {
      if (val.ok && val.status >= 200 && val.status <= 299) {
        res.result = await val.json();
      } else {
        res.err = {
          name: `Status: ${val.status} => ${val.statusText}`,
          cause: "Request did not succees!",
          status: val.status,
        } as any;
      }
    })
    .catch((e) => {
      res.err = e;
      res.err!.status = 0;
    })
    .finally(() => {});
  return res;
}
