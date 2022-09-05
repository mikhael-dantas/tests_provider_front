import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../AlertStackContext'
import { ITag, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../UcfrsContext'
import ConfirmationModal from '../ConfirmationModal'

function TagModal({isOpen, onClose, tag: receivedTag}: {isOpen: boolean, onClose: () => void, tag: ITag}) {

    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const [tagEditNameInput, setTagEditNameInput] = React.useState<string>(receivedTag.name)
    const [tagEditDescriptionInput, setTagEditDescriptionInput] = React.useState<string>(receivedTag.description)

    const tagEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagEditNameInput(e.target.value)
    }

    const tagEditDescriptionInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagEditDescriptionInput(e.target.value)
    }

    const tagEditHandler = () => {
        ucfrListsInterfaces.updateTagById({
            tagId: receivedTag.id,
            newTagName: tagEditNameInput,
            newTagDescription: tagEditDescriptionInput
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: "success", text: "Tag updated successfully"}),
                }
            ])
        })
        .catch((err) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: "error", text: err.message}),
                }
            ])
        })
    }

    const deleteTagHandler = () => {
        ucfrListsInterfaces.removeTag({tagId: receivedTag.id})
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: "success", text: "Tag deleted successfully"}),
                }
            ])
        })
        .catch((err) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: "error", text: err.message}),
                }
            ])
        })
    }

    const { isOpen: isDeleteConfirmationModalOpen, onOpen: onOpenDeleteConfirmationModal, onClose: onCloseDeleteConfirmationModal } = useDisclosure()

    return (

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{receivedTag.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <input type="text" value={tagEditNameInput} onChange={tagEditNameInputHandler} />
                <input type="text" value={tagEditDescriptionInput} onChange={tagEditDescriptionInputHandler} />
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='green' mr={3} onClick={tagEditHandler}>
                    Save
                </Button>
                <Button colorScheme='red' mr={3} 
                onClick={onOpenDeleteConfirmationModal}
                >
                    Delete Tag
                </Button>

                <ConfirmationModal isOpen={isDeleteConfirmationModalOpen} onClose={onCloseDeleteConfirmationModal} callback={deleteTagHandler} />
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default TagModal