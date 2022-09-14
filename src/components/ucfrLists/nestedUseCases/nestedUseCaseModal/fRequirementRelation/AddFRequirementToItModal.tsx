import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../../../AlertStackContext'
import { customTheme } from '../../../../../theme'
import { UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../../../UcfrsContext'

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
