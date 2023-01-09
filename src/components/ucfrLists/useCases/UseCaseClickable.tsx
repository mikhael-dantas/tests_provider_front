import { Flex, useDisclosure } from "@chakra-ui/react"
import { IUseCase } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"
import React from "react"
import UseCaseModal from "./useCaseModal/UseCaseModal"

function UseCaseClickable(
    {useCase: useCaseReceived, children}: {useCase: IUseCase, children?: React.ReactNode}
) {

    const { isOpen: isUseCaseModalOpen, onOpen: onUseCaseModalOpen, onClose: onUseCaseModalClose } = useDisclosure()

    return (
        <Flex
        onClick={onUseCaseModalOpen}
        cursor={'pointer'}
        >
            {children}
            <UseCaseModal isOpen={isUseCaseModalOpen} onClose={onUseCaseModalClose}  useCase={useCaseReceived}/>
        </Flex>
    )
}

export default UseCaseClickable