import { useDisclosure, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Grid, Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, ModalFooter } from "@chakra-ui/react"
import ConfirmationModal from "@myComponents/ConfirmationModal"
import TagClickable from "@myComponents/tags/TagClickable"
import FRequirementClickable from "@myComponents/ucfrLists/fRequirements/FRequirementClickable"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { useUcfrListsContext, useUpdateUcfrListsContext,  INestedUseCase } from "@myContexts/UcfrsContext"
import { customTheme, ModalInputStyle } from "@myStyles/GlobalStyles"
import React, { useEffect } from "react"
import AddFRequirementToItModal from "./fRequirementRelation/AddFRequirementToItModal"
import NestedUseCaseAddPipelineModal from "./pipelineRelation/NestedUseCaseAddPipelineModal"
import NestedUseCasePipelinesList from "./pipelineRelation/NestedUseCasePipelinesList"
import NestedUseCaseAddTagModal from "./tagRelation/NestedUseCaseAddTagModal"


function NestedUseCaseModal({nestedUseCase: nestedUseCaseReceived, isOpen: isOpenReceived, onClose: onCloseReceived}: {nestedUseCase: INestedUseCase, isOpen: boolean, onClose: () => void}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const [nestedUseCaseEditNameInput, setNestedUseCaseEditNameInput] = React.useState(nestedUseCaseReceived.name)

    const nestedUseCaseEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNestedUseCaseEditNameInput(e.target.value)
    }

    const saveNestedUseCaseEditNameHandler = () => {
        ucfrListsInterfaces.updateNestedUseCaseById({
            completed: false,
            name: nestedUseCaseEditNameInput,
            nestedUseCaseId: nestedUseCaseReceived.id
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
            nestedUseCaseId: nestedUseCaseReceived.id,
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
            nestedUseCaseId: nestedUseCaseReceived.id,
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
            nestedUseCaseId: nestedUseCaseReceived.id,
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
                                <NestedUseCaseAddTagModal isOpen={isOpenAddTagModal} onClose={onCloseAddTagModal} nestedUseCaseId={nestedUseCaseReceived.id} />
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
                                }, []).find((nestedUseCase) => nestedUseCase.id === nestedUseCaseReceived.id)?.tagIds.map((tagId) => {
                                    return (
                                        <Flex
                                        key={tagId}
                                        >
                                            <TagClickable
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
                                <NestedUseCaseAddPipelineModal isOpen={isOpenAddNestedUseCasePipelineModal} onClose={onCloseAddNestedUseCasePipelineModal} nestedUseCaseId={nestedUseCaseReceived.id} />

                                <NestedUseCasePipelinesList nestedUseCaseId={nestedUseCaseReceived.id} />
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
                                <AddFRequirementToItModal isOpen={isOpenAddFRequirementToItModal} onClose={onCloseAddFRequirementToItModal} nestedUseCaseId={nestedUseCaseReceived.id} />

                                {(ucfrListsFromContext.modules.reduce((acc, module) => { return [...acc, ...module.nestedUseCases] }, []).find((nestedUseCase) => nestedUseCase.id === nestedUseCaseReceived.id) as INestedUseCase)
                                .neededFrsToWorkIds.map((dependencyId) => {
                                    const fRequirement = ucfrListsFromContext.modules.reduce((acc, module) => { return [...acc, ...module.functionalRequirements] }, []).find((fr) => fr.id === dependencyId)
                                    if (!fRequirement) return (<>error</>)
                                    return (
                                        <FRequirementClickable key={dependencyId} fRequirement={fRequirement}>
                                            <Flex className='FRDependency' >
                                                <h1>
                                                    {fRequirement.name}
                                                </h1>
                                                <Button colorScheme='red' onClick={() => { removeFRequirementFromNestedUseCaseHandler(dependencyId) }}>X</Button>
                                            </Flex>
                                        </FRequirementClickable>
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