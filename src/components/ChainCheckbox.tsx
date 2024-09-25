import { HStack, Text, Image } from "@chakra-ui/react"

import config from "../../public/data/config.json"

export default function ChainCheckbox({ chainId, setChainIdFilter, chainIdFilter, setCalculating }) {
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
            filter={chainIdFilter.length === 0 ? "null" : chainIdFilter.includes(chainId) ? "null" : "grayscale(100%) brightness(50%)"}
        >
            <Image h={"30px"} borderRadius={"full"} src={config.chains[chainId].iconUrl} alt="Chain Icon" />
            <Text fontSize={"xl"}>{config.chains[chainId].name}</Text>
        </HStack>
    )
}
