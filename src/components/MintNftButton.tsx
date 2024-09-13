import { Text, Box, Image, Button, VStack } from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

import config from "../../public/data/config.json"

export default function MintNftButton({ nftId }) {
    const { openConnectModal } = useConnectModal()
    const { address: connectedWalletAddress, isConnected } = useAccount()

    return (
        <Box position="relative" maxW={"500px"} w={"100%"}>
            <Image src={config.nftIpfsUrl} alt="Unminted NFT Image" borderRadius={"20px"} filter="grayscale(100%) brightness(30%)" />
            <Button
                position="absolute"
                top={"20%"}
                left={"35%"}
                minH="150px"
                minW="150px"
                p={0}
                variant={nftId !== null ? "ConnectWalletButton" : "MintNftDisabledButton"}
                fontSize="2xl"
                borderRadius="full"
                whiteSpace="normal"
                textAlign="center"
                fontWeight={"extrabold"}
                filter={nftId !== null ? null : "grayscale(100%) brightness(100%)"}
                border={nftId !== null ? null : "2px solid"}
                color={"white"}
                textShadow={"0px 0px 5px black"}
            >
                Mint NFT
            </Button>
        </Box>
    )
}
