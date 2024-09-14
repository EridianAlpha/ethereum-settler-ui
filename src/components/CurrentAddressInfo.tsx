import { VStack, Text, HStack, Button } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faWallet } from "@fortawesome/free-solid-svg-icons"

import { useAccount, useDisconnect, useBalance } from "wagmi"
import { useEffect } from "react"

import { BigNumber } from "bignumber.js"

export default function CurrentAddressInfo({ setNftId }) {
    const { address: connectedWalletAddress } = useAccount()
    const { disconnect } = useDisconnect()

    const {
        data: balanceData,
        isError: balanceIsError,
        isLoading: balanceIsLoading,
    } = useBalance({
        address: connectedWalletAddress,
    })

    return (
        <HStack
            className="currentAddressInfoContainer"
            minH={"60px"}
            cursor={"default"}
            px={4}
            py={2}
            borderRadius={"20px"}
            gap={3}
            flexWrap={"wrap"}
            justifyContent={"center"}
        >
            <Text
                fontFamily={"monospace"}
                fontSize={"lg"}
                className="bgPage"
                py={1}
                px={3}
                borderRadius={"full"}
                whiteSpace="normal"
                overflow="visible"
                textOverflow="clip"
                wordBreak="break-word"
                textAlign={"center"}
            >
                <FontAwesomeIcon icon={faWallet} size={"lg"} />{" "}
                {`${connectedWalletAddress.substring(0, 7)}...${connectedWalletAddress.substring(connectedWalletAddress.length - 5)}`}
            </Text>
            <Text fontWeight={"bold"} fontSize={"lg"}>
                {Number(new BigNumber(balanceData?.value.toString()).shiftedBy(-18)).toFixed(4)} ETH
            </Text>
            <Button
                variant={"WalletButton"}
                aria-label={"Wallet button"}
                borderRadius={"full"}
                px={3}
                h={8}
                onClick={() => {
                    disconnect()
                    setNftId(null)
                }}
            >
                <HStack gap={3}>
                    <FontAwesomeIcon icon={faRightFromBracket} size={"lg"} />
                </HStack>
            </Button>
        </HStack>
    )
}
