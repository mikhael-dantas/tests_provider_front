import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import { usePopupComponentContext, usePopupComponentDisplayContext, useUpdatePopupComponentContext, useUpdatePopupComponentDisplayContext } from "../../PopupContext";
import { useCurrentModuleContext, useUcfrListsContext, useUpdateCurrentModuleContext, useUpdateUcfrListsContext } from "../../UcfrsContext";
import { GenerateUUID } from "../../utils/UUIDGenerator";


export default function Index() {
   const currentModuleFromContext = useCurrentModuleContext()
   const updateCurrentModuleFromContext = useUpdateCurrentModuleContext()

   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()

   const popupComponentFromContext = usePopupComponentContext()
   const setPopupComponentFromContext = useUpdatePopupComponentContext()

   const popupComponentDisplayFromContext = usePopupComponentDisplayContext()
   const setPopupComponentDisplayFromContext = useUpdatePopupComponentDisplayContext()



   const [moduleAddInput, setModuleAddInput] = React.useState<string>("")


   const currentModuleSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedModule = ucfrListsFromContext.modules.find(m => m.id === e.target.value)
      if (!selectedModule) {
         return
      }
      updateCurrentModuleFromContext(selectedModule)
   }

   const moduleAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModuleAddInput(e.target.value)
   }
   const addModuleHandler = () => {
      const alreadyExists = ucfrListsFromContext.modules.find(m => m.name === moduleAddInput)
      if (alreadyExists) {
         return
      }

      const newModule = {
         id: GenerateUUID(),
         name: moduleAddInput,
      }
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules, newModule]
      })
      setModuleAddInput("")
   }


   const togglePopuptest = () => {
      setPopupComponentFromContext(<div style={{
         width: '100px',
         height: '100px',
         backgroundColor: '#000',
      }}>oie</div>)
      setPopupComponentDisplayFromContext(true)
   }

   const testComponent = () => {
      const component = (
         <Flex 
         justifyContent="center" 
         alignItems="center" 
         width={"50%"}
         height="50vh"
         backgroundColor={'white'}
         >oie</Flex>
      )
      return component
   }

   return (
      <Flex width={'100%'} minHeight={'100vh'} backgroundColor={'#93f78c'} alignItems={'center'}>
         <Grid className={'ucfrsManagementContainer'} 
            templateColumns={'1fr 2fr 1fr'}
            width={'100%'}
            backgroundColor={'#a0ffb0'}
            padding={'.5rem'}
            borderRadius={'5px'}
         >


            <Flex className='moduleSelectContainer'>
               <select className={'select moduleSelect'} onChange={currentModuleSelectHandler}>
                  <option value={''}>Select a module</option>
                  {ucfrListsFromContext.modules.map((module, i) => (
                     <option className={'option'} key={i} value={module.id}>{module.name}</option>
                  ))}
               </select>
            </Flex>

            <Flex className='CurrentModuleNameContainer'>
               <h1>{currentModuleFromContext ? currentModuleFromContext.name : 'Create and select a module'}</h1>
            </Flex>

            <Flex className='ManageModulesContainer' direction={'column'}>
               <input className={'input'} type="text" value={moduleAddInput} onChange={moduleAddInputHandler} />
               <button className={'button'} onClick={addModuleHandler}>Add Item</button>
               {/* <button className={'button'} onClick={delModuleHandler}>Remove</button> */}
            </Flex>


         </Grid>
      </Flex>
   )
}