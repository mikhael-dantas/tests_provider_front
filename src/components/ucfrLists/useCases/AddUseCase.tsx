import { Grid } from "@chakra-ui/react"
import React from "react"
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from "../../../AlertStackContext"
import { UcfrListsContextInterfaces, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext"
import { GenerateUUID } from "../../../utils/UUIDGenerator"

export default function AddUseCase() {
   // contextManagement SDK
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()
   const ucfrListsInterfaces = new UcfrListsContextInterfaces(
      ucfrListsFromContext,
      updateUcfrListsFromContext
   )
   const alertStackComponentFromContext = useAlertStackComponentContext()
   const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()

   const currentModuleFromContext = useCurrentModuleContext()


   const [useCaseAddInput, setUseCaseAddInput] = React.useState<string>("")

   const useCaseAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUseCaseAddInput(e.target.value)
   }

   const useCaseAddHandler = () => {
      ucfrListsInterfaces.createUseCase({
         moduleId: currentModuleFromContext.id,
         name: useCaseAddInput,
      })
      .then((fUseCase) => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({
                  status: "success",
                  text: "Use Case Added",
               })
            }
         ])
         setUseCaseAddInput("")
      })
      .catch((fError) => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({
                  status: "error",
                  text: fError.message,
               })
            }
         ])
      })
   }

   return (
      <Grid className={'ucfrsListContainer'} 
         templateColumns={'3fr 1fr'}
         width={'90%'}
         margin={'0 auto'}
         marginTop={'.5rem'}
         height={'3rem'}
      >
         <input style={{}}className={'input'} type={'text'} value={useCaseAddInput} onChange={useCaseAddInputHandler} placeholder={'Add a useCase'} />
         <button className={'button'} onClick={useCaseAddHandler}>Add</button>
      </Grid>
   )
}