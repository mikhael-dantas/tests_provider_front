import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { customTheme } from '../../../../theme'
import ConfirmationModal from '../../../ConfirmationModal'

function FRequirementModal({
    fRequirementId: fRequirementIdReceived,
    isOpen: isOpenReceived,
    onClose: onCloseReceived,
}: {
    fRequirementId: string,
    isOpen: boolean,
    onClose: () => void,
}) {

    const { isOpen: isConfirmationModalOpen, onOpen: onConfirmationModalOpen, onClose: onConfirmationModalClose } = useDisclosure()
    return (
        <Modal isOpen={isOpenReceived} onClose={onCloseReceived}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>Functional Requirement View</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" backgroundColor={'lightblue'} padding={'.5rem'}>
                        oie
                        {/* <Grid className='nestedUseCaseNameContainer' 
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


                        <Accordion className={'nestedUseCasePipelinesContainer'} allowMultiple>
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
                                lala
                            </AccordionPanel>
                            </AccordionItem>
                        </Accordion> */}

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
            <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose}  callback={() => {}}/>
        </Modal>
    )
}

export default FRequirementModal