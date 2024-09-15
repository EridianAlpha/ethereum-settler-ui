import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Text, HStack, VStack, Button, Image } from "@chakra-ui/react"
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

        // Fetch the initial balance
        if (
            config.chains[chainId].tokenContractAddress &&
            config.chains[chainId].tokenContractAddress != "0x0000000000000000000000000000000000000000"
        ) {
            fetchTokenBalance()
        } else {
            setTokenBalance(0)
        }

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
            <HStack flexWrap={"wrap"} justifyContent={"center"}>
                <Button boxSize={10} onClick={addTokenToMetaMask} borderRadius={"full"}>
                    <Image minW={"25px"} src="./images/MetaMaskLogo.png" />
                </Button>
                <Text fontWeight={"bold"}>SETTLER</Text>
                <Text fontWeight={"bold"} fontFamily={"monospace"} fontSize={"lg"} className="bgPage" px={3} py={1} borderRadius={20}>
                    {tokenBalance.toFixed(2)}
                </Text>
            </HStack>
            <Text>Earn {tokenEmissionRate} SETTLER per second by holding a SETTLEMENT NFT</Text>
        </VStack>
    )
}
