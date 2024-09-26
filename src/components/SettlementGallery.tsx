import { useEffect, useState } from "react"
import { VStack, Text, HStack, Box, Input, InputGroup, InputRightElement, IconButton, Divider, useBreakpointValue, Spinner } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useAccount } from "wagmi"
import { Masonry } from "masonic"

import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"

import SettlementCard from "./SettlementCard"
import ChainCheckbox from "./ChainCheckbox"
import getRandomTreeEmoji from "../utils/TreeEmojis"

import config from "../../public/data/config.json"
import { abi as viewAggregatorContractAbi } from "../../public/data/viewAggregatorAbi"

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
    const isMasonry = useBreakpointValue({ base: false, sm: true })

    const [isGalleryExpanded, setIsGalleryExpanded] = useState(true)
    const [processedSettlements, setProcessedSettlements] = useState<ProcessedSettlement[]>([])
    const [calculating, setCalculating] = useState(true)
    const [fetchingData, setFetchingData] = useState(true)
    const [settlementOwnerFilter, setSettlementOwnerFilter] = useState("")
    const [chainIdFilter, setChainIdFilter] = useState([])
    const [disabledChains, setDisabledChains] = useState([])
    const [settlements, setSettlements] = useState<ProcessedSettlement[]>([])

    // UseEffect - Fetch settlements
    useEffect(() => {
        const fetchSettlements = async () => {
            const fetchedSettlements: ProcessedSettlement[] = []

            setFetchingData(true)
            for (const chainId in config.chains) {
                const chain = config.chains[chainId]
                if (chain.type === "local" && process.env.NEXT_PUBLIC_DEV_MODE_FLAG !== "true") {
                    continue
                }
                if (chain.viewAggregatorContractAddress === "0x0000000000000000000000000000000000000000") {
                    continue
                }

                try {
                    // Check if the RPC endpoint is reachable
                    await fetch(chain.publicJsonRpc, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            jsonrpc: "2.0",
                            method: "eth_blockNumber",
                            params: [],
                            id: 1,
                        }),
                    })

                    const provider = new ethers.JsonRpcProvider(chain.publicJsonRpc)
                    const contract = new ethers.Contract(chain.viewAggregatorContractAddress, viewAggregatorContractAbi, provider)

                    console.log("Fetching settlements from chain:", chainId)

                    const settlements = await contract.getRandomData(10)
                    settlements.forEach((settlement) => {
                        fetchedSettlements.push({
                            owner: settlement.owner,
                            days: settlement.daysSinceMint.toString(),
                            tokens: Number(new BigNumber(settlement.tokens).shiftedBy(-18)),
                            chainId: parseInt(chainId),
                            tokenId: Number(new BigNumber(settlement.nftId)),
                        })
                    })
                } catch (error) {
                    console.error(`Error fetching settlements for ${chainId}: ${error}`)

                    setDisabledChains((prev) => [...prev, chainId])
                    continue
                }
            }
            setSettlements(fetchedSettlements)
        }
        fetchSettlements()
    }, [setSettlements, setDisabledChains])

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

            // If there is a chainIdFilter set, filter the settlements by chainId, else show all
            if (chainIdFilter.length > 0) {
                filteredSettlements = filteredSettlements.filter((settlement) => chainIdFilter.includes(settlement.chainId.toString()))
            }

            // If there is a connectedWalletAddress, find those settlements
            const ownerSettlements = filteredSettlements.filter((settlement) => settlement.owner === connectedWalletAddress)
            filteredSettlements = filteredSettlements.filter((settlement) => settlement.owner !== connectedWalletAddress)

            if (filteredSettlements.length >= 3) {
                const settlementsWithTrees = addRandomTrees(filteredSettlements)

                // Shuffle the remaining settlements and add random tree objects to the filteredSettlements array
                const shuffledRemaining = shuffleArray(settlementsWithTrees)

                // Add extra tree objects at the end of the array
                for (let i = 0; i < 6; i++) {
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

            setFetchingData(false)
        }

        if (settlements.length > 0) {
            setCalculating(true)
            processSettlements(settlements)
        }
    }, [settlements, connectedWalletAddress, settlementOwnerFilter, chainIdFilter])

    // UseEffect - Set calculating to false when processedSettlements changes
    useEffect(() => {
        if (processedSettlements.length > 0) {
            setCalculating(false)
        }
    }, [processedSettlements])

    return (
        <VStack id="gallery" borderRadius={"20px"} w={"100%"} textAlign={"justify"} gap={0} minH={{ base: "20vh", sm: "60vh" }}>
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
                                        disabledChains={disabledChains}
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
                <Box w={"100%"} py={3}>
                    {fetchingData && (
                        <VStack>
                            <Spinner />
                            <Text>Loading settlements...</Text>
                        </VStack>
                    )}
                    {processedSettlements.length === 1 && <SettlementCard index={0} data={processedSettlements[0]} />}
                    {processedSettlements.length > 1 && !calculating && !fetchingData && (
                        <>
                            {isMasonry ? (
                                <Masonry items={processedSettlements} render={SettlementCard} columnWidth={450} rowGutter={20} columnGutter={10} />
                            ) : (
                                <VStack gap={3}>
                                    {processedSettlements.map((settlement, index) => (
                                        <SettlementCard key={index} index={index} data={settlement} />
                                    ))}
                                </VStack>
                            )}
                        </>
                    )}
                    {!fetchingData && processedSettlements.length === 0 && (
                        <HStack justifyContent={"center"} w={"100%"} gap={5} flexWrap={"wrap"}>
                            <HStack gap={{ base: 3, sm: 6 }} flexWrap={"wrap"} justifyContent={"center"} w={{ base: "100%", xl: "fit-content" }}>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                            </HStack>
                            <Text textAlign={"center"} fontWeight={"bold"} px={10} w={{ base: "100%", xl: "fit-content" }}>
                                No results found
                            </Text>
                            <HStack gap={{ base: 3, sm: 6 }} flexWrap={"wrap"} justifyContent={"center"} w={{ base: "100%", xl: "fit-content" }}>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                                <Text>{getRandomTreeEmoji()}</Text>
                            </HStack>
                        </HStack>
                    )}
                </Box>
            </VStack>
        </VStack>
    )
}
