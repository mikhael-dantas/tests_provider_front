import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react'
import React from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { customTheme } from '../../../theme'
import { UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../UcfrsContext'

export default function NestedUseCaseAddTagModal({ isOpen, onClose, nestedUseCaseId: receivedNestedUseCaseId}: { isOpen: boolean, onClose: () => void, nestedUseCaseId: string}) {

    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()

    const addTagToUseCaseHandler = (scopedTagId: string) => {
        ucfrListsInterfaces.addTagToNestedUseCaseById({
            tagId: scopedTagId,
            nestedUseCaseId: receivedNestedUseCaseId,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'Tag added to use case' })
                }
            ])
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'error', text: error.message })
                }
            ])
        })

        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>{'add tags'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {
                        ucfrListsFromContext.tags.map(scopedTag => {
                            return (
                                <button
                                    key={scopedTag.id}
                                    onClick={() => {addTagToUseCaseHandler(scopedTag.id)}}
                                >
                                    {scopedTag.name}
                                </button>
                            )
                        })
                    }
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}