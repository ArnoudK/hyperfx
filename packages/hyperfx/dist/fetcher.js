/**
 * Fetch JSON
 */
export const fetcher = {
    post,
    get,
};
/**
 *
 * @param url
 * @param headers
 * @param requestInit modify all the request init params. {method} will always be post. If {headers} is specified it will override the {requestInit})
 * @returns {result} is successful otherwise {{error}}
 */
async function get(url, headers, requestInit) {
    if (!requestInit)
        requestInit = {};
    requestInit.method = "GET";
    if (headers) {
        requestInit.headers = headers;
    }
    try {
        const fetch_result = await fetch(url, requestInit);
        if (fetch_result.ok &&
            fetch_result.status >= 200 &&
            fetch_result.status <= 299) {
            return {
                succes: true,
                err: undefined,
                result: await fetch_result.json(),
            };
        }
        else {
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
    }
    catch (e) {
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
async function post(url, body, headers, requestInit) {
    if (!requestInit)
        requestInit = {};
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
        }
        else {
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
    }
    catch (e) {
        const res = {
            err: e,
            succes: false,
            result: undefined,
        };
        res.err.status = 0;
        return res;
    }
}
//# sourceMappingURL=fetcher.js.map