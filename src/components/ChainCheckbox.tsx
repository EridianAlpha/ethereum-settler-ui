import { HStack, Text, Image, Tooltip, VStack } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"

import config from "../../public/data/config.json"

export default function ChainCheckbox({ chainId, setChainIdFilter, chainIdFilter, setCalculating, disabledChains, settlementChainTotals }) {
    const handleClick = (chainId) => {
        setCalculating(true)

        if (chainIdFilter.includes(chainId)) {
            // Remove the chainId if it's already in the array
            setChainIdFilter((prev) => prev.filter((id) => id !== chainId))
        } else {
            // Add the chainId if it's not in the array
            setChainIdFilter((prev) => [...prev, chainId])
        }
    }

    if (disabledChains.includes(chainId) || config.chains[chainId].viewAggregatorContractAddress === "0x0000000000000000000000000000000000000000") {
        return (
            <Tooltip
                className="tooltip"
                closeOnClick={false}
                gutter={10}
                maxW={"600px"}
                px={5}
                label={
                    <VStack className="tooltipLabel" fontWeight={"bold"}>
                        <Text>Error connecting to RPC</Text>
                        <Text>{config.chains[chainId].name}</Text>
                        <Text>{config.chains[chainId].publicJsonRpc}</Text>
                    </VStack>
                }
                placement={"top"}
                borderRadius={"full"}
                hasArrow={true}
                closeDelay={0}
                openDelay={0}
            >
                <HStack
                    cursor="not-allowed"
                    gap={2}
                    className="bgPage"
                    minW="fit-content"
                    pr={2}
                    py={0}
                    borderRadius={"full"}
                    filter={"brightness(50%)"}
                    textColor={"red"}
                >
                    <HStack h={"30px"} borderRadius={"full"} justifyContent={"center"} alignItems={"center"} fontSize={"30px"}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </HStack>
                    <Text fontSize={"xl"}>{config.chains[chainId].name}</Text>
                </HStack>
            </Tooltip>
        )
    } else {
        return (
            <HStack
                onClick={() => handleClick(chainId)}
                cursor="pointer"
                gap={2}
                className="bgPage"
                minW="fit-content"
                pr={2}
                py={0}
                borderRadius={"full"}
                border={chainIdFilter.includes(chainId) ? "3px solid gold" : "3px solid transparent"}
            >
                <Image h={"30px"} borderRadius={"full"} src={config.chains[chainId].iconUrl} alt="Chain Icon" />
                <Text fontSize={"xl"}>{config.chains[chainId].name}</Text>
                <Text fontSize={"xl"} borderLeft={"1px solid"} pl={2}>
                    {settlementChainTotals[chainId]}
                </Text>
            </HStack>
        )
    }
}
