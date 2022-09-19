import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { useUcfrListsContext, useUpdateUcfrListsContext,  } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"

export default function AddFRequirementToItModal({ isOpen, onClose, nestedUseCaseId: receivedNestedUseCaseId}: { isOpen: boolean, onClose: () => void, nestedUseCaseId: string}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()

    const addFRequirementToNestedUseCaseHandler = (scopedFRequirementId: string) => {
        ucfrListsInterfaces.addFunctionalRequirementToNestedUseCase({
            nestedUseCaseId: receivedNestedUseCaseId,
            functionalRequirementId: scopedFRequirementId
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'FR added to Nested' })
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
                <ModalHeader>{'add FRs'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {
                        ucfrListsFromContext.modules.reduce((acc, scopedModule) => {
                            return [ ...acc, ...scopedModule.functionalRequirements ]
                        }, []).map(scopedFRequirement => {
                            return (
                                <button className='button'
                                    key={scopedFRequirement.id}
                                    onClick={() => {addFRequirementToNestedUseCaseHandler(scopedFRequirement.id)}}
                                >
                                    {scopedFRequirement.name}
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
