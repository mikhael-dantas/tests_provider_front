import { useDisclosure, Flex } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { useUcfrListsContext, useUpdateUcfrListsContext } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import React, { useEffect } from "react"
import TagModal from "./TagModal"



function TagClickable({
    tagId: tagIdReceived,
    style: styleReceived
}: {
    tagId: string
    style?: object
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
        style={styleReceived ? styleReceived : {}}
        onClick={onTagModalOpen}
        cursor={'pointer'}
        >
            {tagName}
            <TagModal tagId={tagIdReceived} isOpen={isTagModalOpen} onClose={onTagModalClose} />
        </Flex>
    )
}

export default TagClickable