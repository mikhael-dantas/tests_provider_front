import { Flex, useDisclosure } from "@chakra-ui/react"
import { IFunctionalRequirement } from "@myContexts/UcfrsContext"
import React from "react"
import FRequirementModal from "./fRequirementModal/FRequirementModal"



export default function FRequirementClickable({fRequirement: fRequirementReceived, children}: {fRequirement: IFunctionalRequirement, children?: React.ReactNode}) {

    const { isOpen: isFRequirementModalOpen, onOpen: onFRequirementModalOpen, onClose: onFRequirementModalClose } = useDisclosure()

    return (
        <Flex
        onClick={onFRequirementModalOpen}
        cursor={'pointer'}
        >
            {children}
            <FRequirementModal fRequirement={fRequirementReceived} isOpen={isFRequirementModalOpen} onClose={onFRequirementModalClose} />
        </Flex>
    )
}