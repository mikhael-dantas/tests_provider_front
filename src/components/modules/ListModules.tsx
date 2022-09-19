import { Flex } from "@chakra-ui/react"
import { useUcfrListsContext } from "@myContexts/UcfrsContext"
import { ModalListStyle } from "@myStyles/GlobalStyles"
import ListModulesItem from "./ListModulesItem"


function ListModules() {
    const ucfrListsFromContext = useUcfrListsContext()


    return (
        <Flex direction="column" alignItems={"center"}
        style={ModalListStyle}
        >
            {ucfrListsFromContext.modules.map(m => (
                <ListModulesItem key={m.id} module={m}/>
            ))}
        </Flex>
    )
}

export default ListModules