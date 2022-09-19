import { Flex } from "@chakra-ui/react"
import { useUcfrListsContext } from "@myContexts/UcfrsContext"
import { ModalListStyle } from "@myStyles/GlobalStyles"
import ListTagsItem from "./ListTagsItem"


function ListTags() {
    const ucfrListsFromContext = useUcfrListsContext()
    return (
        <Flex direction="column" alignItems={"center"}
        style={ModalListStyle}
        >
            {ucfrListsFromContext.tags.map(t => (
                <ListTagsItem key={t.id} tag={t}/>
            ))}
        </Flex>
    )
}

export default ListTags