import { useEffect, useState } from "react"
import { VStack } from "@chakra-ui/react"

import NftDisplay from "./NftDisplay"
import TokenDisplay from "./TokenDisplay"
import ConnectWalletButton from "./ConnectWalletButton"
import MintNftButton from "./MintNftButton"
import CurrentAddressInfo from "./CurrentAddressInfo"

import { useAccount } from "wagmi"

export default function ContentContainer({ customRpc }) {
    const [nftId, setNftId] = useState(null)

    const { address: connectedWalletAddress, isConnected } = useAccount()

    return (
        <VStack w={"100vw"} alignItems={"center"} gap={5} px={3} pt={"20px"}>
            {isConnected ? <CurrentAddressInfo setNftId={setNftId} /> : <ConnectWalletButton />}
            {!isConnected && !nftId && <MintNftButton nftId={nftId} />}
            {connectedWalletAddress && (
                <>
                    <NftDisplay customRpc={customRpc} nftId={nftId} setNftId={setNftId} />
                    <TokenDisplay customRpc={customRpc} nftId={nftId} />
                </>
            )}
        </VStack>
    )
}
