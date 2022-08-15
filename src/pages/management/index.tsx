import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import AddModule from "../../components/module/AddModule";
import DeleteModuleComponent from "../../components/module/DeleteModule";
import EditModuleName from "../../components/module/EditModuleName";
import FullPopup from "../../components/FullPopup";
import { EUcfrListsTypes, UcfrListsTypes, useCurrentModuleContext, useSelectedTabToDisplayContext, useUcfrListsContext, useUpdateCurrentModuleContext, useUpdateSelectedTabToDisplayContext, useUpdateUcfrListsContext } from "../../UcfrsContext";


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
               <button className={'button'} onClick={() => setModuleAddDisplay(!moduleAddDisplay)}>Add</button>
               <button className={'button'} onClick={() => setModuleEditNameDisplay(!moduleEditNameDisplay)}>Edit Item</button>
               <button className={'button'} onClick={() => setModuleDeleteDisplay(!moduleDeleteDisplay)}>Delete</button>
            </Flex>


         </Grid>


         <Grid className={'ucfrListsTabsContainer'}
            templateColumns={'1fr 1fr 1fr'}
            width={'100%'}
         >
            {/* make a selection to select which type of ucfrListType to show */}
            {UcfrListsTypes.map((type, i) => (
               <Flex key={i} className={'ucfrListsTab'} direction={'column'} alignItems={'center'}
                  onClick={() => setSelectedTabToDisplay(type)}
               >
                  <h1
                     style={ selectedTabToDisplay === type ? {backgroundColor: '#fff'} : {backgroundColor: '#a0ff'} }
                  >{type}</h1>
               </Flex>
            ))}
         </Grid>


         <Flex className={'ucfrListsContainer'}
            direction={'column'}
            width={'100%'}
            alignItems={'center'}
         >
            {selectedTabToDisplay === EUcfrListsTypes.useCases ? (
               <div>ucoie</div>
            ) :
            selectedTabToDisplay === EUcfrListsTypes.functionalRequirements ? (
               <div>frbye</div>
            ) :
            selectedTabToDisplay === EUcfrListsTypes.nestedUseCases ? (
               <div>nucfr</div>
            ) : null}
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