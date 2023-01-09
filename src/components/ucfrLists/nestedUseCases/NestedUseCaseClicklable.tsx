import { Flex, useDisclosure } from "@chakra-ui/react"
import { INestedUseCase } from "@myContexts/UcfrsContext"
import React from "react"
import NestedUseCaseModal from "./nestedUseCaseModal/NestedUseCaseModal"



export default function NestedUseCaseClickable({NestedUseCase: NestedUseCaseReceived, children}: {NestedUseCase: INestedUseCase, children?: React.ReactNode}) {

    const { isOpen: isFRequirementModalOpen, onOpen: onFRequirementModalOpen, onClose: onFRequirementModalClose } = useDisclosure()

    return (
        <Flex
        onClick={onFRequirementModalOpen}
        cursor={'pointer'}
        >
            {children}
            <NestedUseCaseModal isOpen = {isFRequirementModalOpen} onClose = {onFRequirementModalClose} nestedUseCase={NestedUseCaseReceived}/>
        </Flex>
    )
}