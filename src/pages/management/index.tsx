import { Flex, Grid, Select, Tab, Tabs, theme } from "@chakra-ui/react";
import React from "react";
import AddModule from "../../components/modules/AddModule";
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
import SaveInLS from "../../components/ucfrListsJson/SaveInLS";
import LoadFromLs from "../../components/ucfrListsJson/LoadFromLs";
import ExportJson from "../../components/ucfrListsJson/ExportJson";
import ImportJson from "../../components/ucfrListsJson/ImportJson";
import ListModules from "../../components/modules/ListModules";
import ListTags from "../../components/tags/ListTags";


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


   const [moduleAddDisplay, setModuleAddDisplay] = React.useState<boolean>(false)
   const [modulesShowDisplay, setModulesShowDisplay] = React.useState<boolean>(false)

   const [tagEditNameDisplay, setTagEditNameDisplay] = React.useState<boolean>(false)
   const [tagDeleteDisplay, setTagDeleteDisplay] = React.useState<boolean>(false)
   const [tagAddDisplay, setTagAddDisplay] = React.useState<boolean>(false)
   const [tagsShowDisplay, setTagsShowDisplay] = React.useState<boolean>(false)



   return (
      <Flex className={'container'} 
      position={'relative'} 
      direction={'column'} 
      alignItems={'center'}
      width={'100%'} minHeight={'100vh'} 
      backgroundColor={customTheme.colors[10]} 
      color={customTheme.colors[10]}
      >
         
         <Flex className='CurrentModuleNameContainer'
         width={'100%'}
         height={'3rem'}
         alignItems={'center'}
         justifyContent={'center'}
         fontWeight={'bold'}
         backgroundColor={customTheme.colors[80]}
         >
            {currentModuleFromContext ? currentModuleFromContext.name : 'Create or select a module'}
         </Flex>

         <Grid className={'moduleManagementContainer'} 
            templateColumns={'3fr 2fr'}
            width={'100%'}
            backgroundColor={customTheme.colors[30]}
            padding={'.2rem'}
            height={'3rem'}
         >


            <Flex className='moduleSelectContainer'
            width={'100%'}
            height={'100%'}
            color={customTheme.colors[95]}
            >
               <Select className={'select'} onChange={currentModuleSelectHandler}>
                  <option value={''}>Select a module</option>
                  {ucfrListsFromContext.modules.map((module, i) => (
                     <option className={'option'} key={i} value={module.id}>{module.name}</option>
                  ))}
               </Select>
            </Flex>

            <Grid className='ManageModulesContainer' 
            gridTemplateColumns={'1fr 2fr'}
            height={'100%'}
            >
               <AddIcon height='100%' className={'button'} onClick={() => setModuleAddDisplay(!moduleAddDisplay)}/>
               <button className="showModulesListButton button"
               onClick={() => setModulesShowDisplay(true)}
               >
                  show all
               </button>

               <FullPopup display={modulesShowDisplay} setDisplay={setModulesShowDisplay}>
                  <ListModules />
               </FullPopup>

               <FullPopup display={moduleAddDisplay} setDisplay={setModuleAddDisplay}>
                  <AddModule/>
               </FullPopup>
            </Grid>

         </Grid>


         <Grid className={'tagManagementContainer'} 
            templateColumns={'3fr 2fr'}
            width={'100%'}
            backgroundColor={customTheme.colors[30]}
            padding={'.2rem'}
            height={'3rem'}
         >
            <button className="showTagsListButton button" onClick={() => setTagsShowDisplay(true)}>
               show all tags
            </button>

            <FullPopup display={tagsShowDisplay} setDisplay={setTagsShowDisplay}>
               <ListTags />
            </FullPopup>

            <Grid className='ManageTagsContainer' gridTemplateColumns={'1fr 1fr 1fr'}>
               <AddIcon height='100%' className={'button'} onClick={() => setTagAddDisplay(!tagAddDisplay)}/>
               <EditIcon height='100%'className={'button'} onClick={() => setTagEditNameDisplay(!tagEditNameDisplay)}/>
               <CloseIcon height='100%'className={'button'} onClick={() => setTagDeleteDisplay(!tagDeleteDisplay)}/>


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
         height={'3rem'}
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
               backgroundColor={selectedTabToDisplay === type ?  customTheme.colors[60] : customTheme.colors[80]}
               _hover={{backgroundColor: customTheme.colors[95]}}
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
               <Flex
               backgroundColor={"#ffdddd"}
               color={"#ff0000"}
               padding={".5rem"}
               >Select a module</Flex>
            )}
         </Flex>

         <Flex className={'jsonManegementContainer'}
         direction={'column'}
         >
            <Flex className={'jsonManegementSaveAndLoad'}>
               <SaveInLS/>
               <LoadFromLs/>
            </Flex>
            <Flex className={'jsonManegementImportAndExport'}>
               <ExportJson/>
               <ImportJson/>
            </Flex>
         </Flex>

         <Flex className="blank space at the end"
         height='5rem'/>


      </Flex>
   )
}