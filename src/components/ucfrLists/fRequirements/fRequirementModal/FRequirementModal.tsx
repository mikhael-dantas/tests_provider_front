import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../../AlertStackContext'
import { customTheme } from '../../../../theme'
import { IFunctionalRequirement, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../../UcfrsContext'
import ConfirmationModal from '../../../ConfirmationModal'
import { ModalInputStyle } from '../../../GlobalStyles'
import TagClickable from '../../../tags/TagClickable'
import AddTagToItModal from './tagRelation/AddTagToItModal'

function FRequirementModal({
    fRequirementId: fRequirementIdReceived,
    isOpen: isOpenReceived,
    onClose: onCloseReceived,
}: {
    fRequirementId: string,
    isOpen: boolean,
    onClose: () => void,
}) {

    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const [editFRequirementNameInput, setEditFRequirementNameInput] = React.useState('')
    
    const handleEditFRequirementNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditFRequirementNameInput(event.target.value)
    }

    const saveFRequirementNameHandler = () => {
        ucfrListsInterfaces.updateFunctionalRequirementById({
            functionalRequirementId: fRequirementIdReceived,
            done: false,
            name: editFRequirementNameInput,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'FRequirement name updated' }),
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

    const removeTagFromFRHandler = (tagId: string) => {
        ucfrListsInterfaces.removeTagFromFunctionalRequirementById({
            functionalRequirementId: fRequirementIdReceived,
            tagId: tagId,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'Tag removed from FRequirement' }),
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


    const deleteFRequirementHandler = () => {
        ucfrListsInterfaces.removeFunctionalRequirementById({
            functionalRequirementId: fRequirementIdReceived,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'FRequirement deleted' }),
                }
            ])
            onCloseReceived()
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
        if (isOpenReceived) {
            ucfrListsInterfaces.readFunctionalRequirementById({
                functionalRequirementId: fRequirementIdReceived,
            })
            .then((fRequirement) => {
                setEditFRequirementNameInput(fRequirement.name)
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
    }, [isOpenReceived])

    
    const { isOpen: isOpenAddTagToItModal, onOpen: onOpenAddTagToItModal, onClose: onCloseAddTagToItModal } = useDisclosure()

    const { isOpen: isConfirmationModalOpen, onOpen: onConfirmationModalOpen, onClose: onConfirmationModalClose } = useDisclosure()
    return (
        <Modal isOpen={isOpenReceived} onClose={onCloseReceived}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>Functional Requirement View</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" backgroundColor={'lightblue'} padding={'.5rem'}>
                        <Grid className='FRequirementNameContainer' 
                        alignItems={'center'}
                        templateColumns={'1fr 2fr'}
                        >
                            Name:
                            <input 
                            style={ModalInputStyle}
                            value={editFRequirementNameInput} onChange={handleEditFRequirementNameInputChange} 
                            />
                        </Grid>
                        <Button colorScheme='green' mr={3} onClick={saveFRequirementNameHandler}>
                            Save Name
                        </Button>
                        <Flex className='FRequirementTagsContainer' direction={'column'} marginTop={'1rem'}>
                            <Flex className='AddTagContainer'>
                                Tags:
                                <button className='button' onClick={onOpenAddTagToItModal}>+</button>
                                <AddTagToItModal isOpen={isOpenAddTagToItModal} onClose={onCloseAddTagToItModal} fRequirementId={fRequirementIdReceived} />
                            </Flex>
                            <Flex className={'FRequirementTags'}
                            width={'95%'}
                            margin={'0 auto'}
                            backgroundColor={customTheme.colors[60]}
                            flexWrap={'wrap'}
                            justifyContent={'space-around'}
                            fontSize={'.8rem'}
                            padding={'.3rem'}
                            color={customTheme.colors[10]}
                            >
                                {(ucfrListsFromContext.modules.reduce((acc, module) => {
                                    return [...acc, ...module.functionalRequirements]
                                }, []).find((fRequirement) => fRequirement.id === fRequirementIdReceived) as IFunctionalRequirement)?.tagIds.map((scopedTagId) => {
                                    return (
                                        <Flex className='tag'
                                        key={scopedTagId}
                                        >
                                            <TagClickable
                                            tagId={scopedTagId}
                                            />
                                            <Button colorScheme='red' onClick={
                                                () => { removeTagFromFRHandler(scopedTagId) }
                                            }>X</Button>
                                        </Flex>
                                    )
                                })}
                            </Flex>
                        </Flex>


                        <Accordion className={'FRDependenciesContainer'} allowMultiple>
                            <AccordionItem>
                            <h2>
                                <AccordionButton>
                                <Box flex='1' textAlign='left' color='black'>
                                    FR dependencies
                                </Box>
                                <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                {/* <button className='button' onClick={onOpenAddNestedUseCasePipelineModal}>Add Nested Use Case Pipeline</button>
                                <NestedUseCaseAddPipelineModal isOpen={isOpenAddNestedUseCasePipelineModal} onClose={onCloseAddNestedUseCasePipelineModal} nestedUseCaseId={nestedUseCaseIdReceived} />

                                <NestedUseCasePipelinesList nestedUseCaseId={nestedUseCaseIdReceived} /> */}
                            </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} 
                    onClick={onConfirmationModalOpen}
                    >
                        Delete Functional Requirement
                    </Button>
                </ModalFooter>
            </ModalContent>
            <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose}  callback={deleteFRequirementHandler}/>
        </Modal>
    )
}

export default FRequirementModal