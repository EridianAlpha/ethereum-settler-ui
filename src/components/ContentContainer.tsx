import { useEffect, useState } from "react"
import { VStack, Text } from "@chakra-ui/react"

import NftDisplay from "./NftDisplay"
import TokenDisplay from "./TokenDisplay"
import ConnectWalletButton from "./ConnectWalletButton"
import MintNftButton from "./MintNftButton"
import CurrentAddressInfo from "./CurrentAddressInfo"
import CustomRpcInput from "./CustomRpcInput"

import config from "../../public/data/config.json"

import { ethers } from "ethers"
import { useAccount, useChainId } from "wagmi"

export default function ContentContainer({ wagmiProviderConfig, customRpc, setCustomRpc, useCustomRpc, setUseCustomRpc }) {
    const chainId = useChainId()
    const [nftId, setNftId] = useState(null)
    const [provider, setProvider] = useState(new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc))
    const [isMintTransactionConfirmed, setIsMintTransactionConfirmed] = useState(false)
    const [isContractDeployed, setIsContractDeployed] = useState(false)

    const { address: connectedWalletAddress, isConnected } = useAccount()

    // UseEffect - Set JSON RPC provider
    useEffect(() => {
        setProvider(new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc))
    }, [customRpc, chainId])

    // UseEffect - Check if contract is deployed on selected network
    useEffect(() => {
        setIsContractDeployed(
            config.chains[chainId].nftContractAddress && config.chains[chainId].nftContractAddress != "0x0000000000000000000000000000000000000000"
                ? true
                : false
        )
    }, [chainId])

    return (
        <VStack w={"100vw"} alignItems={"center"} gap={5} px={3} pt={"20px"}>
            {useCustomRpc && <CustomRpcInput setUseCustomRpc={setUseCustomRpc} customRpc={customRpc} setCustomRpc={setCustomRpc} />}
            {isConnected ? <CurrentAddressInfo setNftId={setNftId} /> : <ConnectWalletButton />}
            {!isContractDeployed && (
                <Text className={"errorText"} borderRadius={"20px"} px={2} py={1}>
                    Contract not deployed on selected network
                </Text>
            )}
            {isContractDeployed && !nftId && (
                <MintNftButton
                    wagmiProviderConfig={wagmiProviderConfig}
                    nftId={nftId}
                    setIsMintTransactionConfirmed={setIsMintTransactionConfirmed}
                />
            )}
            {isContractDeployed && connectedWalletAddress && (
                <>
                    <NftDisplay provider={provider} nftId={nftId} setNftId={setNftId} isMintTransactionConfirmed={isMintTransactionConfirmed} />
                    <TokenDisplay provider={provider} nftId={nftId} />
                </>
            )}
        </VStack>
    )
}
