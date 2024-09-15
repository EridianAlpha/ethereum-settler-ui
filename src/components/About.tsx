import { VStack, HStack, Text, Input, Button, Link } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import config from "../../public/data/config.json"

export default function About() {
    const SubHeading = ({ children }) => {
        return (
            <Text fontSize={"lg"} fontWeight={"bold"} className={"bgPage"} px={3} py={1} borderRadius={"full"}>
                {children}
            </Text>
        )
    }

    return (
        <VStack
            id="about"
            className={"contentContainer"}
            py={3}
            px={5}
            pb={5}
            borderRadius={"20px"}
            maxW={"700px"}
            gap={5}
            mt={5}
            textAlign={"justify"}
        >
            <Text fontSize={"2xl"} fontWeight={"bold"}>
                Calling all Ethereum Settlers!
            </Text>
            <VStack>
                <SubHeading>Welcome to the Settlement NFT Minting Dapp</SubHeading>
                <Text>
                    This project is a free mint NFT for anyone who feels like they have found their place as a part of the Ethereum ecosystem. It has
                    been created as an example project to experiment with ERC721 and ERC20 tokens. There are no fees, royalties, or costs associated
                    with minting other than the gas fee. It has been deployed on multiple chains (Ethereum mainnet, Base mainnet, Ethereum Holesky and
                    Base Sepolia) so anyone can mint a Settlement NFT. The contracts are verified on public explorers and are not upgradeable. The
                    source code is available on GitHub for both the contracts and this UI. All the code is fully open source for anyone to copy,
                    modify and reuse under an MIT licensed.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Getting Started</SubHeading>
                <Text>
                    Simply connect your wallet using the glowing button at the top of this page, select the chain you wish to mint your Settlement NFT
                    on, and click the mint button. You will be prompted to sign a transaction to mint your NFT. Once the transaction is confirmed, you
                    will be able to view your NFT and the metadata associated with it.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Settlement NFT</SubHeading>
                <Text>
                    An unlimited number of SETTLER NFTs can be minted, and each one has the mint timestamp stored as an attribute, so the older the
                    timestamp, the longer you have been an Ethereum Settler. Only one NFT can be held in a wallet at a time. There is nothing stopping
                    you minting multiple Settlement NFTs from multiple wallets, as this is a personal collectable, you can use the project however you
                    wish. This Dapp will display the dynamic Settlement NFT SVG which shows how many days the NFT has been minted.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>SETTLER Token</SubHeading>
                <Text>
                    For every second you hold a Settlement NFT in your wallet, you will earn 1 SETTLER token. Your SETTLER token balance is calculated
                    based on the mint timestamp of your NFT and the current time. Every time you interact with the Settlement NFT (e.g. transfer it to
                    a new wallet) and every time you transfer SETTLER tokens, the calculated tokens will be minted to your wallet. The SETTLER token
                    will never have any value, and it is not listed on any exchanges.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Custom RPC (optional)</SubHeading>
                {/* TODO: Add icon and GitHub README link */}
                <Text>
                    If the default RPC is not working and/or you would prefer to use a different RPC provider to query the network you can enter an
                    alternative RPC URL by clicking the button in menu bar at the top of this page. This UI can be run locally with a local RPC
                    provider so no external dependencies are required. See the GitHub README for more information.
                </Text>
            </VStack>
        </VStack>
    )
}
