import { AddIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Grid } from "@chakra-ui/react";
import React from "react";
import FullPopup from "../../components/FullPopup";
import AddModule from "../../components/modules/AddModule";
import ListModules from "../../components/modules/ListModules";
import AddTag from "../../components/tags/AddTag";
import ListTags from "../../components/tags/ListTags";
import FRequirementList from "../../components/ucfrLists/fRequirements/FRequirementsList";
import NestedUseCaseList from "../../components/ucfrLists/nestedUseCases/NestedUseCaseList";
import AddUseCase from "../../components/ucfrLists/useCases/AddUseCase";
import UseCasesList from "../../components/ucfrLists/useCases/UseCasesList";
import ExportJson from "../../components/ucfrListsJson/ExportJson";
import ImportJson from "../../components/ucfrListsJson/ImportJson";
import LoadFromLs from "../../components/ucfrListsJson/LoadFromLs";
import SaveInLS from "../../components/ucfrListsJson/SaveInLS";
import { customTheme } from "../../theme";
import { EUcfrListsTypes, UcfrListsTypes, useCurrentModuleContext, useSelectedTabToDisplayContext, useUcfrListsContext, useUpdateCurrentModuleContext, useUpdateSelectedTabToDisplayContext } from "../../UcfrsContext";


export default function Index() {
   console.log("render index");
   const currentModuleFromContext = useCurrentModuleContext()
   const updateCurrentModuleFromContext = useUpdateCurrentModuleContext()

   const selectedTabToDisplay = useSelectedTabToDisplayContext()
   const setSelectedTabToDisplay = useUpdateSelectedTabToDisplayContext()
   
   const ucfrListsFromContext = useUcfrListsContext()


   const currentModuleSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedModule = ucfrListsFromContext.modules.find(m => m.id === e.target.value)
      if (!selectedModule) {
         return
      }
      updateCurrentModuleFromContext(selectedModule)
   }


   const [moduleAddDisplay, setModuleAddDisplay] = React.useState<boolean>(false)
   const [modulesShowDisplay, setModulesShowDisplay] = React.useState<boolean>(false)

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
         height={'4rem'}
         alignItems={'center'}
         justifyContent={'space-between'}
         fontWeight={'bold'}
         backgroundColor={customTheme.colors[80]}
         >
            {currentModuleFromContext ? currentModuleFromContext.name : 'Create or select a module'}
            <Flex className='moduleSelectContainer'
            width={'40%'}
            height={'80%'}
            color={customTheme.colors[95]}
            >
               <select className={'select'} style={{width: '100%'}}onChange={currentModuleSelectHandler}>
                  <option value={''}>Select a module</option>
                  {ucfrListsFromContext.modules.map((module, i) => (
                     <option className={'option'} key={i} value={module.id}>{module.name}</option>
                  ))}
               </select>
            </Flex>
         </Flex>

         <Accordion className={'ModulesAndTagsAccordionContainer'} defaultIndex={[0]} allowMultiple 
         width={'100%'}
         >
            <AccordionItem backgroundColor={customTheme.colors[60]} width='100%'>
               <h1>
                  <AccordionButton>
                  <Box flex='1' textAlign='left'>
                     {"Modules & Tags"}
                  </Box>
                  <AccordionIcon />
                  </AccordionButton>
               </h1>
               <AccordionPanel pb={4}>
                  <Grid className={'moduleManagementContainer'} 
                     templateColumns={'1fr'}
                     width={'100%'}
                     backgroundColor={customTheme.colors[30]}
                     padding={'.2rem'}
                     height={'3rem'}
                  >

                     <Grid className='ManageModulesContainer' 
                     gridTemplateColumns={'20fr 1fr 20fr'}
                     height={'100%'}
                     >
                        <button className="showModulesListButton button"
                        onClick={() => setModulesShowDisplay(true)}
                        >
                           Show all Modules
                        </button>
                        <div></div>
                        <Flex className={'button'} 
                        onClick={() => setModuleAddDisplay(!moduleAddDisplay)}
                        alignItems={'center'}
                        justifyContent={'center'}
                        >
                           <AddIcon height='100%' marginRight={'.5rem'}/>
                           {'Module'}
                        </Flex>

                        <FullPopup display={modulesShowDisplay} setDisplay={setModulesShowDisplay}>
                           <ListModules />
                        </FullPopup>

                        <FullPopup display={moduleAddDisplay} setDisplay={setModuleAddDisplay}>
                           <AddModule/>
                        </FullPopup>
                     </Grid>
                     

                  </Grid>

                  <Grid className={'tagManagementContainer'} 
                     templateColumns={'20fr 1fr 20fr'}
                     width={'100%'}
                     backgroundColor={customTheme.colors[30]}
                     padding={'.2rem'}
                     height={'3rem'}
                  >
                     <button className="showTagsListButton button" onClick={() => setTagsShowDisplay(true)}>
                        Show all Tags
                     </button>

                     <div></div>

                     <Flex className='ManageTagsContainer button'
                     alignItems={'center'}
                     justifyContent={'center'}
                     onClick={() => setTagAddDisplay(!tagAddDisplay)}
                     >
                        <AddIcon height='100%' marginRight={'.5rem'}/>
                        Tag

                        <FullPopup display={tagAddDisplay} setDisplay={setTagAddDisplay}>
                           <AddTag/>
                        </FullPopup>
                     </Flex>

                     <FullPopup display={tagsShowDisplay} setDisplay={setTagsShowDisplay}>
                        <ListTags />
                     </FullPopup>

                  </Grid>
               </AccordionPanel>
            </AccordionItem>
         </Accordion>

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

         <Flex className={'jsonManagementContainer'}
         direction={'column'}
         marginTop={'3rem'}
         borderTop={'1px solid black'}
         padding={'.5rem'}
         borderBottom={'1px solid black'}
         >
            <Flex className={'jsonManagementSaveAndLoad'}
            justifyContent={'space-around'}
            width={'100%'}
            >
               <SaveInLS/>
               <LoadFromLs/>
            </Flex>
            <Flex
            marginTop={'1rem'}
            >
               <ImportJson/>

            </Flex>
            <Flex className={'jsonManagementImportAndExport'}
            marginTop={'.5rem'}
            >
               <ExportJson/>
            </Flex>
         </Flex>

         <Flex className="blank space at the end"
         height='5rem'/>


      </Flex>
   )
}