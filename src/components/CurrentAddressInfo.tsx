import { Text, HStack, Button, Image } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { faCopy } from "@fortawesome/free-regular-svg-icons"

import config from "../../public/data/config.json"

import { useChainModal } from "@rainbow-me/rainbowkit"
import { useChainId, useAccount, useDisconnect } from "wagmi"

export default function CurrentAddressInfo({ setNftId }) {
    const { address: connectedWalletAddress } = useAccount()
    const { disconnect } = useDisconnect()
    const { openChainModal } = useChainModal()
    const chainId = useChainId()

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
            <Button h={"100%"} borderRadius={"full"} onClick={openChainModal} pl={0} pr={2}>
                <HStack>
                    <Image h={"30px"} borderRadius={"full"} src={config.chains[chainId].iconUrl} />
                    <Text fontSize={"xl"}>{config.chains[chainId].name}</Text>
                </HStack>
            </Button>
            <HStack className="bgPage" gap={3} py={1} px={3} borderRadius={"full"}>
                <Text
                    fontFamily={"monospace"}
                    fontSize={"lg"}
                    whiteSpace="normal"
                    overflow="visible"
                    textOverflow="clip"
                    wordBreak="break-word"
                    textAlign={"center"}
                >
                    {`${connectedWalletAddress.substring(0, 7)}...${connectedWalletAddress.substring(connectedWalletAddress.length - 5)}`}
                </Text>
                <FontAwesomeIcon icon={faCopy} />
            </HStack>
            <Button
                variant={"WalletButton"}
                aria-label={"Wallet button"}
                borderRadius={"full"}
                px={0}
                h={8}
                onClick={() => {
                    disconnect()
                    setNftId(null)
                }}
            >
                <FontAwesomeIcon icon={faRightFromBracket} size={"lg"} />
            </Button>
        </HStack>
    )
}
