import { Flex } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { useUcfrListsContext, useUpdateUcfrListsContext } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { AddFormContainerStyle, AddInputStyle } from "@myStyles/GlobalStyles"
import React from "react"



export default function CreateTag() {
   // contextManagement SDK
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()
   const ucfrListsInterfaces = new UcfrListsContextInterfaces(
      ucfrListsFromContext,
      updateUcfrListsFromContext
   )
   const alertStackComponentFromContext = useAlertStackComponentContext()
   const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


   const [TagAddInput, setTagAddInput] = React.useState<string>("")
   const [TagAddDescriptionInput, setTagAddDescriptionInput] = React.useState<string>("")

   const TagAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTagAddInput(e.target.value)
   }
   const TagAddDescriptionInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTagAddDescriptionInput(e.target.value)
   }

   const TagAddHandler = () => {
      ucfrListsInterfaces.createTag({tagName: TagAddInput, tagDescription: TagAddDescriptionInput})
      .then(() => {
         setTagAddInput("")
         setTagAddDescriptionInput("")
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({status: "success", text: "Tag added successfully"}),
            }
         ])
      })
      .catch((err) => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({status: "error", text: err.message}),
            }
         ])
      })
   }

   return (
      <Flex direction="column"
      style={AddFormContainerStyle}
      >
         Add Tag
         <Flex alignItems={'center'}>
            Name:
            <input className={'input'} style={AddInputStyle} type="text" value={TagAddInput} onChange={TagAddInputHandler} />
         </Flex>
         <Flex alignItems={'center'}>
            Description:
            <input className={'input'} style={AddInputStyle} type="text" value={TagAddDescriptionInput} onChange={TagAddDescriptionInputHandler} />
         </Flex>
         <button className={'button'} onClick={TagAddHandler}>Add Item</button>
      </Flex>
   )
}