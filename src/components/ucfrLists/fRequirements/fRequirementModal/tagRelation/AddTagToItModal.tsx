import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { useUcfrListsContext, useUpdateUcfrListsContext, } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"

function AddTagToItModal({ isOpen, onClose, fRequirementId: receivedFRequirementId}: { isOpen: boolean, onClose: () => void, fRequirementId: string}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()

    const addTagToFunctionalRequirementHandler = (scopedTagId: string) => {
        ucfrListsInterfaces.addTagToFunctionalRequirementById({
            tagId: scopedTagId,
            functionalRequirementId: receivedFRequirementId,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'Tag added to FR' })
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
                                    onClick={() => {addTagToFunctionalRequirementHandler(scopedTag.id)}}
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

export default AddTagToItModal