import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { VStack, HStack, Text, Box, Link, Image } from "@chakra-ui/react"
import NextLink from "next/link"

import { useChainId, useAccount } from "wagmi"

import config from "../../public/data/config.json"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faDownload, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

export default function NftDisplay({ provider, nftId, setNftId, isMintTransactionConfirmed }) {
    const [tokenData, setTokenData] = useState(null)
    const [svgContent, setSvgContent] = useState("")
    const [isViewNftMetadataExpanded, setIsViewNftMetadataExpanded] = useState(false)

    const chainId = useChainId()
    const { address: connectedWalletAddress } = useAccount()

    const getFormattedDate = () => {
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    const NftMetadata = ({ label, content, link = "", downloadName = "" }) => {
        return (
            <VStack gap={1} className="bgPage" borderRadius={15} px={3} py={1} wordBreak={"break-word"} whiteSpace="normal" textAlign={"center"}>
                <Text fontWeight={"bold"}>{label}</Text>
                {link ? (
                    <Text>
                        <Link
                            as={NextLink}
                            href={link}
                            color={"blue"}
                            target="_blank"
                            textDecoration={"underline"}
                            download={downloadName ? downloadName : false}
                            rel="noopener noreferrer"
                        >
                            {content} <FontAwesomeIcon icon={downloadName ? faDownload : faUpRightFromSquare} size={"sm"} />
                        </Link>
                    </Text>
                ) : (
                    <Text>{content}</Text>
                )}
            </VStack>
        )
    }

    const base64EncodeImage = async (imageLocation: string) => {
        // Fetch the image and convert it to a Base64 string
        const response = await fetch(imageLocation)

        const blob = await response.blob()

        // Create a Base64 string from the blob
        const base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })

        return base64Image
    }

    useEffect(() => {
        const fetchNftUri = async () => {
            try {
                // Settlement NFT contract ABI
                const abi = [
                    "function tokenURI(uint256 tokenId) view returns (string)",
                    "function getOwnerToId(address owner) view returns (uint256)",
                ]

                // Create a contract instance
                const contract = new ethers.Contract(config.chains[chainId].nftContractAddress, abi, provider)

                // Fetch the tokenURI for the connected wallet address
                try {
                    setNftId(await contract.getOwnerToId(connectedWalletAddress))
                } catch (error) {
                    // Handle the case where the function does not return a value
                    setTokenData(null)
                    return
                }

                // If the nftId is 0 or null, the connectedWalletAddress does not have an NFT, so return early
                if (!nftId) {
                    setTokenData(null)
                    return
                }

                // Fetch the tokenURI for the NFT
                const uri = await contract.tokenURI(nftId)

                // Remove the 'data:application/json;base64,' part from the uri and decode the Base64 string
                const base64Data = uri.replace("data:application/json;base64,", "")

                // Decode Base64 and parse JSON
                const jsonData = JSON.parse(atob(base64Data))

                // Set the token data to display in the UI
                setTokenData(jsonData)

                // Check if jsonData.image contains an IPFS URL and replace it in the SVG
                if (jsonData.imageCompositeSvg) {
                    // Remove the Base64 prefix for the SVG data (data:image/svg+xml;base64,)
                    const encodedSvg = jsonData.imageCompositeSvg.replace("data:image/svg+xml;base64,", "")

                    // Decode base64 to plain SVG string
                    const decodedSvg = atob(encodedSvg)

                    // Convert the local NFT image to a Base64 string
                    const base64EncodeImageResponse = await base64EncodeImage(config.localNftImage)

                    // Replace ipfs://... with the full Base64 image directly in the SVG
                    const modifiedSvg = decodedSvg.replace(new RegExp(jsonData.image, "g"), base64EncodeImageResponse)

                    // Re-encode the modified SVG to Base64
                    const reEncodedSvg = btoa(modifiedSvg)

                    // Set the SVG content to the modified SVG
                    setSvgContent(`data:image/svg+xml;base64,${reEncodedSvg}`)
                }
            } catch (error) {
                // TODO: Add a state error here to update the UI if there is an error fetching the tokenURI
                console.error("Error fetching tokenURI:", error)
            }
        }

        fetchNftUri()
    }, [provider, isMintTransactionConfirmed, chainId, nftId, connectedWalletAddress, setNftId])

    // If the tokenData is fetched, display the NFT metadata
    if (tokenData)
        return (
            <VStack w={"100%"} maxW={"500px"} alignItems={"center"} gap={0}>
                <VStack
                    w={"100%"}
                    gap={0}
                    className={"bgContent"}
                    borderTopRadius={25}
                    borderBottomRadius={isViewNftMetadataExpanded ? 0 : 25}
                    overflow={"hidden"}
                >
                    <Box w={"100%"} borderRadius={25} overflow={"hidden"}>
                        {svgContent && <Image src={svgContent} alt={"SVG Composite NFT Image"} />}
                    </Box>
                    <HStack
                        justifyContent={"space-between"}
                        w={"100%"}
                        cursor={"pointer"}
                        onClick={() => setIsViewNftMetadataExpanded(!isViewNftMetadataExpanded)}
                        className={"bgContent"}
                        py={3}
                        px={3}
                    >
                        <Box
                            boxSize={6}
                            as={FontAwesomeIcon}
                            icon={faChevronRight}
                            transition="all 0.2s"
                            transform={`rotate(${isViewNftMetadataExpanded ? 45 : 0}deg)`}
                            borderRadius={"full"}
                        />
                        <Text fontWeight={"bold"}>NFT Metadata</Text>
                        <Box
                            boxSize={6}
                            as={FontAwesomeIcon}
                            icon={faChevronRight}
                            transition="all 0.2s"
                            transform={`rotate(${isViewNftMetadataExpanded ? 135 : 180}deg)`}
                            borderRadius={"full"}
                        />
                    </HStack>
                </VStack>
                {isViewNftMetadataExpanded && (
                    <VStack gap={5} pt={3} pb={5} px={4} maxW={"500px"} alignItems={"center"} className={"bgContent"} borderBottomRadius={25}>
                        <NftMetadata label="Name" content={tokenData.name} />
                        <NftMetadata label="Description" content={tokenData.description} />
                        <NftMetadata
                            label="Chain"
                            content={`${tokenData.attributes.find((attr) => attr.trait_type === "Chain")?.value} - ${
                                config.chains[tokenData.attributes.find((attr) => attr.trait_type === "Chain")?.value]?.name
                            }`}
                        />
                        <NftMetadata
                            label="Mint Timestamp"
                            content={tokenData.attributes.find((attr) => attr.trait_type === "Mint Timestamp")?.value}
                        />
                        <NftMetadata
                            label="Days Since Mint"
                            content={tokenData.attributes.find((attr) => attr.trait_type === "Days Since Mint")?.value}
                        />
                        <NftMetadata
                            label="Current Owner"
                            content={connectedWalletAddress}
                            link={`${config.chains[chainId].blockExplorerUrl}/address/${connectedWalletAddress}`}
                        />
                        <NftMetadata label="Background Image" content={tokenData.image} link={config.localNftImage} />
                        <NftMetadata
                            label="Composite SVG Image"
                            content={svgContent.slice(0, 200) + "..."}
                            link={svgContent}
                            downloadName={`${tokenData.name} ChainId - ${
                                tokenData.attributes.find((attr) => attr.trait_type === "Chain")?.value
                            } Download Date ${getFormattedDate()}.svg`}
                        />
                    </VStack>
                )}
            </VStack>
        )

    // If the tokenData is not yet fetched, display a loading message
    if (nftId === null) {
        return (
            <VStack w={"100%"} maxW={"100%"} alignItems={"center"} pb={5} gap={5}>
                <Text>Fetching NFT data...</Text>
            </VStack>
        )
    }

    // TODO: If there is an error fetching the token data, display an error message
}
