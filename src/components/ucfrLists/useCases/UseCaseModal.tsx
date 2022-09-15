import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { customTheme } from '../../../theme'
import { IUseCase, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../UcfrsContext'
import ConfirmationModal from '../../ConfirmationModal'
import { ModalInputStyle } from '../../GlobalStyles'
import FRequirementClickable from '../fRequirements/FRequirementClickable'
import UseCaseAddPipelineModal from './UseCaseAddPipelineModal'
import UseCaseAddTagModal from './UseCaseAddTagModal'
import AddFRequirementToItModal from './useCaseModal/fRequirementRelation/AddFRequirementToItModal'
import UseCasePipelineItem from './UseCasePipelineListItem'
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

    const removeFRequirementFromUseCaseHandler = (fRequirementId: string) => {
        ucfrListsInterfaces.removeFunctionalRequirementFromUseCase({
            useCaseId: useCaseReceived.id,
            functionalRequirementId: fRequirementId,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: 'success', text: 'Functional requirement removed from use case'}),
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

    const { isOpen: isConfirmationModalOpen, onOpen: onConfirmationModalOpen, onClose: onConfirmationModalClose} = useDisclosure()
    const { isOpen: isOpenAddFRequirementToItModal, onOpen: onOpenAddFRequirementToItModal, onClose: onCloseAddFRequirementToItModal } = useDisclosure()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>Use Case View</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" backgroundColor={'lightblue'} padding={'.5rem'}>
                        <Grid className='useCaseNameContainer' 
                        alignItems={'center'}
                        templateColumns={'1fr 2fr'}
                        >
                            Name:
                            <input 
                            style={ModalInputStyle}
                            value={useCaseEditNameInput} onChange={useCaseEditNameInputHandler} 
                            />
                        </Grid>
                        <Button colorScheme='green' mr={3} onClick={saveUseCaseEditHandler}>
                            Save Name
                        </Button>
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
                                {useCaseReceived.tagIds.map((tagId, i) => (
                                    <Flex
                                    key={tagId}
                                    >
                                        <UseCaseTag
                                        tagId={tagId}
                                        />
                                        <Button colorScheme='red' onClick={() => {removeTagHandler(tagId)}}>X</Button>
                                    </Flex>
                                ))}
                            </Flex>
                        </Flex>


                        <Accordion className={'useCasePipelinesContainer'} allowMultiple>
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
                                <button className='button' onClick={onOpenAddUseCasePipelineModal}>Add Use Case Pipeline</button>
                                <UseCaseAddPipelineModal isOpen={isOpenAddUseCasePipelineModal} onClose={onCloseAddUseCasePipelineModal} useCaseId={useCaseReceived.id} />

                                <Flex className='pipelinesList'>
                                    {useCaseReceived.useCasesPipelineIds.map((useCasePipelineId, i) => (
                                        <Flex key={useCasePipelineId}>
                                            <UseCasePipelineItem pipelineId={useCasePipelineId} useCaseId={useCaseReceived.id} />
                                        </Flex>
                                    ))}
                                </Flex>
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
                                <AddFRequirementToItModal isOpen={isOpenAddFRequirementToItModal} onClose={onCloseAddFRequirementToItModal} useCaseId={useCaseReceived.id} />

                                {(ucfrListsFromContext.modules.reduce((acc, module) => { return [...acc, ...module.useCases] }, []).find((scopedUseCase) => scopedUseCase.id === useCaseReceived.id) as IUseCase)
                                .neededFrsToWorkIds.map((dependencyId) => {
                                    return (
                                        <Flex className='FRDependency' key={dependencyId}>
                                            <FRequirementClickable fRequirementId={dependencyId} />
                                            <Button colorScheme='red' onClick={() => { removeFRequirementFromUseCaseHandler(dependencyId) }}>X</Button>
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
                        Delete Use Case
                    </Button>
                    <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose} callback={deleteUseCaseHandler}/>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UseCaseModal