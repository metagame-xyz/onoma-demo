import React from 'react'

import { Avatar, Box, Button, Flex, Heading, HStack, Spacer, Text, useBreakpointValue } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { addressToName } from 'onoma'

import { copy } from 'utils/content'

import { Etherscan, Logo, Opensea, Twitter } from 'components/Icons'

const CustomButton = () => (
    <>
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal }) =>
                !account ? (
                    <button onClick={openConnectModal} type="button">
                        Connect Wallet
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: 12 }}>
                        {chain && (
                            <button
                                onClick={openChainModal}
                                style={{ display: 'flex', alignItems: 'center' }}
                                type="button"
                            >
                                {chain.iconUrl && (
                                    <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 12, height: 12, marginRight: 4 }}
                                    />
                                )}
                                {chain.name ?? chain.id}
                                {chain.unsupported && ' (unsupported)'}
                            </button>
                        )}
                        <button onClick={openAccountModal} type="button">
                            {account.ensName || addressToName(account.address)}
                        </button>
                    </div>
                )
            }
        </ConnectButton.Custom>
    </>
)

function Navbar(props) {
    // const { userName, openWeb3Modal, avatarUrl } = useEthereum();
    const userName = null
    const openWeb3Modal = (a) => {}
    const avatarUrl = null

    const showName = useBreakpointValue({ base: false, md: true })

    return (
        <Flex width="100%" bgColor="transparent" boxShadow="md">
            <HStack as="nav" width="100%" margin="auto" justify="center" align="center" p={4} {...props}>
                <HStack align="center" spacing={2} pr={[0, 2]}>
                    <Logo boxSize={10} />
                    {showName && (
                        <Heading as="h1" fontSize="34px">
                            {copy.title}
                        </Heading>
                    )}
                </HStack>
                <Spacer />
                <HStack align="center" spacing={[3, 4, 5, 6]}>
                    {userName ? (
                        <Box bgColor="brand.700" color="white" px={4} py={3} borderRadius="full">
                            <HStack>
                                {avatarUrl && <Avatar size="xs" src={`${avatarUrl}`} />}
                                <Text>{userName}</Text>
                            </HStack>
                        </Box>
                    ) : (
                        <ConnectButton />
                        // <Button
                        //     onClick={() => openWeb3Modal('Navbar')}
                        //     fontWeight="normal"
                        //     colorScheme="brand"
                        //     bg="brand.700"
                        //     size="lg"
                        //     boxShadow="lg"
                        //     fontSize="2xl"
                        //     borderRadius="full">
                        //     Connect
                        // </Button>
                    )}
                </HStack>
            </HStack>
        </Flex>
    )
}

export default Navbar
