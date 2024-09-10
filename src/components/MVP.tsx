import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { VStack, Text, Box, Code, Image } from "@chakra-ui/react"
import { set } from "lodash"

export default function MVP() {
    const [tokenData, setTokenData] = useState<any>(null)
    const [svgContent, setSvgContent] = useState<string>("")

    useEffect(() => {
        const fetchTokenURI = async () => {
            // Define the provider and contract details
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
            const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"

            // Contract ABI with only the tokenURI function
            const abi = ["function tokenURI(uint256 tokenId) view returns (string)"]

            // Create a contract instance
            const contract = new ethers.Contract(contractAddress, abi, provider)

            try {
                // TODO: Currently hardcoded to tokenId 1, but this should be dynamic based on user input and/or connected wallet
                const uri = await contract.tokenURI(1)

                // Remove the 'data:application/json;base64,' part from the uri and decode the base64 string
                const base64Data = uri.replace("data:application/json;base64,", "")

                // Decode base64 and parse JSON
                const jsonData = JSON.parse(atob(base64Data))

                // Set the token data to display in the UI
                setTokenData(jsonData)

                // Check if jsonData.image contains an IPFS URL and replace it in the SVG
                if (jsonData.imageCompositeSvg) {
                    // Remove the base64 prefix for the SVG data (data:image/svg+xml;base64,)
                    const encodedSvg = jsonData.imageCompositeSvg.replace("data:image/svg+xml;base64,", "")

                    // Decode base64 to plain SVG string
                    const decodedSvg = atob(encodedSvg)

                    // Replace ipfs:// with a public IPFS gateway inside the SVG
                    const modifiedSvg = decodedSvg.replace(/ipfs:\/\//g, "https://ipfs.io/ipfs/")

                    // Re-encode the modified SVG to base64
                    const reEncodedSvg = btoa(modifiedSvg)

                    // Set the SVG content to the modified SVG
                    setSvgContent(`data:image/svg+xml;base64,${reEncodedSvg}`)
                }
            } catch (error) {
                console.error("Error fetching tokenURI:", error)
            }
        }

        fetchTokenURI()
    }, [])

    return (
        <VStack maxW={"80%"} alignItems={"center"} pb={5} px={3} gap={1}>
            {tokenData ? (
                <VStack maxW={"100%"}>
                    <Box maxW={"100%"} overflow={"scroll"} borderRadius={20}>
                        <Code p={5} borderRadius={20}>
                            <pre>{JSON.stringify(tokenData, null, 2)}</pre>
                        </Code>
                    </Box>
                    <Box mt={5} boxSize={"300px"} borderRadius="20px" overflow={"hidden"}>
                        {svgContent && <embed src={svgContent} />}
                    </Box>
                </VStack>
            ) : (
                <Text>Fetching token data...</Text>
            )}
        </VStack>
    )
}
