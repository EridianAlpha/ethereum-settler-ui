import { Text, Box, Image, Button, VStack } from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

import config from "../../public/data/config.json"

export default function ConnectWalletButton() {
    const { openConnectModal } = useConnectModal()
    const { address: connectedWalletAddress, isConnected } = useAccount()

    return (
        <Box position="relative" maxW={"500px"} w={"100%"} minH={{ base: "200px", sm: "500px" }}>
            <Image src={config.nftIpfsUrl} alt="Unminted NFT Image" borderRadius={"20px"} filter="grayscale(100%) brightness(30%)" />
            <VStack position="absolute" top={{ base: "40%", sm: "33%" }} left="50%" transform="translate(-50%, -50%)" minW="200px" w="100%" gap={0}>
                <Button
                    py={3}
                    px={8}
                    variant="ConnectWalletButton"
                    fontSize="2xl"
                    borderRadius="full"
                    h={"fit-content"}
                    whiteSpace="normal"
                    textAlign="center"
                    onClick={openConnectModal}
                    fontWeight={"extrabold"}
                >
                    <VStack gap={1}>
                        <Text>Connect wallet</Text>
                    </VStack>
                </Button>
                <Text fontSize="4xl" fontWeight={"bold"} color="white">
                    ↓
                </Text>
                <Button
                    py={3}
                    px={8}
                    variant={!isConnected ? "MintNftDisabledButton" : "ConnectWalletButton"}
                    fontSize="2xl"
                    borderRadius="full"
                    h={"fit-content"}
                    whiteSpace="normal"
                    textAlign="center"
                    onClick={openConnectModal}
                    fontWeight={"extrabold"}
                    filter="grayscale(100%) brightness(100%)"
                >
                    <VStack gap={1}>
                        <Text>View / Mint NFT</Text>
                    </VStack>
                </Button>
            </VStack>
        </Box>
    )
}
