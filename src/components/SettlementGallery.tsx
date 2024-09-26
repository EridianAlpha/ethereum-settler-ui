import { useEffect, useState } from "react"
import { VStack, Text, HStack, Box, Input, InputGroup, InputRightElement, IconButton, Divider } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useAccount } from "wagmi"
import { Masonry } from "masonic"

import SettlementCard from "./SettlementCard"
import ChainCheckbox from "./ChainCheckbox"

import config from "../../public/data/config.json"

type Settlement = {
    owner: string
    days: string
    tokens: number
    chainId: number
    tokenId: number
}
type Tree = { trees: true }
type ProcessedSettlement = Settlement | Tree

export default function SettlementGallery() {
    const { address: connectedWalletAddress } = useAccount()

    const [isGalleryExpanded, setIsGalleryExpanded] = useState(true)
    const [processedSettlements, setProcessedSettlements] = useState<ProcessedSettlement[]>([])
    const [calculating, setCalculating] = useState(true)
    const [settlementOwnerFilter, setSettlementOwnerFilter] = useState("")
    const [chainIdFilter, setChainIdFilter] = useState([])
    const [settlements, setSettlements] = useState<ProcessedSettlement[]>([
        {
            owner: "0xDE7ff8092c91503cd468aBb2DEb115a91fE83c26",
            days: "77",
            tokens: 123456,
            chainId: 8453,
            tokenId: 1,
        },
        {
            owner: "0x9ca44BDA52cACb3a4F7fB3ED46498a00698238e1",
            days: "52",
            tokens: 654321,
            chainId: 8453,
            tokenId: 2,
        },
        {
            owner: "0xF83ff8092c91503cd468aBb2DEb115a91fE83c99",
            days: "90",
            tokens: 789123,
            chainId: 8453,
            tokenId: 3,
        },
        {
            owner: "0xDE7ff8092c91503cd468aBb2DEb115a91fE83c26",
            days: "120",
            tokens: 123456,
            chainId: 84532,
            tokenId: 4,
        },
        {
            owner: "0xAB2ff8092c91503cd468aBb2DEb115a91fE83bF1",
            days: "52",
            tokens: 654321,
            chainId: 17000,
            tokenId: 5,
        },
        {
            owner: "0xF83ff8092c91503cd468aBb2DEb115a91fE83c99",
            days: "90",
            tokens: 789123,
            chainId: 8453,
            tokenId: 6,
        },
        {
            owner: "0xDE7ff8092c91503cd468aBb2DEb115a91fE83c26",
            days: "120",
            tokens: 123456,
            chainId: 84532,
            tokenId: 7,
        },
        {
            owner: "0xAB2ff8092c91503cd468aBb2DEb115a91fE83bF1",
            days: "52",
            tokens: 654321,
            chainId: 17000,
            tokenId: 8,
        },
        {
            owner: "0xF83ff8092c91503cd468aBb2DEb115a91fE83c99",
            days: "90",
            tokens: 789123,
            chainId: 8453,
            tokenId: 9,
        },
        {
            owner: "0x9ca44BDA52cACb3a4F7fB3ED46498a00698238e1",
            days: "77",
            tokens: 123456,
            chainId: 17000,
            tokenId: 10,
        },
        {
            owner: "0xAB2ff8092c91503cd468aBb2DEb115a91fE83bF1",
            days: "52",
            tokens: 654321,
            chainId: 8453,
            tokenId: 11,
        },
        {
            owner: "0xF83ff8092c91503cd468aBb2DEb115a91fE83c99",
            days: "90",
            tokens: 789123,
            chainId: 84532,
            tokenId: 12,
        },
        {
            owner: "0xDE7ff8092c91503cd468aBb2DEb115a91fE83c26",
            days: "1200",
            tokens: 123456,
            chainId: 8453,
            tokenId: 13,
        },
        {
            owner: "0xAB2ff8092c91503cd468aBb2DEb115a91fE83bF1",
            days: "1200",
            tokens: 654321,
            chainId: 84532,
            tokenId: 14,
        },
        {
            owner: "0xF83ff8092c91503cd468aBb2DEb115a91fE83c99",
            days: "90",
            tokens: 789123,
            chainId: 8453,
            tokenId: 15,
        },
        {
            owner: "0xDE7ff8092c91503cd468aBb2DEb115a91fE83c26",
            days: "120",
            tokens: 123456,
            chainId: 17000,
            tokenId: 16,
        },
        {
            owner: "0xAB2ff8092c91503cd468aBb2DEb115a91fE83bF1",
            days: "52",
            tokens: 654321,
            chainId: 8453,
            tokenId: 17,
        },
        {
            owner: "0xF83ff8092c91503cd468aBb2DEb115a91fE83c99",
            days: "90",
            tokens: 789123,
            chainId: 17000,
            tokenId: 18,
        },
    ])

    // UseEffect - Fetch settlements
    useEffect(() => {
        // TODO: Fetch settlements
    }, [setSettlements])

    // UseEffect - Process settlements
    useEffect(() => {
        const getRandomIndices = (arrayLength: number, count: number): number[] => {
            const indices = new Set<number>()
            while (indices.size < count) {
                indices.add(Math.floor(Math.random() * (arrayLength + indices.size)))
            }
            return Array.from(indices).sort((a, b) => a - b)
        }

        const addRandomTrees = (settlements) => {
            const numberOfTrees = settlements.length * 2
            const updatedSettlements = [...settlements]

            // Generate random indices for inserting trees
            const randomIndices = getRandomIndices(updatedSettlements.length, numberOfTrees)

            // Insert { trees: true } at random indices
            randomIndices.forEach((index, i) => {
                updatedSettlements.splice(index + i, 0, { trees: true })
            })

            return updatedSettlements
        }

        const shuffleArray = (array) => {
            const shuffled = [...array]
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            }
            return shuffled
        }

        const processSettlements = (settlements) => {
            let filteredSettlements = settlements

            // If there is an ownerFilter set, filter the settlements by owner
            if (settlementOwnerFilter) {
                filteredSettlements = filteredSettlements.filter((settlement) => settlement.owner === settlementOwnerFilter)
            }

            // If there is a chainIdFilter set, filter the settlements by chainId
            if (chainIdFilter.length > 0) {
                filteredSettlements = filteredSettlements.filter((settlement) => chainIdFilter.includes(settlement.chainId.toString()))
            }

            // If there is a connectedWalletAddress, find those settlements
            const ownerSettlements = filteredSettlements.filter((settlement) => settlement.owner === connectedWalletAddress)
            filteredSettlements = filteredSettlements.filter((settlement) => settlement.owner !== connectedWalletAddress)

            if (filteredSettlements.length > 3) {
                const settlementsWithTrees = addRandomTrees(filteredSettlements)

                // Shuffle the remaining settlements and add random tree objects to the filteredSettlements array
                const shuffledRemaining = shuffleArray(settlementsWithTrees)

                // Add extra tree objects at the end of the array
                for (let i = 0; i < 5; i++) {
                    shuffledRemaining.push({ trees: true })
                }

                // Remove trees from the start so it always starts with a settlement
                if (ownerSettlements.length === 0) {
                    while (shuffledRemaining[0].trees) {
                        shuffledRemaining.shift()
                    }
                }

                setProcessedSettlements([...ownerSettlements, ...shuffledRemaining])
            } else {
                setProcessedSettlements([...ownerSettlements, ...filteredSettlements])
            }

            setCalculating(false)
        }

        setCalculating(true)
        processSettlements(settlements)
    }, [settlements, connectedWalletAddress, settlementOwnerFilter, chainIdFilter])

    // UseEffect - Set calculating to false when processedSettlements changes
    useEffect(() => {
        setCalculating(false)
    }, [processedSettlements])

    return (
        <VStack id="gallery" borderRadius={"20px"} w={"100%"} textAlign={"justify"} gap={0} mb={isGalleryExpanded ? 0 : "60vh"}>
            <HStack
                border={"4px solid green"}
                borderBottom={isGalleryExpanded ? "none" : "4px solid green"}
                justifyContent={"space-between"}
                w={"100%"}
                maxW={"500px"}
                cursor={"pointer"}
                onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                className={"bgContent"}
                px={5}
                py={3}
                mb={"-4px"}
                borderTopRadius={"20px"}
                borderBottomRadius={isGalleryExpanded ? "0px" : "20px"}
                zIndex={2}
            >
                <Box
                    boxSize={6}
                    as={FontAwesomeIcon}
                    icon={faChevronRight}
                    transition="all 0.2s"
                    transform={`rotate(${isGalleryExpanded ? 45 : 0}deg)`}
                    borderRadius={"full"}
                />
                <Text fontSize={"lg"} fontWeight={"bold"} className={"bgPage"} px={3} py={1} borderRadius={"full"} textAlign={"center"}>
                    Settlements Gallery
                </Text>
                <Box
                    boxSize={6}
                    as={FontAwesomeIcon}
                    icon={faChevronRight}
                    transition="all 0.2s"
                    transform={`rotate(${isGalleryExpanded ? 135 : 180}deg)`}
                    borderRadius={"full"}
                />
            </HStack>
            <VStack
                className={"contentContainer"}
                justifyContent={"center"}
                w={"100%"}
                pt={6}
                pb={3}
                px={5}
                borderRadius={"20px"}
                borderTopRadius={{ base: "0px", md: "20px" }}
                flexWrap={"wrap"}
                gap={5}
                hidden={!isGalleryExpanded ? true : false}
            >
                <HStack flexWrap={"wrap"} gap={5} justifyContent={"space-around"} w={"100%"}>
                    <HStack flexWrap={"wrap"} justifyContent={"center"} gap={5}>
                        <Text fontSize={"lg"} fontWeight={"bold"}>
                            Filter by chain
                        </Text>
                        <HStack gap={5} flexWrap={"wrap"} justifyContent={"center"}>
                            {Object.keys(config.chains)
                                .filter((chainId) => {
                                    const chain = config.chains[chainId]
                                    return chain.type !== "local" || process.env.NEXT_PUBLIC_DEV_MODE_FLAG === "true"
                                })
                                .map((chainId) => (
                                    <ChainCheckbox
                                        key={chainId}
                                        chainId={chainId}
                                        chainIdFilter={chainIdFilter}
                                        setChainIdFilter={setChainIdFilter}
                                        setCalculating={setCalculating}
                                    />
                                ))}
                        </HStack>
                    </HStack>
                    <HStack flexWrap={"wrap"} justifyContent={"center"} gap={5}>
                        <Text fontSize={"lg"} fontWeight={"bold"}>
                            Filter by owner
                        </Text>
                        <HStack gap={5} minW={{ base: "100%", sm: "50px" }}>
                            <InputGroup>
                                <Input
                                    placeholder="0x123..."
                                    p={3}
                                    pr={10}
                                    w={"100%"}
                                    minW={{ sm: "100px", md: "460px" }}
                                    borderRadius={"20px"}
                                    fontFamily={"monospace"}
                                    value={settlementOwnerFilter}
                                    onChange={(event) => {
                                        setCalculating(true)
                                        setSettlementOwnerFilter(event.target.value)
                                    }}
                                    border={"none"}
                                    variant={"AddressInput"}
                                />
                                {settlementOwnerFilter && (
                                    <InputRightElement>
                                        <IconButton
                                            aria-label="Clear input"
                                            icon={<FontAwesomeIcon icon={faXmark} size="xl" />}
                                            size="sm"
                                            borderRadius={"full"}
                                            onClick={() => {
                                                setSettlementOwnerFilter("")
                                                setCalculating(true)
                                            }}
                                            variant="ghost"
                                        />
                                    </InputRightElement>
                                )}
                            </InputGroup>
                        </HStack>
                    </HStack>
                </HStack>
                <Divider w={"100%"} borderWidth={"1px"} />
                <Box w={"100%"} py={3} minH={"60vh"}>
                    {processedSettlements.length === 1 && <SettlementCard index={0} data={processedSettlements[0]} />}
                    {processedSettlements.length > 1 && !calculating && (
                        <Masonry items={processedSettlements} render={SettlementCard} columnWidth={450} rowGutter={20} columnGutter={10} />
                    )}
                </Box>
            </VStack>
        </VStack>
    )
}
