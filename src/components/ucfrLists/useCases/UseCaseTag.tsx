import { Flex, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from '../../../AlertStackContext'
import { customTheme } from '../../../theme'
import { useUcfrListsContext, useUpdateUcfrListsContext, UcfrListsContextInterfaces } from '../../../UcfrsContext'
import TagModal from '../../tags/TagModal'

function UseCaseTag({tagId: tagIdReceived}: {tagId: string}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()

    const [tagName, setTagName] = React.useState('finding name...')

    const { isOpen: isTagModalOpen, onOpen: onTagModalOpen, onClose: onTagModalClose } = useDisclosure()

    useEffect(() => {
        ucfrListsInterfaces.readTagById({tagId: tagIdReceived})
        .then((tag) => {
            setTagName(tag.name)
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "error",
                        text: error.message
                    })
                }
            ])

            setTagName('error')
        })
    }, [])

    return (
        <Flex className={'useCaseItemTag'}
        backgroundColor={customTheme.colors[45]}
        padding={'.3rem'}
        onClick={onTagModalOpen}
        cursor={'pointer'}
        >
            {tagName}
            <TagModal tagId={tagIdReceived} isOpen={isTagModalOpen} onClose={onTagModalClose} />
        </Flex>
    )
}

export default UseCaseTag