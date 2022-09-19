import { useDisclosure, Flex } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { useUcfrListsContext, useUpdateUcfrListsContext } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { customTheme } from "@myStyles/GlobalStyles"
import React, { useEffect } from "react"
import FRequirementModal from "./fRequirementModal/FRequirementModal"



export default function FRequirementClickable({fRequirementId: fRequirementIdReceived}: {fRequirementId: string}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()

    const [fRequirementName, setFRequirementName] = React.useState('finding name...')

    const { isOpen: isFRequirementModalOpen, onOpen: onFRequirementModalOpen, onClose: onFRequirementModalClose } = useDisclosure()

    useEffect(() => {
        ucfrListsInterfaces.readFunctionalRequirementById({functionalRequirementId: fRequirementIdReceived})
        .then((fRequirement) => {
            setFRequirementName(fRequirement.name)
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

            setFRequirementName('error')
        })
    }, [])

    return (
        <Flex className={'useCaseItemTag'}
        backgroundColor={customTheme.colors[45]}
        padding={'.3rem'}
        onClick={onFRequirementModalOpen}
        cursor={'pointer'}
        >
            {fRequirementName}
            <FRequirementModal fRequirementId={fRequirementIdReceived} isOpen={isFRequirementModalOpen} onClose={onFRequirementModalClose} />
        </Flex>
    )
}