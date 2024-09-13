import { useEffect, useState, useCallback } from "react"
import { VStack, Box, useColorModeValue } from "@chakra-ui/react"

import Header from "./Header"
import Footer from "./Footer"
import CustomRpcInput from "./CustomRpcInput"
import ContentContainer from "./ContentContainer"

import "@rainbow-me/rainbowkit/styles.css"

import { getDefaultConfig, darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { http, createConfig, WagmiProvider } from "wagmi"
import { mainnet as wagmiMainnet } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const App = () => {
    const colorMode = useColorModeValue("light", "dark")

    const [useCustomRpc, setUseCustomRpc] = useState(false)
    const [customRpc, setCustomRpc] = useState("")
    const [isValidWalletConnectId, setIsValidWalletConnectId] = useState(false)
    const [wagmiProviderConfig, setWagmiProviderConfig] = useState(null)

    // Helper function to create default config, wrapped in useCallback
    const createWagmiProviderConfig = useCallback(() => {
        const commonChainsConfig = {
            ...wagmiMainnet,
            rpcUrls: {
                default: {
                    http: [customRpc || process.env.NEXT_PUBLIC_JSON_RPC],
                },
            },
        }

        const fallbackConfig = createConfig({
            chains: [commonChainsConfig],
            transports: {
                [wagmiMainnet.id]: http(customRpc || process.env.NEXT_PUBLIC_JSON_RPC),
            },
        })

        if (process.env.NEXT_PUBLIC_WALLETCONNECT_ID) {
            // If WalletConnect ID exists check if it is valid
            if (isValidWalletConnectId) {
                // If it is valid, use the default config with WalletConnect
                // Note: Can only be created after confirming WalletConnectId
                // exists and is valid or else it will throw an error
                setWagmiProviderConfig(
                    getDefaultConfig({
                        appName: "Ethereum Settler",
                        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
                        chains: [commonChainsConfig],
                        ssr: true,
                    })
                )
            } else {
                // If it is not valid, use the fallback config
                setWagmiProviderConfig(fallbackConfig)
            }
        } else {
            // If no WalletConnect ID exists, use the fallback config
            setWagmiProviderConfig(fallbackConfig)
        }
    }, [customRpc, isValidWalletConnectId])

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_WALLETCONNECT_ID) {
            fetch(`https://explorer-api.walletconnect.com/v3/wallets?projectId=${process.env.NEXT_PUBLIC_WALLETCONNECT_ID}`)
                .then((response) => {
                    if (response.ok) {
                        setIsValidWalletConnectId(true)
                    } else {
                        console.log("Invalid WalletConnect projectId:", process.env.NEXT_PUBLIC_WALLETCONNECT_ID)
                        setIsValidWalletConnectId(false)
                        createWagmiProviderConfig()
                    }
                })
                .catch((error) => {
                    console.error("Error fetching WalletConnect ID", error)
                    setIsValidWalletConnectId(false)
                    createWagmiProviderConfig()
                })
        }
    }, [createWagmiProviderConfig])

    // UseEffect - Recreate wagmiProviderConfig when isValidWalletConnectId changes to true
    useEffect(() => {
        if (isValidWalletConnectId) {
            createWagmiProviderConfig()
        }
    }, [isValidWalletConnectId, createWagmiProviderConfig])

    // UseEffect - Recreate wagmiProviderConfig when customRpc changes
    useEffect(() => {
        if (useCustomRpc && customRpc) {
            createWagmiProviderConfig()
        }
    }, [customRpc, useCustomRpc, createWagmiProviderConfig])

    // UseEffect - Reset customRpc when useCustomRpc is false
    useEffect(() => {
        !useCustomRpc && setCustomRpc("")
    }, [useCustomRpc, setCustomRpc])

    // Create queryClient for RainbowKit
    const queryClient = new QueryClient()

    if (!wagmiProviderConfig) {
        return null
    } else {
        return (
            <VStack minH={"100vh"} minW={"100%"} className={"bgPage"} gap={0}>
                <VStack minW={"100%"} justifyContent="center" alignItems="center" gap={0}>
                    <Header useCustomRpc={useCustomRpc} setUseCustomRpc={setUseCustomRpc} />
                    {useCustomRpc && <CustomRpcInput setUseCustomRpc={setUseCustomRpc} customRpc={customRpc} setCustomRpc={setCustomRpc} />}
                    <VStack alignItems={"center"} maxW={"100vw"} px={{ base: "0px", sm: "2vw", xl: "3vw", "2xl": "3vw" }} gap={0}>
                        <Box height={"30px"} />
                        <WagmiProvider config={wagmiProviderConfig}>
                            <QueryClientProvider client={queryClient}>
                                <RainbowKitProvider modalSize="compact" theme={colorMode === "dark" ? darkTheme() : lightTheme()}>
                                    <ContentContainer customRpc={customRpc} />
                                </RainbowKitProvider>
                            </QueryClientProvider>
                        </WagmiProvider>
                        <Box height={30} />
                    </VStack>
                </VStack>
                <Box flex="1" />
                <Footer />
            </VStack>
        )
    }
}

export default App
