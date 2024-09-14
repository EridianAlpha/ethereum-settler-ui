import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Text } from "@chakra-ui/react"
import { BigNumber } from "bignumber.js"
import { useAccount } from "wagmi"

import config from "../../public/data/config.json"

export default function TokenDisplay({ provider, nftId }) {
    const [tokenBalance, setTokenBalance] = useState(0)

    const { address: connectedWalletAddress } = useAccount()

    useEffect(() => {
        let intervalId

        const fetchTokenBalance = async () => {
            const abi = ["function balanceOf(address account) view returns (uint256)"]
            const contract = new ethers.Contract(config.tokenContractAddress, abi, provider)

            try {
                const balance = await contract.balanceOf(connectedWalletAddress)
                const formattedBalance = Number(new BigNumber(balance).shiftedBy(-18))

                // Set the initial token balance
                setTokenBalance(formattedBalance)

                // Start the interval after fetching the initial balance
                intervalId = setInterval(() => {
                    // TODO: Update this increment to be the value of TOKEN_EMISSION_RATE shifted by -18 from the contract

                    // If an nftId exists increment the token balance
                    nftId && setTokenBalance((prevBalance) => prevBalance + 1)
                }, 1000)
            } catch (error) {
                console.error("Error fetching token balance:", error)
            }
        }

        // Fetch the initial balance
        if (provider && connectedWalletAddress) fetchTokenBalance()

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId)
    }, [provider, connectedWalletAddress, nftId])

    return <Text>Token Balance: {tokenBalance}</Text>
}
