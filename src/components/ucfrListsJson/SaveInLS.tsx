import { useDisclosure } from '@chakra-ui/react'
import ConfirmationModal from '@myComponents/ConfirmationModal'
import { useUcfrListsContext } from '@myContexts/UcfrsContext'
import React from 'react'

function SaveInLS({
    className,
    children,
    empty
}:{
    className?: string
    children?: React.ReactNode
    empty?: boolean
}) {
    const ucfrListsFromContext = useUcfrListsContext()
    const saveInLS = () => {
        localStorage.setItem('ucfrLists', JSON.stringify(ucfrListsFromContext))
    }

    const { 
        isOpen: isOpenSaveInLSConfirmation,
        onOpen: onOpenSaveInLSConfirmation,
        onClose: onCloseSaveInLSConfirmation
    } = useDisclosure()
    return (
        <>
            <button className={
                className || 'button'
            } onClick={
                () => { 
                    onOpenSaveInLSConfirmation()
                }
            }>
                {empty ? null : "Save JSON locally"}
                {children && children}
            </button>

            <ConfirmationModal callback={() => {saveInLS();onCloseSaveInLSConfirmation()}} isOpen={isOpenSaveInLSConfirmation} onClose={onCloseSaveInLSConfirmation} />
        </>
    )
}

export default SaveInLS