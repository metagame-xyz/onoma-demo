import { LogData, logError, logSuccess, logWarning } from './logging'

const fetchOptions = {
    // retry: 4,
    // pause: 1000,
    // callback: (retry: any) => {
    //     logWarning(fetchRetryLogData, `retry #${retry}`);
    // },
    body: null,
}

export class FetcherError extends Error {
    status: any
    statusText: any
    url: any
    bodySent: any
    constructor({ message, status, statusText, url, bodySent }) {
        super(message)
        this.name = 'Fetcher Error'
        this.status = status
        this.statusText = statusText
        this.url = url
        this.bodySent = bodySent
    }
    toJSON() {
        return {
            name: this.name,
            status: this.status,
            statusText: this.statusText,
            url: this.url,
            bodySent: this.bodySent,
            message: this.message,
        }
    }
}

const fetcherLogData: LogData = {
    level: 'error',
    function_name: 'fetcher',
    message: 'null??',
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
export async function fetcher(url: string, options = fetchOptions) {
    let retry = 3
    while (retry > 0) {
        const response: Response = await fetch(url, options)
        if (response.ok) {
            return response.json() as Promise<any>
        } else {
            const error = {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                bodySent: options.body ? JSON.parse(options.body) : null,
                message: await response.text(),
            }
            fetcherLogData.thrown_error = error
            logWarning(fetcherLogData, 'fetcher retry warning')
            retry--
            if (retry === 0) {
                logError(fetcherLogData, error)
                throw new FetcherError(error)
            }
            await sleep(2000)
        }
    }
}
