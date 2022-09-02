import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure, Flex } from '@chakra-ui/react'
import React from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { customTheme } from '../../../theme'
import { IUseCase, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../UcfrsContext'
import ConfirmationModal from '../../ConfirmationModal'
import UseCaseAddTagModal from './UseCaseAddTagModal'

function UseCaseModal( { isOpen, onClose, useCase }: { isOpen: boolean, onClose: () => void, useCase: IUseCase } ) {

    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()

    const AlertStackFromContext = useAlertStackComponentContext()
    const PushToAlertStack = useUpdateAlertStackComponentContext()


    const [useCaseEditNameInput, setUseCaseEditNameInput] = React.useState(useCase.name)

    const useCaseEditNameInputHandler = (e) => {
        setUseCaseEditNameInput(e.target.value)
    }

    const { isOpen: isOpenAddTagModal, onOpen: onOpenAddTagModal, onClose: onCloseAddTagModal } = useDisclosure()
    const { isOpen: isOpenRemoveTagModal, onOpen: onOpenRemoveTagModal, onClose: onCloseRemoveTagModal } = useDisclosure()

    const { isOpen: isOpenAddUseCasePipelineModal, onOpen: onOpenAddUseCasePipelineModal, onClose: onCloseAddUseCasePipelineModal } = useDisclosure()
    const { isOpen: isOpenRemoveUseCasePipelineModal, onOpen: onOpenRemoveUseCasePipelineModal, onClose: onCloseRemoveUseCasePipelineModal } = useDisclosure()

    const { isOpen: isOpenAddNeededFrModal, onOpen: onOpenAddNeededFrModal, onClose: onCloseAddNeededFrModal } = useDisclosure()
    const { isOpen: isOpenRemoveNeededFrModal, onOpen: onOpenRemoveNeededFrModal, onClose: onCloseRemoveNeededFrModal } = useDisclosure()



    const saveUseCaseEditHandler = () => {
        if (useCaseEditNameInput === '') {
            PushToAlertStack([
                ...AlertStackFromContext, 
                {
                    component: GenerateAlertComponent({status: 'error', text: 'Tag name cannot be empty'}),
                }
            ])
            return
        }
        updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            modules: ucfrListsFromContext.modules.map(module => {
                if (module.id === useCase.moduleId) {
                    return {
                        ...module,
                        useCases: module.useCases.map(uc => {
                            if (uc.id === useCase.id) {
                                return {
                                    ...uc,
                                    name: useCaseEditNameInput,
                                }
                            }
                            return uc
                        })
                    }
                }
                return module
            })
        })
    }
    const deleteUseCaseHandler = () => {
        updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            modules: ucfrListsFromContext.modules.map(module => {
                if (module.id === useCase.moduleId) {
                    return {
                        ...module,
                        useCases: module.useCases.filter(uc => uc.id !== useCase.id)
                    }
                }
                return module
            })
        })
    }

    const { 
        isOpen: isConfirmationModalOpen,
        onOpen: onConfirmationModalOpen,
        onClose: onConfirmationModalClose
    } = useDisclosure()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>{useCase.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" alignItems="center">
                        name
                        <input 
                        style={{backgroundColor: 'white', color: 'black'}}
                        value={useCaseEditNameInput} onChange={useCaseEditNameInputHandler} 
                        />
                        <button className='button' onClick={onOpenAddTagModal}>Add Tag</button>
                        <button className='button' onClick={onOpenRemoveTagModal}>Remove Tag</button>

                        <UseCaseAddTagModal isOpen={isOpenAddTagModal} onClose={onCloseAddTagModal} useCaseId={useCase.id} />

                        <button className='button' onClick={onOpenAddUseCasePipelineModal}>Add Use Case Pipeline</button>
                        <button className='button' onClick={onOpenRemoveUseCasePipelineModal}>Remove Use Case Pipeline</button>

                        <button className='button' onClick={onOpenAddNeededFrModal}>Add Needed FR</button>
                        <button className='button' onClick={onOpenRemoveNeededFrModal}>Remove Needed FR</button>
                    </Flex>

                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='green' mr={3} onClick={saveUseCaseEditHandler}>
                        Save
                    </Button>
                    <Button colorScheme='red' mr={3} 
                    onClick={onConfirmationModalOpen}
                    >
                        Delete Use Case
                    </Button>
                </ModalFooter>
            </ModalContent>
            <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose} callback={deleteUseCaseHandler}/>
        </Modal>
    )
}

export default UseCaseModal