import { createHmac } from 'crypto'
import { IPFS } from 'ipfs-core-types'
import { create } from 'ipfs-http-client'

import { WEBSITE_URL } from './constants'

export function getTruncatedAddress(address: string): string {
    if (address && address.startsWith('0x')) {
        return address.substr(0, 4) + '...' + address.substr(address.length - 4)
    }
    return address
}

export function debug(varObj: object): void {
    Object.keys(varObj).forEach((str) => {
        console.log(`${str}:`, varObj[str])
    })
}

export const event = (action: string, params?: Object) => {
    // window.gtag('event', action, params);
}

export type EventParams = {
    network?: string
    buttonLocation?: string
    connectionType?: string
    connectionName?: string
    errorReason?: string
    errorMessage?: string
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const signMessage = (body, token) => {
    const hmac = createHmac('sha256', token) // Create a HMAC SHA256 hash using the auth token
    hmac.update(JSON.stringify(body), 'utf8') // Update the token hash with the request body using utf8
    const digest = hmac.digest('hex')
    return digest
}

const updateImageFetchOptions = (EVENT_FORWARDER_AUTH_TOKEN: string, body: { ipfsUrl: string }) => ({
    method: 'post',
    body: JSON.stringify(body),
    headers: {
        'content-type': 'application/json',
        'x-event-forwarder-signature': signMessage(body, EVENT_FORWARDER_AUTH_TOKEN),
    },
})

async function fetcher(url: string, options) {
    let retry = 3
    while (retry > 0) {
        const response: Response = await fetch(url, options)
        if (response.ok) {
            return response.json() as Promise<any>
        } else {
            retry--
            if (retry === 0) {
                throw new Error(`Failed to fetch ${url}`)
            }
            await sleep(2000)
        }
    }
}
