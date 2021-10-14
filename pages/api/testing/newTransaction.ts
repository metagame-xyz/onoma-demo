import { isValidAlchemySignature } from '../../../utils/utils';
import { NETWORK, APP_NAME } from '../../../utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(404).send({ message: '404' });
    }

    // check the message is coming from the right Alchemy account
    if (!isValidAlchemySignature(req)) {
        const message = 'invalid Alchemy Signature';
        console.log(message);
        return res.status(400).send({ message });
    }

    const { app, network, activity } = req.body;

    // check the message is coming from the right network in regards to what environment we're in (prod vs dev)
    if (network !== NETWORK) {
        const message = `expected the request's network (${network}) to match the environment's network (${NETWORK})`;
        console.log(message);
        return res.status(400).send({ message });
    }

    // check the message is for the app we're building for
    if (!app.includes(APP_NAME)) {
        const message = `expected the request for (${app}) to match the environment's app (${APP_NAME})`;
        console.log(message);
        return res.status(400).send({ message });
    }

    console.log('app:', app);
    console.log('network:', network);
    console.log('activity:', activity);

    res.status(200).send({ message: activity });
}
