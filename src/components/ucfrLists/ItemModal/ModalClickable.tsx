import { useDisclosure } from "@chakra-ui/react"
import { IFunctionalRequirement, INestedUseCase, IUseCase } from "@myContexts/UcfrsContext"
import React from "react"
import ItemModal from "./ItemModal"

export default function ModalClickable(
    {
        item: itemReceived,
        itemType: itemTypeReceived,
        className: classNameReceived,
        children,
    }: {
        item: IUseCase | INestedUseCase | IFunctionalRequirement
        itemType: "useCase" | "nestedUseCase" | "functionalRequirement"
        className?: string
        children?: React.ReactNode
        
    }
) {

    const { isOpen: isUseCaseModalOpen, onOpen: onUseCaseModalOpen, onClose: onUseCaseModalClose } = useDisclosure()

    return (
        <div className={"cursor-pointer " + classNameReceived}
        onClick={onUseCaseModalOpen}
        >
            {children}
            <ItemModal isOpen={isUseCaseModalOpen} onClose={onUseCaseModalClose}  itemType={itemTypeReceived} item={
                itemReceived
            } />
        </div>
    )
}
