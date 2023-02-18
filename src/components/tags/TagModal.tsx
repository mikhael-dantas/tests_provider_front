import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, ModalFooter, Button } from "@chakra-ui/react"
import ConfirmationModal from "@myComponents/ConfirmationModal"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { useUcfrListsContext, useUpdateUcfrListsContext, ITag } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "src/lib/featuresInterfaces/UcfrListsContextInterfaces"
import { ModalInputStyle } from "@myStyles/GlobalStyles"
import React, { useEffect } from "react"


function TagModal({isOpen, onClose, tagId: receivedTagId}: {isOpen: boolean, onClose: () => void, tagId: string}) {

    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const [tag, setTag] = React.useState<ITag | undefined>(undefined)

    const [tagEditNameInput, setTagEditNameInput] = React.useState<string>('')
    const [tagEditDescriptionInput, setTagEditDescriptionInput] = React.useState<string>('')

    const tagEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagEditNameInput(e.target.value)
    }

    const tagEditDescriptionInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagEditDescriptionInput(e.target.value)
    }

    const tagEditHandler = () => {
        ucfrListsInterfaces.updateTagById({
            tagId: receivedTagId,
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
        ucfrListsInterfaces.removeTag({tagId: receivedTagId})
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

    useEffect(() => {
        ucfrListsInterfaces.readTagById({tagId: receivedTagId})
        .then((tag) => {
            setTag(tag)
            setTagEditNameInput(tag.name)
            setTagEditDescriptionInput(tag.description)
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "error",
                        text: error.message
                    })
                }
            ])
        })
    }, [receivedTagId])

    const { isOpen: isDeleteConfirmationModalOpen, onOpen: onOpenDeleteConfirmationModal, onClose: onCloseDeleteConfirmationModal } = useDisclosure()

    return (

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{tag ? tag.name : ''}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Flex alignItems="center">
                    Name:
                    <input style={ModalInputStyle}
                    type="text" value={tagEditNameInput} onChange={tagEditNameInputHandler} />
                </Flex>
                <Flex alignItems="center">
                    Description:
                    <input style={ModalInputStyle}
                    type="text" value={tagEditDescriptionInput} onChange={tagEditDescriptionInputHandler} />
                </Flex>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme={"blue"} mr={3} onClick={tagEditHandler}>
                    Save
                </Button>
                <Button colorScheme={"blue"} mr={3} 
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