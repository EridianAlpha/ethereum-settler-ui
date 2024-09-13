import { useEffect, useState } from "react"
import { VStack } from "@chakra-ui/react"

import NftDisplay from "./NftDisplay"
import TokenDisplay from "./TokenDisplay"
import ConnectWalletButton from "./ConnectWalletButton"
import CurrentAddressInfo from "./CurrentAddressInfo"

import { useAccount } from "wagmi"

export default function ContentContainer({ customRpc }) {
    const { address: connectedWalletAddress, isConnected } = useAccount()

    return (
        <VStack maxW={"100%"} alignItems={"center"} gap={10} mx={3}>
            {!isConnected && <ConnectWalletButton />}
            {connectedWalletAddress && (
                <>
                    <CurrentAddressInfo />
                    <NftDisplay customRpc={customRpc} />
                    <TokenDisplay customRpc={customRpc} />
                </>
            )}
        </VStack>
    )
}
