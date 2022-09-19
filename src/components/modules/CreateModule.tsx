import { Flex } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { useUcfrListsContext, useUpdateUcfrListsContext, } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { AddFormContainerStyle, AddInputStyle } from "@myStyles/GlobalStyles"
import React from "react"


export default function CreateModule() {
   // contextManagement SDK
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()
   const ucfrListsInterfaces = new UcfrListsContextInterfaces(
      ucfrListsFromContext,
      updateUcfrListsFromContext
   )
   const alertStackComponentFromContext = useAlertStackComponentContext()
   const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


   const [moduleAddInput, setModuleAddInput] = React.useState<string>("")

   const moduleAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModuleAddInput(e.target.value)
   }
   const moduleAddHandler = () => {
      ucfrListsInterfaces.createModule({moduleName: moduleAddInput})
      .then(() => {
         setModuleAddInput("")
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {component: GenerateAlertComponent({status: "success", text: "Module added successfully"})}
         ])
      })
      .catch(err => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext, 
            { component:  GenerateAlertComponent({ status: 'error', text: err.message })}
         ])
      })
   }

   return (
      <Flex className='popupContainer'
      style={AddFormContainerStyle}
      >
         <Flex className='popupContent'
         alignItems={'center'}
         >
            Name:
            <input className={'input modalInput'} 
            style={AddInputStyle}
            type="text" value={moduleAddInput} onChange={moduleAddInputHandler} 
            />
         </Flex>
         <button className={'button'}
         style={{
            marginTop: '1rem',
         }}
         onClick={moduleAddHandler}>Add Item</button>
      </Flex>
   )
}