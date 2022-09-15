import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { customTheme } from '../../../theme'
import { INestedUseCase, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../UcfrsContext'
import ConfirmationModal from '../../ConfirmationModal'
import { ModalInputStyle } from '../../GlobalStyles'
import FRequirementClickable from '../fRequirements/FRequirementClickable'
import UseCaseTag from '../useCases/UseCaseTag'
import NestedUseCaseAddPipelineModal from './NestedUseCaseAddPipelineModal'
import NestedUseCaseAddTagModal from './NestedUseCaseAddTagModal'
import AddFRequirementToItModal from './nestedUseCaseModal/fRequirementRelation/AddFRequirementToItModal'
import NestedUseCasePipelinesList from './NestedUseCasePipelinesList'



function NestedUseCaseModal({nestedUseCaseId: nestedUseCaseIdReceived, isOpen: isOpenReceived, onClose: onCloseReceived}: {nestedUseCaseId: string, isOpen: boolean, onClose: () => void}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const [nestedUseCaseEditNameInput, setNestedUseCaseEditNameInput] = React.useState('')

    const nestedUseCaseEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNestedUseCaseEditNameInput(e.target.value)
    }

    const saveNestedUseCaseEditNameHandler = () => {
        ucfrListsInterfaces.updateNestedUseCaseById({
            completed: false,
            name: nestedUseCaseEditNameInput,
            nestedUseCaseId: nestedUseCaseIdReceived
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'Nested Use Case Name Updated' }),
                }
            ])
        })
        .catch((err) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'error', text: err.message }),
                }
            ])
        })
    }

    const deleteNestedUseCaseHandler = () => {
        ucfrListsInterfaces.removeNestedUseCaseById({
            nestedUseCaseId: nestedUseCaseIdReceived,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "success",
                        text: "Nested use case deleted successfully",
                    })
                }
            ])
            onCloseReceived()
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "error",
                        text: error.message,
                    })
                }
            ])
        })
    }

    const removeTagFromNestedUseCaseHandler = (tagId: string) => {
        ucfrListsInterfaces.removeTagFromNestedUseCaseById({
            nestedUseCaseId: nestedUseCaseIdReceived,
            tagId: tagId
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "success",
                        text: "Tag removed from nested use case successfully",
                    })
                }
            ])
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "error",
                        text: error.message,
                    })
                }
            ])
        })
    }

    const removeFRequirementFromNestedUseCaseHandler = (fRequirementId: string) => {
        ucfrListsInterfaces.removeFunctionalRequirementFromNestedUseCase({
            nestedUseCaseId: nestedUseCaseIdReceived,
            functionalRequirementId: fRequirementId
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'F-Requirement removed from nested use case successfully' }),
                }
            ])
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'error', text: error.message }),
                }
            ])
        })
    }


    useEffect(() => {
        ucfrListsInterfaces.readNestedUseCaseById({nestedUseCaseId: nestedUseCaseIdReceived})
        .then((nestedUseCase) => {
            setNestedUseCaseEditNameInput(nestedUseCase.name)
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "error",
                        text: error.message,
                    })
                }
            ])
        })
    }, [nestedUseCaseIdReceived])


    const { isOpen: isOpenAddTagModal, onOpen: onOpenAddTagModal, onClose: onCloseAddTagModal } = useDisclosure()
    const { isOpen: isConfirmationModalOpen, onOpen: onConfirmationModalOpen, onClose: onConfirmationModalClose } = useDisclosure()
    const { isOpen: isOpenAddNestedUseCasePipelineModal, onOpen: onOpenAddNestedUseCasePipelineModal, onClose: onCloseAddNestedUseCasePipelineModal } = useDisclosure()
    const { isOpen: isOpenAddFRequirementToItModal, onOpen: onOpenAddFRequirementToItModal, onClose: onCloseAddFRequirementToItModal } = useDisclosure()
    return (
        <Modal isOpen={isOpenReceived} onClose={onCloseReceived}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>Nested Use Case View</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" backgroundColor={'lightblue'} padding={'.5rem'}>
                        <Grid className='nestedUseCaseNameContainer' 
                        alignItems={'center'}
                        templateColumns={'1fr 2fr'}
                        >
                            Name:
                            <input 
                            style={ModalInputStyle}
                            value={nestedUseCaseEditNameInput} onChange={nestedUseCaseEditNameInputHandler} 
                            />
                        </Grid>
                        <Button colorScheme='green' mr={3} onClick={saveNestedUseCaseEditNameHandler}>
                            Save Name
                        </Button>
                        <Flex className='nestedUseCaseTagsContainer' direction={'column'} marginTop={'1rem'}>
                            <Flex>
                                Tags:
                                <button className='button' onClick={onOpenAddTagModal}>+</button>
                                <NestedUseCaseAddTagModal isOpen={isOpenAddTagModal} onClose={onCloseAddTagModal} nestedUseCaseId={nestedUseCaseIdReceived} />
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
                                {ucfrListsFromContext.modules.reduce((acc, module) => {
                                    return [...acc, ...module.nestedUseCases]
                                }, []).find((nestedUseCase) => nestedUseCase.id === nestedUseCaseIdReceived)?.tagIds.map((tagId) => {
                                    return (
                                        <Flex
                                        key={tagId}
                                        >
                                            <UseCaseTag
                                            tagId={tagId}
                                            />
                                            <Button colorScheme='red' onClick={() => {removeTagFromNestedUseCaseHandler(tagId)}}>X</Button>
                                        </Flex>
                                        )
                                })}
                            </Flex>
                        </Flex>


                        <Accordion className={'nestedUseCaseDependenciesContainer'} allowMultiple>
                            <AccordionItem>
                            <h2>
                                <AccordionButton>
                                <Box flex='1' textAlign='left' color='black'>
                                    Required PipeLines
                                </Box>
                                <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <button className='button' onClick={onOpenAddNestedUseCasePipelineModal}>Add Nested Use Case Pipeline</button>
                                <NestedUseCaseAddPipelineModal isOpen={isOpenAddNestedUseCasePipelineModal} onClose={onCloseAddNestedUseCasePipelineModal} nestedUseCaseId={nestedUseCaseIdReceived} />

                                <NestedUseCasePipelinesList nestedUseCaseId={nestedUseCaseIdReceived} />
                            </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                            <h2>
                                <AccordionButton>
                                <Box flex='1' textAlign='left' color='black'>
                                    Required functionalities
                                </Box>
                                <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <button className='button' onClick={onOpenAddFRequirementToItModal}>Add Functional Requirement</button>
                                <AddFRequirementToItModal isOpen={isOpenAddFRequirementToItModal} onClose={onCloseAddFRequirementToItModal} nestedUseCaseId={nestedUseCaseIdReceived} />

                                {(ucfrListsFromContext.modules.reduce((acc, module) => { return [...acc, ...module.nestedUseCases] }, []).find((nestedUseCase) => nestedUseCase.id === nestedUseCaseIdReceived) as INestedUseCase)
                                .neededFrsToWorkIds.map((dependencyId) => {
                                    return (
                                        <Flex className='FRDependency' key={dependencyId}>
                                            <FRequirementClickable fRequirementId={dependencyId} />
                                            <Button colorScheme='red' onClick={() => { removeFRequirementFromNestedUseCaseHandler(dependencyId) }}>X</Button>
                                        </Flex>
                                    )
                                })}
                            </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} 
                    onClick={onConfirmationModalOpen}
                    >
                        Delete Nested
                    </Button>
                </ModalFooter>
            </ModalContent>
            <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose}  callback={deleteNestedUseCaseHandler}/>
        </Modal>
    )
}

export default NestedUseCaseModal