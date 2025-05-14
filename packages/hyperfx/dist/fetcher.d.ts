/**
 * Fetch JSON
 */
export declare const fetcher: {
    post: typeof post;
    get: typeof get;
};
interface FetchResult<T, K extends boolean> {
    succes: K;
    result: K extends true ? T : undefined;
    /**
     * Status will be 0 if err is caused by an exception
     *
     */
    err: K extends false ? {
        status: number;
        name: string;
        cause: string | object;
    } : undefined;
}
/**
 *
 * @param url
 * @param headers
 * @param requestInit modify all the request init params. {method} will always be post. If {headers} is specified it will override the {requestInit})
 * @returns {result} is successful otherwise {{error}}
 */
declare function get<T>(url: string, headers: {} | undefined | undefined, requestInit: Partial<RequestInit> | null | undefined): Promise<FetchResult<T, boolean>>;
/**
 *
 * @param url
 * @param body
 * @param headers
 * @param requestInit modify all the request init params. {method} will always be post. If {body} or {headers} is specified it will override the {requestInit})
 * @returns {result} is successful otherwise {{error}}
 */
declare function post<T>(url: string, body: string | null | undefined, headers: {} | undefined | undefined, requestInit: Partial<RequestInit> | null | undefined): Promise<FetchResult<T, boolean>>;
export {};
