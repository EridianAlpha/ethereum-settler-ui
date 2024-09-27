import { VStack, Text, Link, HStack, Box, Image } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import { useAccount } from "wagmi"

import config from "../../public/data/config.json"
import getRandomTreeEmoji from "../utils/TreeEmojis"

export default function SettlementCard({ index, data: settlement }) {
    const { address: connectedWalletAddress } = useAccount()

    const getRandomTreeCount = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    if (settlement.trees) {
        return (
            <VStack key={index} h="100%" gap={5} w={"100%"}>
                <HStack justifyContent="space-between" w="100%">
                    {Array.from({ length: getRandomTreeCount(6, 9) }).map((_, treeIndex) => (
                        <Text key={treeIndex}>{getRandomTreeEmoji()}</Text>
                    ))}
                </HStack>
                <HStack justifyContent="space-around" w="100%">
                    {Array.from({ length: getRandomTreeCount(6, 9) }).map((_, treeIndex) => (
                        <Text key={treeIndex}>{getRandomTreeEmoji()}</Text>
                    ))}
                </HStack>
            </VStack>
        )
    } else {
        return (
            <HStack w={"100%"} justifyContent={"center"}>
                <HStack
                    className="bgPage"
                    gap={3}
                    pr={{ base: 0, sm: 5 }}
                    w="fit-content"
                    borderRadius={"20px"}
                    overflow={"hidden"}
                    flexWrap={{ base: "wrap", sm: "nowrap" }}
                    justifyContent={{ base: "center", sm: "start" }}
                    pb={{ base: 3, sm: 0 }}
                    border={connectedWalletAddress === settlement.owner ? "6px solid gold" : "none"}
                >
                    <Box position="relative" maxW={{ base: "200px", sm: "125px" }} minW={{ base: "200px", sm: "125px" }}>
                        <Image src={config.localNftImage} alt="Settlement NFT Image" w="100%" borderRadius={{ base: "20px", sm: "0px" }} />
                        <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            bg="#201649"
                            color="white"
                            fontSize="3xl"
                            fontWeight="bold"
                            fontFamily={"monospace"}
                            px={3}
                            borderRadius="full"
                            whiteSpace={"nowrap"}
                        >
                            #{settlement.tokenId}
                        </Box>
                    </Box>
                    <VStack w={"100%"} gap={2} alignItems={{ base: "center", sm: "start" }} pl={{ base: 0, sm: 1 }}>
                        <HStack mt={"-12px"} justifyContent={{ base: "space-around", sm: "space-between" }} w={"100%"} fontWeight={"semibold"}>
                            <HStack>
                                <Image h={"40px"} borderRadius={"full"} src={config.chains[settlement.chainId].iconUrl} alt="Chain Icon" />
                                <Text>{config.chains[settlement.chainId]?.name}</Text>
                            </HStack>
                            <HStack>
                                <Text fontSize={"4xl"} mb={"8px"}>
                                    🏕️
                                </Text>
                                <Text>{settlement.days} days</Text>
                            </HStack>
                        </HStack>
                        <HStack mt={"-15px"}>
                            <Text fontWeight={"semibold"}>SETTLER Tokens: </Text>
                            <Text
                                fontWeight={"semibold"}
                                fontFamily={"monospace"}
                                fontSize={"lg"}
                                className="bgContent"
                                mr={{ base: 0, sm: 5, md: 0 }}
                                px={3}
                                py={1}
                                borderRadius={20}
                            >
                                {settlement.tokens.toLocaleString()}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight={"semibold"}>Owner: </Text>
                            <Link
                                as={NextLink}
                                href={`${config.chains[settlement.chainId].blockExplorerUrl}/address/${settlement.owner}`}
                                color={"blue"}
                                textDecoration={"underline"}
                                target={"_blank"}
                                fontFamily={"monospace"}
                                fontSize={"md"}
                            >
                                {`${settlement.owner.substring(0, 7)}...${settlement.owner.substring(settlement.owner.length - 5)}`}{" "}
                                <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                            </Link>
                        </HStack>
                    </VStack>
                </HStack>
            </HStack>
        )
    }
}
