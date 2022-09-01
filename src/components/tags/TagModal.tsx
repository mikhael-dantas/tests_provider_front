import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { ITag, useUcfrListsContext, useUpdateUcfrListsContext } from '../../UcfrsContext'
import ConfirmationModal from '../ConfirmationModal'

function TagModal({isOpen, onClose, tag: receivedTag}: {isOpen: boolean, onClose: () => void, tag: ITag}) {

    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()


    const [tagEditNameInput, setTagEditNameInput] = React.useState<string>(receivedTag.name)
    const [tagEditDescriptionInput, setTagEditDescriptionInput] = React.useState<string>(receivedTag.description)

    const tagEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagEditNameInput(e.target.value)
    }

    const tagEditDescriptionInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagEditDescriptionInput(e.target.value)
    }

    const tagEditHandler = () => {
        if (tagEditNameInput === '') {
            return
        }

        const tagToEdit = receivedTag

        const newTag = {
            ...tagToEdit,
            name: tagEditNameInput,
            description: tagEditDescriptionInput,
        }

        updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            tags: ucfrListsFromContext.tags.map(t => {
                if (t.id === newTag.id) {
                    return newTag
                }
                return t
            }
            )
        })
    }

    const deleteTagHandler = () => {
        updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            tags: ucfrListsFromContext.tags.filter(t => t.id !== receivedTag.id)
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