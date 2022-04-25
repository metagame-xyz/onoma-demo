import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import { AccordionButton, Box, Button, Heading, Link, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { addressToNameObject } from 'onoma'
import { useAccount } from 'wagmi'

import { copy } from 'utils/content'
import { debug, event } from 'utils/frontend'

import { maxW } from 'components/Layout'

function About({ heading, text }) {
    return (
        <VStack maxW={['sm', 'md', 'md', 'full']}>
            <Heading as="h2" fontSize="24px">
                {heading}
            </Heading>
            <Text align="center">{text}</Text>
        </VStack>
    )
}

function Home() {
    const [{ data: account, error, loading }] = useAccount({ fetchEns: true })

    return (
        <Box>
            <Head>
                <title>{copy.title}</title>
            </Head>
            <Box px={8} pt={8} width="fit-content" mx="auto" maxW={maxW}>
                <Heading as="h2" fontSize={[32, 48, 54]} textAlign="center" color="brand.900">
                    Human-readable names for hexadecimal addresses
                </Heading>
                <Heading as="h2" fontSize={[24, 32, 48]} textAlign="center" color="brand.900">
                    What is Onoma?
                </Heading>
                <Text fontSize={[16, 20, 24]} textAlign="center" color="brand.900">
                    {`Onoma is an npm package to turn any EVM wallet address into a human-readable name. During Metagame's
                    work on making transactions easier to read, we found ourselves using the first 6 Hex characters of
                    an address as the wallet/contract's "name" when an address didn’t have an ENS associated with it.
                    This is much harder to make an association with than a real name, so thought we'd give every wallet
                    a name.`}
                </Text>
                <Heading as="h2" fontSize={[24, 32, 48]} textAlign="center" color="brand.900">
                    Why is it called Onoma?
                </Heading>
                <Text fontSize={[16, 20, 24]} textAlign="center" color="brand.900">
                    Onomastics is the study of the history and origin of proper names, especially personal names.
                    (shoutout to @0xmts for the name)
                </Text>

                {account ? addressToNameObject(account.address).name : null}
            </Box>

            <VStack justifyContent="center" spacing={4} px={4} py={8}>
                {account ? <Box>name</Box> : <ConnectButton />}
            </VStack>
            <Box px={8} py={20} width="fit-content" margin="auto" maxW={maxW}>
                <Heading as="h1" fontSize={['24', '24', '36']} textAlign="center">
                    {copy.bottomSectionHeading}
                </Heading>
                <Text mt={4} fontWeight="light" maxW="xl">
                    {copy.bottomSectionText}
                    <Link isExternal href={'https://www.TheMetagame.xyz'}>
                        TheMetagame.xyz
                    </Link>
                </Text>
            </Box>
        </Box>
    )
}

export default Home

{
    /* <Button
loadingText="Minting..."
fontWeight="normal"
colorScheme="brand"
bgColor="brand.600"
// color="brand.900"
_hover={{ bg: 'brand.500' }}
size="lg"
height="60px"
minW="xs"
boxShadow="lg"
fontSize="4xl"
borderRadius="full"
>
{account?.address ? 'connected ' : 'Connect Wallet'}
</Button> */
}
