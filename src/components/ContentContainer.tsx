import { useEffect, useState } from "react"
import { VStack } from "@chakra-ui/react"

import NftDisplay from "./NftDisplay"
import TokenDisplay from "./TokenDisplay"
import ConnectWalletButton from "./ConnectWalletButton"
import MintNftButton from "./MintNftButton"
import CurrentAddressInfo from "./CurrentAddressInfo"

import config from "../../public/data/config.json"

import { ethers } from "ethers"
import { useAccount } from "wagmi"

export default function ContentContainer({ customRpc }) {
    const [nftId, setNftId] = useState(null)
    const [provider, setProvider] = useState(null)
    const [isMintTransactionConfirmed, setIsMintTransactionConfirmed] = useState(false)
    const [transactionHash, setTransactionHash] = useState("")

    const { address: connectedWalletAddress, isConnected } = useAccount()

    // UseEffect - Set JSON RPC provider
    useEffect(() => {
        setProvider(new ethers.JsonRpcProvider(customRpc ? customRpc : config.publicJsonRpc))
    }, [customRpc])

    return (
        <VStack w={"100vw"} alignItems={"center"} gap={5} px={3} pt={"20px"}>
            {isConnected ? <CurrentAddressInfo setNftId={setNftId} /> : <ConnectWalletButton />}
            {!nftId && (
                <MintNftButton
                    provider={isConnected ? provider : null}
                    nftId={nftId}
                    setIsMintTransactionConfirmed={setIsMintTransactionConfirmed}
                    setTransactionHash={setTransactionHash}
                />
            )}
            {connectedWalletAddress && (
                <>
                    <NftDisplay provider={provider} nftId={nftId} setNftId={setNftId} isMintTransactionConfirmed={isMintTransactionConfirmed} />
                    <TokenDisplay provider={provider} nftId={nftId} />
                </>
            )}
        </VStack>
    )
}
