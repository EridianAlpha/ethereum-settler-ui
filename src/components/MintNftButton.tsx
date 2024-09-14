import { useEffect, useState } from "react"
import { Text, Box, Image, Button, VStack } from "@chakra-ui/react"
import { mainnet } from "wagmi/chains"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { http, createConfig } from "@wagmi/core"
import { ethers } from "ethers"

import config from "../../public/data/config.json"

export default function MintNftButton({ provider, nftId, setIsMintTransactionConfirmed, setTransactionHash }) {
    const [transactionState, setTransactionState] = useState({
        isWaitingForSignature: false,
        isConfirming: false,
        isConfirmed: false,
        hash: null,
        error: null,
    })

    const { address: connectedWalletAddress } = useAccount()
    const { data: hash, error, writeContract } = useWriteContract()

    // Create a config object for the transaction
    const txConfig = createConfig({
        chains: [mainnet],
        transports: {
            [mainnet.id]: http(provider?._getConnection().url),
        },
    })

    // Use the useWaitForTransactionReceipt hook to check the status of the transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash,
        config: txConfig,
    })

    const handleTransaction = async () => {
        try {
            // Settlement NFT contract ABI
            const abi = [
                {
                    inputs: [],
                    name: "mint",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
            ]

            setTransactionState({ ...transactionState, error: null, isWaitingForSignature: true })

            const txObject = {
                address: config.nftContractAddress as `0x${string}`,
                abi: abi,
                functionName: "mint",
                args: [],
                chain: mainnet,
                account: connectedWalletAddress as `0x${string}`,
            }

            console.log("Waiting for signature on transaction: \n", txObject)

            writeContract(txObject, {
                onSuccess: async () => {
                    console.log("Transaction sent to network.")
                },
            })
        } catch (err) {
            console.error(err)
            setTransactionState({ ...transactionState, error: err.message, isWaitingForSignature: false })
        }
    }

    useEffect(() => {
        if (isConfirming && !transactionState?.isConfirming) {
            console.log("Transaction is confirming...")
            setTransactionState({ ...transactionState, error: null, hash: hash, isWaitingForSignature: false, isConfirming: true })
            setTransactionHash(hash)
        }
        if (isConfirmed && !transactionState?.isConfirmed) {
            console.log("Transaction confirmed: ", hash)
            setIsMintTransactionConfirmed(true)
            setTransactionState({ ...transactionState, error: null, isWaitingForSignature: false, isConfirming: false, isConfirmed: true })
        }
        if (error && !transactionState?.error) {
            console.log("Error:", error)
            setTransactionState({
                ...transactionState,
                error: error.message,
                isWaitingForSignature: false,
                isConfirming: false,
                isConfirmed: false,
            })
        }
    }, [isConfirming, isConfirmed, error, hash, transactionState])

    return (
        <Box position="relative" maxW={"500px"} w={"100%"}>
            <Image src={config.nftIpfsUrl} alt="Unminted NFT Image" borderRadius={"20px"} filter="grayscale(100%) brightness(30%)" />
            <Button
                position="absolute"
                transform="translate(-50%, -50%)"
                top={{ base: "40%", sm: "35%" }}
                left="50%"
                minH="150px"
                minW="150px"
                p={0}
                variant={nftId !== null ? "RainbowButton" : "MintNftDisabledButton"}
                className={nftId !== null ? "rainbowButtonAnimationOffset" : null}
                fontSize="2xl"
                borderRadius="full"
                whiteSpace="normal"
                textAlign="center"
                fontWeight={"extrabold"}
                filter={nftId !== null ? null : "grayscale(100%) brightness(100%)"}
                border={nftId !== null ? null : "2px solid"}
                color={"white"}
                textShadow={"0px 0px 5px black"}
                onClick={handleTransaction}
            >
                Mint NFT
            </Button>
        </Box>
    )
}
