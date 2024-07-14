/**
 * Fetch JSON
 */
export const fetcher = {
  post,
  get,
};

interface FetchResult<T, K extends boolean> {
  succes: boolean;
  result: K extends true ? T : undefined;
  /**
   * Status will be 0 if err is caused by an exception
   *
   */
  err: K extends false
    ? { status: number; name: string; cause: string | object }
    : undefined;
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
  requestInit: Partial<RequestInit> | null | undefined
): Promise<FetchResult<T, boolean>> {
  if (!requestInit) requestInit = {};

  requestInit.method = "GET";

  if (headers) {
    requestInit.headers = headers;
  }
  try {
    const fetch_result = await fetch(url, requestInit);

    if (
      fetch_result.ok &&
      fetch_result.status >= 200 &&
      fetch_result.status <= 299
    ) {
      return {
        succes: true,
        err: undefined,
        result: await fetch_result.json(),
      };
    } else {
      return {
        succes: false,
        result: undefined,
        err: {
          name: `Status: ${fetch_result.status} => ${fetch_result.statusText}`,
          cause: "Request did not succees!",
          status: fetch_result.status,
        },
      };
    }
  } catch (e: any) {
    const res = {
      err: e,
      succes: false,
      result: undefined,
    };
    res.err.status = 0;
    return res;
  }
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
  requestInit: Partial<RequestInit> | null | undefined
): Promise<FetchResult<T, boolean>> {
  if (!requestInit) requestInit = {};

  requestInit.method = "POST";
  if (body) {
    requestInit.body = body;
  }
  if (headers) {
    requestInit.headers = headers;
  }
  try {
    const val = await fetch(url, requestInit);
    if (val.ok && val.status >= 200 && val.status <= 299) {
      return {
        succes: true,
        err: undefined,
        result: await val.json(),
      };
    } else {
      return {
        succes: false,
        result: undefined,
        err: {
          name: `Status: ${val.status} => ${val.statusText}`,
          cause: "Request did not succees!",
          status: val.status,
        },
      };
    }
  } catch (e: any) {
    const res = {
      err: e,
      succes: false,
      result: undefined,
    };
    res.err.status = 0;
    return res;
  }
}
