import { Flex, Grid, Tab, Tabs } from "@chakra-ui/react";
import React from "react";
import AddModule from "../../components/module/AddModule";
import DeleteModuleComponent from "../../components/module/DeleteModule";
import EditModuleName from "../../components/module/EditModuleName";
import FullPopup from "../../components/FullPopup";
import { EUcfrListsTypes, UcfrListsTypes, useCurrentModuleContext, useSelectedTabToDisplayContext, useUcfrListsContext, useUpdateCurrentModuleContext, useUpdateSelectedTabToDisplayContext, useUpdateUcfrListsContext } from "../../UcfrsContext";
import AddUseCase from "../../components/ucfrLists/useCases/AddUseCase";
import UseCasesList from "../../components/ucfrLists/useCases/UseCasesList";


export default function Index() {
   const currentModuleFromContext = useCurrentModuleContext()
   const updateCurrentModuleFromContext = useUpdateCurrentModuleContext()

   const selectedTabToDisplay = useSelectedTabToDisplayContext()
   const setSelectedTabToDisplay = useUpdateSelectedTabToDisplayContext()
   
   const ucfrListsFromContext = useUcfrListsContext()
   // const updateUcfrListsFromContext = useUpdateUcfrListsContext()



   const currentModuleSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedModule = ucfrListsFromContext.modules.find(m => m.id === e.target.value)
      if (!selectedModule) {
         return
      }
      updateCurrentModuleFromContext(selectedModule)
   }


   const [moduleEditNameDisplay, setModuleEditNameDisplay] = React.useState<boolean>(false)
   const [moduleDeleteDisplay, setModuleDeleteDisplay] = React.useState<boolean>(false)
   const [moduleAddDisplay, setModuleAddDisplay] = React.useState<boolean>(false)



   return (
      <Flex className={'container'} direction={'column'} width={'100%'} minHeight={'100vh'} backgroundColor={'#93f78c'} alignItems={'center'}>
         <Grid className={'moduleManagementContainer'} 
            templateColumns={'2fr 1fr'}
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

            <Flex className='ManageModulesContainer' direction={'row'}>
               <button className={'button'} onClick={() => setModuleAddDisplay(!moduleAddDisplay)}>Ad</button>
               <button className={'button'} onClick={() => setModuleEditNameDisplay(!moduleEditNameDisplay)}>Ed</button>
               <button className={'button'} onClick={() => setModuleDeleteDisplay(!moduleDeleteDisplay)}>De</button>
            </Flex>


         </Grid>

         <Flex className='CurrentModuleNameContainer'>
            <h1>{currentModuleFromContext ? currentModuleFromContext.name : 'Create and select a module'}</h1>
         </Flex>


         <Flex display={'flex'} justifyContent={'space-evenly'} width={'100%'}>
         {UcfrListsTypes.map((type, i) => (
            <Flex key={i} className={'ucfrListsTab'} 
               onClick={() => setSelectedTabToDisplay(type)}
               display={'flex'}
               flexDirection={'column'} alignItems={'center'}
               justifyContent={'center'}
               textAlign={'center'}
               fontSize={'.9rem'}
               fontWeight={'bold'}
               style={ selectedTabToDisplay === type ? {backgroundColor: '#aded'} : {backgroundColor: '#a0ff'} }
               width={'33%'}
               maxWidth={'33%'}
               cursor={'pointer'}
               textOverflow={'clip'}
            >
               {type}
            </Flex>
         ))}
         </Flex>


         <Flex className={'ucfrListsContainer'}
            direction={'column'}
            width={'100%'}
            alignItems={'center'}
         >
            {currentModuleFromContext ? (
               selectedTabToDisplay === EUcfrListsTypes.useCases ? (
                  <>
                     <AddUseCase/>
                     <UseCasesList/>
                  </>
               ) :
               selectedTabToDisplay === EUcfrListsTypes.functionalRequirements ? (
                  <div>frbye</div>
                  ) :
               selectedTabToDisplay === EUcfrListsTypes.nestedUseCases ? (
                  <div>nucfr</div>
               ) : null
            ) : (
               <h1>Select a module</h1>
            )}
         </Flex>



         <FullPopup display={moduleEditNameDisplay} setDisplay={setModuleEditNameDisplay}>
            <EditModuleName/>
         </FullPopup>
         <FullPopup display={moduleDeleteDisplay} setDisplay={setModuleDeleteDisplay}>
            <DeleteModuleComponent/>
         </FullPopup>
         <FullPopup display={moduleAddDisplay} setDisplay={setModuleAddDisplay}>
            <AddModule/>
         </FullPopup>
      </Flex>
   )
}