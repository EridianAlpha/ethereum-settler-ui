import { VStack, Text, HStack, Button } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"

import { useAccount, useDisconnect } from "wagmi"

export default function CurrentAddressInfo() {
    const { address: connectedWalletAddress, isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    return (
        <VStack gap={3} cursor={"default"}>
            <HStack className="currentAddressInfoContainer" p={4} borderRadius={"20px"} gap={3} flexWrap={"wrap"} justifyContent={"center"}>
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
                    {connectedWalletAddress}
                </Text>
                <Button
                    variant={"WalletButton"}
                    aria-label={"Wallet button"}
                    borderRadius={"full"}
                    px={3}
                    h={8}
                    onClick={() => {
                        disconnect()
                    }}
                >
                    <HStack gap={3}>
                        <Text>Disconnect</Text>
                        <FontAwesomeIcon icon={faRightFromBracket} size={"lg"} />
                    </HStack>
                </Button>
            </HStack>
        </VStack>
    )
}
