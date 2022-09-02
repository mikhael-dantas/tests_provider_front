import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react'
import React from 'react'
import { customTheme } from '../../../theme'
import { UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../UcfrsContext'

export default function UseCaseAddTagModal({ isOpen, onClose, useCaseId: receivedUseCaseId}: { isOpen: boolean, onClose: () => void, useCaseId: string}) {

    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()

    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )

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
                                    onClick={() => {
                                        ucfrListsInterfaces.addTagToUseCase({
                                            tagId: scopedTag.id,
                                            useCaseId: receivedUseCaseId,
                                        })
                                        onClose()
                                    }}
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