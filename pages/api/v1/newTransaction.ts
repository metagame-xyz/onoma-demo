import {
    isValidAlchemySignature,
    ioredisClient,
    timestampToDate,
    Metadata,
    getOldestTransaction,
    getTokenIdForAddress,
    zodiac,
} from '../../../utils/utils';
import {
    NETWORK,
    APP_NAME,
    CONTRACT_ADDRESS,
    CONTRACT_BIRTHBLOCK,
    VERCEL_URL,
} from '../../../utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';
import { formatUnits } from '@ethersproject/units';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        /**
         * During development, it's useful to un-comment this block
         * so you can test some of your code by just hitting this page locally
         *
         * return res.status(200).send({});
         */

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

    const newUserAddress = activity[0].fromAddress;
    // const newUserAddress = '0x17A059B6B0C8af433032d554B0392995155452E6';
    let { status, message, result } = await getOldestTransaction(newUserAddress);

    // check that etherscan API returned successfully
    if (status != 1) {
        console.log('Etherscan error getOldestTransaction. Message:', message);
        return res.status(400).send({ message, errorType: 'etherscan API' });
    }

    const oldestTxnData = {
        address: newUserAddress,
        blockNumber: result[0].blockNumber,
        fromAddress: result[0].from,
        timeStamp: result[0].timeStamp,
        hash: String(result[0].hash),
        value: Number(formatUnits(result[0].value, 'ether')),
    };

    let tokenIDsRawData;
    ({
        status,
        message,
        result: tokenIDsRawData,
    } = await getTokenIdForAddress(newUserAddress, CONTRACT_ADDRESS));

    // check that etherscan API returned successfully
    if (status != 1) {
        console.log('Etherscan error getTokenIdForAddress. Message:', message);
        return res.status(400).send({ message, errorType: 'etherscan API' });
    }

    const tokenId = tokenIDsRawData[0].tokenID;

    const dateObj = timestampToDate(oldestTxnData.timeStamp);

    const metadata: Metadata = {
        name: `Birthblock ${oldestTxnData.blockNumber}: ${oldestTxnData.hash.substring(6)}`,
        description: `A ${dateObj.year} ${zodiac(dateObj.day, dateObj.month)} wallet born at ${
            dateObj.hour
        }:${dateObj.minute}`,
        image: `${VERCEL_URL}/api/v1/image/${tokenId}`,
        external_url: `${VERCEL_URL}/birthblock/${tokenId}`,
        attributes: [
            {
                trait_type: 'year',
                value: dateObj.year,
            },
            {
                trait_type: 'month',
                value: dateObj.month,
            },
            {
                trait_type: 'day',
                value: dateObj.day,
            },
            {
                trait_type: 'hour',
                value: dateObj.hour,
            },
            {
                trait_type: 'minute',
                value: dateObj.minute,
            },
            {
                trait_type: 'second',
                value: dateObj.second,
            },
            {
                display_type: 'date',
                trait_type: 'birthday',
                value: oldestTxnData.timeStamp, // 1546360800
            },
            {
                trait_type: 'parent',
                value: oldestTxnData.fromAddress,
            },
            {
                trait_type: 'eth received',
                value: oldestTxnData.value, // 0.08 eth
            },
            {
                trait_type: 'block age',
                value: CONTRACT_BIRTHBLOCK - oldestTxnData.blockNumber,
            },
            {
                trait_type: 'birthblock',
                value: oldestTxnData.blockNumber,
            },
            {
                trait_type: 'txn hash',
                value: oldestTxnData.hash,
            },
            {
                trait_type: 'zodiac',
                value: zodiac(dateObj.day, dateObj.month),
            },
        ],
    };

    // index by wallet address
    await ioredisClient.hset(newUserAddress, { tokenId, metadata: JSON.stringify(metadata) });

    // index by tokenId
    await ioredisClient.hset(tokenId, {
        address: newUserAddress,
        metadata: JSON.stringify(metadata),
    });

    const data = await ioredisClient.hgetall(tokenId);

    res.status(200).send({ message: `${newUserAddress} added or updated with ${oldestTxnData}` });
}
