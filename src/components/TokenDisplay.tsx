import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { VStack, HStack, Text } from "@chakra-ui/react"

import { BigNumber } from "bignumber.js"

export default function TokenDisplay() {
    const [tokenBalance, setTokenBalance] = useState(0)

    useEffect(() => {
        let intervalId

        const fetchTokenBalance = async () => {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
            const contractAddress = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be"
            const abi = ["function balanceOf(address account) view returns (uint256)"]
            const contract = new ethers.Contract(contractAddress, abi, provider)

            try {
                const balance = await contract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
                const formattedBalance = Number(new BigNumber(balance).shiftedBy(-18))

                // Set the initial token balance
                setTokenBalance(formattedBalance)

                // Start the interval after fetching the initial balance
                intervalId = setInterval(() => {
                    // TODO: Update this increment to be the value of TOKEN_EMISSION_RATE shifted by -18 from the contract
                    setTokenBalance((prevBalance) => prevBalance + 1)
                }, 1000)
            } catch (error) {
                console.error("Error fetching token balance:", error)
            }
        }

        // Fetch the initial balance
        fetchTokenBalance()

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId)
    }, [])

    return <Text>Token Balance: {tokenBalance}</Text>
}
