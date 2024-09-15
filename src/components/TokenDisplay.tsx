import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Text, HStack, VStack, Button, Image, Box } from "@chakra-ui/react"
import { BigNumber } from "bignumber.js"
import { useAccount, useChainId } from "wagmi"

import config from "../../public/data/config.json"

export default function TokenDisplay({ provider, nftId }) {
    const [tokenBalance, setTokenBalance] = useState(0)
    const [tokenEmissionRate, setTokenEmissionRate] = useState(0)

    const { address: connectedWalletAddress } = useAccount()
    const chainId = useChainId()

    useEffect(() => {
        let intervalId

        const fetchTokenBalance = async () => {
            const abi = ["function balanceOf(address account) view returns (uint256)", "function TOKEN_EMISSION_RATE() view returns (uint256)"]
            const contract = new ethers.Contract(config.chains[chainId].tokenContractAddress, abi, provider)

            try {
                const balance = await contract.balanceOf(connectedWalletAddress)
                const formattedBalance = Number(new BigNumber(balance).shiftedBy(-18))

                const tokenEmissionRate = await contract.TOKEN_EMISSION_RATE()
                const formattedTokenEmissionRate = Number(new BigNumber(tokenEmissionRate).shiftedBy(-18))

                setTokenBalance(formattedBalance)
                setTokenEmissionRate(formattedTokenEmissionRate)

                // Start the interval (20ms) after fetching the initial balance
                intervalId = setInterval(() => {
                    // If an nftId exists increment the token balance by 1/50th of the token emission rate
                    // so the token balance increases by the formattedTokenEmissionRate every second
                    nftId && setTokenBalance((prevBalance) => prevBalance + formattedTokenEmissionRate / 50)
                }, 20)
            } catch (error) {
                console.error("Error fetching token balance:", error)
            }
        }

        fetchTokenBalance()

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId)
    }, [provider, connectedWalletAddress, nftId, chainId])

    const addTokenToMetaMask = async () => {
        const tokenAddress = config.chains[chainId].tokenContractAddress
        const tokenSymbol = "SETTLER"
        const tokenDecimals = 18
        const tokenImage = config.nftIpfsUrl

        try {
            if (window.ethereum) {
                await window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: tokenAddress,
                            symbol: tokenSymbol,
                            decimals: tokenDecimals,
                            image: tokenImage,
                        },
                    },
                })
            }
        } catch (error) {
            console.error("Error adding token to MetaMask:", error)
        }
    }

    return (
        <VStack className={"tokenBalanceContainer"} px={5} py={2} borderRadius={"20px"} maxW={"500px"} textAlign={"center"}>
            <HStack w={"100%"} justifyContent={{ base: "space-around", sm: "center" }} position={"relative"}>
                <HStack gap={1}>
                    <Text fontWeight={"bold"}>SETTLER</Text>
                    <Text fontWeight={"bold"} fontFamily={"monospace"} fontSize={"lg"} className="bgPage" px={3} py={1} borderRadius={20}>
                        {tokenBalance.toFixed(2)}
                    </Text>
                </HStack>
                <Button
                    onClick={addTokenToMetaMask}
                    borderRadius={"full"}
                    h={8}
                    gap={1}
                    px={2}
                    position={{ base: "relative", sm: "absolute" }}
                    right={0}
                >
                    <Text>Add to </Text>
                    <Image w={"20px"} src="./images/MetaMaskLogo.png" />
                </Button>
            </HStack>
            <Text>Earn {tokenEmissionRate} SETTLER per second by holding a SETTLEMENT NFT</Text>
        </VStack>
    )
}
