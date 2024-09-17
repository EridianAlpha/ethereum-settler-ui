import { useEffect, useState } from "react"
import { VStack, Text, Box, Image, Button, Spinner, Link, useToast } from "@chakra-ui/react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi"
import NextLink from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

import config from "../../public/data/config.json"

export default function MintNftButton({ wagmiProviderConfig, nftId, setIsMintTransactionConfirmed }) {
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [transactionState, setTransactionState] = useState({
        isWaitingForSignature: false,
        isConfirming: false,
        isConfirmed: false,
        hash: null,
        error: null,
    })

    const chainId = useChainId()
    const { address: connectedWalletAddress } = useAccount()
    const { data: hash, error, writeContract } = useWriteContract()

    // Create a toast to display transaction status notifications
    const toast = useToast()

    // Use the useWaitForTransactionReceipt hook to check the status of the transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash,
        config: wagmiProviderConfig,
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
                address: config.chains[chainId].nftContractAddress as `0x${string}`,
                abi: abi,
                functionName: "mint",
                args: [],
                chain: wagmiProviderConfig,
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
        }
        if (isConfirmed && !transactionState?.isConfirmed) {
            console.log("Transaction confirmed: ", hash)
            toast({
                title: "Mint transaction confirmed!",
                description: (
                    <Text pt={1}>
                        View on{" "}
                        <Link
                            className="bgPage"
                            py={"2px"}
                            px={"8px"}
                            borderRadius={"full"}
                            as={NextLink}
                            href={`${config.chains[chainId].blockExplorerUrl}/tx/${hash}`}
                            color={"blue"}
                            textDecoration={"underline"}
                            target="_blank"
                        >
                            block explorer <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>
                    </Text>
                ),
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
                variant: "solid",
                containerStyle: {
                    bg: "green",
                    borderRadius: "15px",
                },
            })
            setIsMintTransactionConfirmed(true)
            setTransactionState({ ...transactionState, error: null, isWaitingForSignature: false, isConfirming: false, isConfirmed: true })
        }
        if (error && !transactionState?.error) {
            console.log("Error:", error)
            toast({
                title: "Transaction error!",
                description: error.message.split("\n")[0],
                status: "success",
                duration: 10000,
                isClosable: true,
                position: "top-right",
                variant: "solid",
                containerStyle: {
                    bg: "red",
                    borderRadius: "15px",
                },
            })

            setTransactionState({
                ...transactionState,
                error: error.message,
                isWaitingForSignature: false,
                isConfirming: false,
                isConfirmed: false,
            })
        }
    }, [isConfirming, isConfirmed, error, hash, transactionState, chainId, toast, setIsMintTransactionConfirmed])

    return (
        <Box position="relative" maxW={"500px"} w={"100%"}>
            <Image
                src={config.nftIpfsUrl}
                alt="Unminted NFT Image"
                borderRadius={"20px"}
                filter="grayscale(100%) brightness(30%)"
                onLoad={() => setIsImageLoaded(true)}
            />
            {isImageLoaded && (
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
                    onClick={nftId === null || transactionState.isWaitingForSignature || transactionState.isConfirming ? null : handleTransaction}
                    pointerEvents={nftId === null || transactionState.isWaitingForSignature || transactionState.isConfirming ? "none" : "auto"}
                >
                    {transactionState.isWaitingForSignature && (
                        <VStack gap={0}>
                            <Text pt={5}>Sign tx in</Text>
                            <Text pb={4}>your wallet</Text>
                            <Spinner size={"lg"} speed="0.8s" />
                        </VStack>
                    )}
                    {transactionState.isConfirming && (
                        <VStack gap={4} pt={12}>
                            <Text>Confirming</Text>
                            <Spinner size={"lg"} speed="0.8s" />
                        </VStack>
                    )}
                    {!transactionState.isWaitingForSignature && !transactionState.isConfirming && <Text>Mint NFT</Text>}
                </Button>
            )}
        </Box>
    )
}
