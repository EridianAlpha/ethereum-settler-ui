import { useState } from "react"
import Header from "./Header/Header"
import Footer from "./Footer"
import NftDisplay from "./NftDisplay"
import TokenDisplay from "./TokenDisplay"

import { Box, VStack } from "@chakra-ui/react"

const App = () => {
    return (
        <Box minH="100vh" className={"bgPage"} display="flex" flexDirection="column">
            <VStack gap={0} justifyContent="center" alignItems="center">
                <Header />
                <VStack gap={0} alignItems={"center"} maxW={"100vw"} w={"1150px"} px={{ base: "0px", sm: "2vw", xl: "3vw", "2xl": "3vw" }}>
                    <Box height={10} />
                    <NftDisplay />
                    <TokenDisplay />
                </VStack>
            </VStack>
            <Box flex="1" />
            <Footer />
        </Box>
    )
}

export default App
