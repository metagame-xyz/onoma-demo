import type { NextApiRequest, NextApiResponse } from 'next';

import { startOpenseaForceUpdateLoop } from '@api/queues/openseaForceUpdate';

import { isValidEventForwarderSignature } from '@utils';
import { clickableIPFSLink } from '@utils/frontend';
import { LogData, logError, logSuccess } from '@utils/logging';
import { getMetadata, Metadata, updateMetadata } from '@utils/metadata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(404).send({});
    }
    /****************/
    /*     AUTH     */
    /****************/
    if (!isValidEventForwarderSignature(req)) {
        const error = 'invalid event-forwarder Signature';
        // logger.error({ error }); TODO
        return res.status(403).send({ error });
    }

    const { tokenId, ipfsUrl } = req.body;

    const logData: LogData = {
        level: 'info',
        function_name: 'updateImage',
        message: `begin`,
        token_id: tokenId,
    };

    try {
        logData.third_party_name = 'redis';
        const oldMedata = await getMetadata(tokenId);

        logData.wallet_address = oldMedata.address;

        const metadata: Metadata = {
            ...oldMedata,
            image: ipfsUrl,
        };

        await updateMetadata(metadata, tokenId, oldMedata.address);

        logData.third_party_name = 'queue';
        const jobData = await startOpenseaForceUpdateLoop(tokenId, ipfsUrl);

        logData.job_data = jobData;
        logSuccess(logData, clickableIPFSLink(ipfsUrl));
    } catch (error) {
        logError(logData, error);
        return res.status(500).send({ error });
    }

    return res.status(200).send({});
}
