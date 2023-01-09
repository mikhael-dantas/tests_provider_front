import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Grid, Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, ModalFooter, Box } from "@chakra-ui/react"
import ConfirmationModal from "@myComponents/ConfirmationModal"
import TagClickable from "@myComponents/tags/TagClickable"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { useUcfrListsContext, useUpdateUcfrListsContext, IFunctionalRequirement } from "@myContexts/UcfrsContext"
import { customTheme, ModalInputStyle } from "@myStyles/GlobalStyles"
import React, { useEffect } from "react"
import FRequirementClickable from "../FRequirementClickable"
import AddFRequirementToItModal from "./fRequirementRelation/AddFRequirementToIt"
import AddTagToItModal from "./tagRelation/AddTagToItModal"


function FRequirementModal({
    fRequirement: fRequirementReceived,
    isOpen: isOpenReceived,
    onClose: onCloseReceived,
}: {
    fRequirement: IFunctionalRequirement,
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


    const [editFRequirementNameInput, setEditFRequirementNameInput] = React.useState(fRequirementReceived.name)
    
    const handleEditFRequirementNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditFRequirementNameInput(event.target.value)
    }

    const saveFRequirementNameHandler = () => {
        ucfrListsInterfaces.updateFunctionalRequirementById({
            functionalRequirementId: fRequirementReceived.id,
            done: fRequirementReceived.done,
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
            functionalRequirementId: fRequirementReceived.id,
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

    const removeFRequirementFromFRHandler = (fRequirementId: string) => {
        ucfrListsInterfaces.removeFunctionalRequirementFromFunctionalRequirement({
            functionalRequirementReceiverId: fRequirementReceived.id,
            functionalRequirementId: fRequirementId,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'FRequirement removed from FRequirement' }),
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
            functionalRequirementId: fRequirementReceived.id,
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
                functionalRequirementId: fRequirementReceived.id,
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
    const { isOpen: isOpenAddFRequirementToItModal, onOpen: onOpenAddFRequirementToItModal, onClose: onCloseAddFRequirementToItModal } = useDisclosure()

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
                                <AddTagToItModal isOpen={isOpenAddTagToItModal} onClose={onCloseAddTagToItModal} fRequirementId={fRequirementReceived.id} />
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
                                {fRequirementReceived.tagIds.map((scopedTagId) => {
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
                                <button className='button' onClick={onOpenAddFRequirementToItModal}>Add Functional Requirement</button>
                                <AddFRequirementToItModal fRequirementId={fRequirementReceived.id} isOpen={isOpenAddFRequirementToItModal} onClose={onCloseAddFRequirementToItModal} />

                                {fRequirementReceived.frDependencies.map((dependencyId) => {
                                    const fRequirementToReturn = ucfrListsFromContext.modules.reduce
                                    ((acc, module) => { return acc.concat(module.functionalRequirements) }, []).find
                                    ((fRequirementScoped) => { return fRequirementScoped.id === dependencyId })

                                    return fRequirementToReturn ? (
                                        <Flex className='FRDependency' key={fRequirementToReturn.id}>
                                            <FRequirementClickable fRequirement={fRequirementToReturn} />
                                            <Button colorScheme='red' onClick={() => { removeFRequirementFromFRHandler(dependencyId) }}>X</Button>
                                        </Flex>
                                    ) : null
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
                        Delete Functional Requirement
                    </Button>
                </ModalFooter>
            </ModalContent>
            <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose}  callback={deleteFRequirementHandler}/>
        </Modal>
    )
}

export default FRequirementModal