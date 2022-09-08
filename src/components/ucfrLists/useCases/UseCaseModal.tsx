import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { customTheme } from '../../../theme'
import { IUseCase, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../UcfrsContext'
import ConfirmationModal from '../../ConfirmationModal'
import { ModalInputStyle } from '../../GlobalStyles'
import UseCaseAddTagModal from './UseCaseAddTagModal'
import UseCaseTag from './UseCaseTag'

function UseCaseModal( { isOpen, onClose, useCase: useCaseReceived }: { isOpen: boolean, onClose: () => void, useCase: IUseCase } ) {

    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()



    const [useCaseEditNameInput, setUseCaseEditNameInput] = React.useState(useCaseReceived.name)

    const useCaseEditNameInputHandler = (e) => {
        setUseCaseEditNameInput(e.target.value)
    }



    const saveUseCaseEditHandler = () => {
        ucfrListsInterfaces.updateUseCaseById({
            useCaseId: useCaseReceived.id,
            name: useCaseEditNameInput,
            completed: useCaseReceived.completed,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'Use case updated' })
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
    }
    const deleteUseCaseHandler = () => {
        ucfrListsInterfaces.removeUseCaseById({
            useCaseId: useCaseReceived.id,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'Use case deleted' })
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
    }

    const removeTagHandler = (tagId: string) => {
        ucfrListsInterfaces.removeTagFromUseCaseById({
            useCaseId: useCaseReceived.id,
            tagId: tagId,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: 'success', text: 'Tag removed from use case'}),
                }
            ])
        })
        .catch((err) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: 'error', text: err.message}),
                }
            ])
        })
    }



    useEffect(() => {
        setUseCaseEditNameInput(useCaseReceived.name)
    }, [isOpen])


    // Disclosures
    const { isOpen: isOpenAddTagModal, onOpen: onOpenAddTagModal, onClose: onCloseAddTagModal } = useDisclosure()

    const { isOpen: isOpenAddUseCasePipelineModal, onOpen: onOpenAddUseCasePipelineModal, onClose: onCloseAddUseCasePipelineModal } = useDisclosure()
    const { isOpen: isOpenRemoveUseCasePipelineModal, onOpen: onOpenRemoveUseCasePipelineModal, onClose: onCloseRemoveUseCasePipelineModal } = useDisclosure()

    const { isOpen: isOpenAddNeededFrModal, onOpen: onOpenAddNeededFrModal, onClose: onCloseAddNeededFrModal } = useDisclosure()
    const { isOpen: isOpenRemoveNeededFrModal, onOpen: onOpenRemoveNeededFrModal, onClose: onCloseRemoveNeededFrModal } = useDisclosure()
    
    const { isOpen: isConfirmationModalOpen, onOpen: onConfirmationModalOpen, onClose: onConfirmationModalClose} = useDisclosure()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>Use Case View</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" backgroundColor={'lightblue'}>
                        <Flex className='useCaseNameContainer' alignItems={'center'}>
                            Name:
                            <input 
                            style={ModalInputStyle}
                            value={useCaseEditNameInput} onChange={useCaseEditNameInputHandler} 
                            />
                            <Button colorScheme='green' mr={3} onClick={saveUseCaseEditHandler}>
                                Save Name
                            </Button>
                        </Flex>
                        <Flex className='useCaseTagsContainer' direction={'column'} marginTop={'1rem'}>
                            <Flex>
                                Tags:
                                <button className='button' onClick={onOpenAddTagModal}>+</button>
                                <UseCaseAddTagModal isOpen={isOpenAddTagModal} onClose={onCloseAddTagModal} useCaseId={useCaseReceived.id} />
                            </Flex>
                            <Flex className={'useCaseTags'}
                            width={'95%'}
                            margin={'0 auto'}
                            backgroundColor={customTheme.colors[60]}
                            flexWrap={'wrap'}
                            justifyContent={'space-around'}
                            fontSize={'.8rem'}
                            padding={'.3rem'}
                            color={customTheme.colors[10]}
                            >
                                {useCaseReceived.tagIds.map(tagId => (
                                    <Flex>
                                        <UseCaseTag
                                        key={tagId}
                                        tagId={tagId}
                                        />
                                        <Button colorScheme='red' onClick={() => {removeTagHandler(tagId)}}>X</Button>
                                    </Flex>
                                ))}
                            </Flex>
                        </Flex>

                        {/* todo */}
                        <button className='button' onClick={onOpenAddUseCasePipelineModal}>Add Use Case Pipeline</button>
                        <button className='button' onClick={onOpenRemoveUseCasePipelineModal}>Remove Use Case Pipeline</button>

                        <button className='button' onClick={onOpenAddNeededFrModal}>Add Needed FR</button>
                        <button className='button' onClick={onOpenRemoveNeededFrModal}>Remove Needed FR</button>
                        {/* todo */}
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} 
                    onClick={onConfirmationModalOpen}
                    >
                        Delete Use Case
                    </Button>
                    <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose} callback={deleteUseCaseHandler}/>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UseCaseModal