import { useEffect, useState, useCallback } from "react"
import { VStack, Box, useColorModeValue } from "@chakra-ui/react"

import config from "../../public/data/config.json"

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
                    http: [customRpc || config.publicJsonRpc],
                },
            },
        }

        const fallbackConfig = createConfig({
            chains: [commonChainsConfig],
            transports: {
                [wagmiMainnet.id]: http(customRpc || config.publicJsonRpc),
            },
        })

        if (config.walletconnectId) {
            // If WalletConnect ID exists check if it is valid
            if (isValidWalletConnectId) {
                // If it is valid, use the default config with WalletConnect
                // Note: Can only be created after confirming WalletConnectId
                // exists and is valid or else it will throw an error
                setWagmiProviderConfig(
                    getDefaultConfig({
                        appName: "Ethereum Settler",
                        projectId: config.walletconnectId,
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
        if (config.walletconnectId) {
            fetch(`https://explorer-api.walletconnect.com/v3/wallets?projectId=${config.walletconnectId}`)
                .then((response) => {
                    if (response.ok) {
                        setIsValidWalletConnectId(true)
                    } else {
                        console.log("Invalid WalletConnect projectId:", config.walletconnectId)
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
                <VStack minW={"100vw"} justifyContent="center" alignItems="center" gap={0}>
                    <Header useCustomRpc={useCustomRpc} setUseCustomRpc={setUseCustomRpc} />
                    {useCustomRpc && <CustomRpcInput setUseCustomRpc={setUseCustomRpc} customRpc={customRpc} setCustomRpc={setCustomRpc} />}
                    <VStack alignItems={"center"} minW={"100vw"} px={{ base: "0px", sm: "2vw", xl: "3vw", "2xl": "3vw" }} gap={0}>
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
