import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
    AccordionButton,
    Box,
    Button,
    Center,
    Divider,
    Heading,
    Link,
    SimpleGrid,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    useInterval,
    VStack,
} from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'
import { addressToName, addressToNameObject, NameObject } from 'onoma'
import { useAccount } from 'wagmi'

import { copy } from 'utils/content'
import { debug, event } from 'utils/frontend'

import { maxW } from 'components/Layout'

function Home() {
    const { data: account, error } = useAccount()
    const name = account ? addressToNameObject(account.address) : null
    let [randomName, setRandomName] = useState(addressToName(ethers.Wallet.createRandom().address))
    let [scrolled, setScrolled] = useState(false)

    console.log('rendering home')

    const nameTableRef = useRef(null)

    const executeScroll = () => nameTableRef.current?.scrollIntoView({ behavior: 'smooth' })

    function getAndSetRandomAddress() {
        const wallet = ethers.Wallet.createRandom()
        const name = addressToName(wallet.address)
        setRandomName(name)
        console.log('name', name, Date.now())
    }

    useInterval(
        () => {
            getAndSetRandomAddress()
            setScrolled(false)
        },
        account ? null : 1200,
    )

    useEffect(() => {
        if (account && !scrolled) {
            console.log('executing scroll')
            executeScroll()
            setScrolled(true)
        }
    }, [account])

    return (
        <Box>
            <Head>
                <title>{copy.title}</title>
            </Head>
            <Box px={4} pt={4} mx="auto" maxW={maxW}>
                <Heading fontSize={[32, 48, 54]} textAlign="center" my={8}>
                    Human-readable names for hexadecimal addresses
                </Heading>
            </Box>
            <Heading py={12} mb={4} bg="brand.700" fontSize={[20, 28, 36]} textAlign="center" color="brand.100">
                {!account && randomName}
                {account && name?.name}
            </Heading>
            <Box px={4} pt={8} mx="auto" maxW={maxW}>
                <Heading fontSize={[28, 32, 48]} mb={4}>
                    What is Onoma?
                </Heading>
                <Text fontSize={[20, 20, 24]} mb={12}>
                    {`Onoma is an npm package to turn any EVM wallet address into a human-readable name. During Metagame's
                    work on making transactions easier to read, we found ourselves using the first 6 Hex characters of
                    an address as the wallet/contract's "name" when an address didn’t have an ENS associated with it.
                    This is much harder to make an association with than a real name, so thought we'd give every wallet
                    a name.`}
                </Text>
                <Heading fontSize={[28, 32, 48]} mb={4}>
                    Why is it called Onoma?
                </Heading>
                <Text fontSize={[20, 20, 24]} mb={12}>
                    {`Onomastics is the study of the history and origin of proper names, especially personal names.
                    (shoutout to `}
                    <Link isExternal textDecor="underline" href="https://twitter.com/0xmts">
                        @0xmts
                    </Link>
                    {` for the name)`}
                </Text>
                <Heading fontSize={[28, 32, 48]} mb={4}>
                    {`What is my address's Onoma?`}
                </Heading>
                <Text fontSize={[20, 20, 24]} mb={12}>
                    {!account && `Connect your wallet to find out!`}
                </Text>
                {account && (
                    <>
                        <Heading
                            ref={nameTableRef}
                            textAlign="center"
                            fontSize={[20, 24, 28]}
                            mb={4}
                        >{`${name.prefix} ${name.firstName} ${name.middleName} ${name.lastName}`}</Heading>
                        <TableContainer margin="auto" maxW="sm" mb={12}>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Component</Th>
                                        <Th>Value</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>Title</Td>
                                        <Td>{name.prefix}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>First Name</Td>
                                        <Td>{name.firstName}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Middle Name</Td>
                                        <Td>{name.middleName}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Last Name</Td>
                                        <Td>{name.lastName}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </>
                )}
                <Box borderRadius={3} bg="brand.700" h={2}></Box>
            </Box>
            <Box px={8} py={12} width="fit-content" margin="auto" maxW={maxW}>
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
//
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
