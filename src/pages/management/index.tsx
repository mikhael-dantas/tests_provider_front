import { Flex, Grid, Tab, Tabs, theme } from "@chakra-ui/react";
import React from "react";
import AddModule from "../../components/module/AddModule";
import DeleteModuleComponent from "../../components/module/DeleteModule";
import EditModuleName from "../../components/module/EditModuleName";
import FullPopup from "../../components/FullPopup";
import { EUcfrListsTypes, UcfrListsTypes, useCurrentModuleContext, useSelectedTabToDisplayContext, useUcfrListsContext, useUpdateCurrentModuleContext, useUpdateSelectedTabToDisplayContext, useUpdateUcfrListsContext } from "../../UcfrsContext";
import AddUseCase from "../../components/ucfrLists/useCases/AddUseCase";
import UseCasesList from "../../components/ucfrLists/useCases/UseCasesList";
import AddTag from "../../components/tags/AddTag";
import DeleteTagComponent from "../../components/tags/DeleteTag";
import EditTagName from "../../components/tags/EditTagName";
import NestedUseCaseList from "../../components/ucfrLists/nestedUseCases/NestedUseCaseList";
import FRequirementList from "../../components/ucfrLists/fRequirements/FRequirementsList";
import { AddIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { customTheme } from "../../theme";


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

   const [tagEditNameDisplay, setTagEditNameDisplay] = React.useState<boolean>(false)
   const [tagDeleteDisplay, setTagDeleteDisplay] = React.useState<boolean>(false)
   const [tagAddDisplay, setTagAddDisplay] = React.useState<boolean>(false)



   return (
      <Flex className={'container'} position={'relative'} direction={'column'} width={'100%'} minHeight={'100vh'} backgroundColor={'#93f78c'} alignItems={'center'}>
         
         <Flex className='CurrentModuleNameContainer'
         width={'100%'}
         height={'3rem'}
         alignItems={'center'}
         justifyContent={'center'}
         fontWeight={'bold'}
         >
            {currentModuleFromContext ? currentModuleFromContext.name : 'Create and select a module'}
         </Flex>

         
         <Grid className={'moduleManagementContainer'} 
            templateColumns={'2fr 1fr'}
            width={'100%'}
            backgroundColor={customTheme.colors.lightGreen5}
            padding={'.2rem'}
         >


            <Flex className='moduleSelectContainer'
            width={'100%'}
            height={'100%'}
            >
               <select className={'select moduleSelect'} onChange={currentModuleSelectHandler}>
                  <option value={''}>Select a module</option>
                  {ucfrListsFromContext.modules.map((module, i) => (
                     <option className={'option'} key={i} value={module.id}>{module.name}</option>
                  ))}
               </select>
            </Flex>

            <Grid className='ManageModulesContainer' gridTemplateColumns={'1fr 1fr 1fr'}>
               <AddIcon width='100%'height='100%'color={'white'} className={'button'} onClick={() => setModuleAddDisplay(!moduleAddDisplay)}/>
               <EditIcon width='100%'height='100%'color={'white'} className={'button'} onClick={() => setModuleEditNameDisplay(!moduleEditNameDisplay)}/>
               <CloseIcon width='100%'height='100%'color={'white'} className={'button'} onClick={() => setModuleDeleteDisplay(!moduleDeleteDisplay)}/>


               <FullPopup display={moduleEditNameDisplay} setDisplay={setModuleEditNameDisplay}>
                  <EditModuleName/>
               </FullPopup>
               <FullPopup display={moduleDeleteDisplay} setDisplay={setModuleDeleteDisplay}>
                  <DeleteModuleComponent/>
               </FullPopup>
               <FullPopup display={moduleAddDisplay} setDisplay={setModuleAddDisplay}>
                  <AddModule/>
               </FullPopup>
            </Grid>

         </Grid>


         <Grid className={'tagManagementContainer'} 
            templateColumns={'2fr 1fr'}
            width={'100%'}
            backgroundColor={customTheme.colors.lightGreen5}
            padding={'.2rem'}
         >
            tags
            <Grid className='ManageTagsContainer' gridTemplateColumns={'1fr 1fr 1fr'}>
               <AddIcon width='100%'height='100%'color={'white'} className={'button'} onClick={() => setTagAddDisplay(!tagAddDisplay)}/>
               <EditIcon width='100%'height='100%'color={'white'}className={'button'} onClick={() => setTagEditNameDisplay(!tagEditNameDisplay)}/>
               <CloseIcon width='100%'height='100%'color={'white'}className={'button'} onClick={() => setTagDeleteDisplay(!tagDeleteDisplay)}/>


               <FullPopup display={tagEditNameDisplay} setDisplay={setTagEditNameDisplay}>
                  <EditTagName/>
               </FullPopup>
               <FullPopup display={tagDeleteDisplay} setDisplay={setTagDeleteDisplay}>
                  <DeleteTagComponent/>
               </FullPopup>
               <FullPopup display={tagAddDisplay} setDisplay={setTagAddDisplay}>
                  <AddTag/>
               </FullPopup>
            </Grid>

         </Grid>


         <Flex className={'ucfrListsTabsContainer'} 
         display={'flex'} 
         justifyContent={'space-evenly'} 
         width={'100%'}
         marginTop={'.5rem'}
         >
         {UcfrListsTypes.map((type, i) => (
            <Flex className={'ucfrListsTab'} key={i} 
               onClick={() => setSelectedTabToDisplay(type)}
               display={'flex'}
               flexDirection={'column'} alignItems={'center'}
               justifyContent={'center'}
               textAlign={'center'}
               fontSize={'.9rem'}
               fontWeight={'bold'}
               style={ {backgroundColor: selectedTabToDisplay === type ?  customTheme.colors.lightGreen6 : customTheme.colors.lightGreen5} }
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
                  <FRequirementList/>
                  ) :
               selectedTabToDisplay === EUcfrListsTypes.nestedUseCases ? (
                  <NestedUseCaseList/>
               ) : null
            ) : (
               <h1>Select a module</h1>
            )}
         </Flex>


      </Flex>
   )
}