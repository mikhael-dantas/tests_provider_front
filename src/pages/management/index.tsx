import { AddIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Grid, useDisclosure } from "@chakra-ui/react";
import React from "react";
import FullPopup from "@myComponents/FullPopup";
import CreateModule from "@myComponents/modules/CreateModule";
import ListModules from "@myComponents/modules/ListModules";
import CreateTag from "@myComponents/tags/CreateTag";
import ListTags from "@myComponents/tags/ListTags";
import FRequirementList from "@myComponents/ucfrLists/fRequirements/FRequirementsList";
import NestedUseCaseList from "@myComponents/ucfrLists/nestedUseCases/nestedUseCaseList/NestedUseCaseList";
import CreateUseCase from "@myComponents/ucfrLists/useCases/CreateUseCase";
import UseCasesList from "@myComponents/ucfrLists/useCases/useCaseList/UseCasesList";
import CopyToClipboard from "@myComponents/ucfrListsJson/CopyToClipboard";
import ExportJson from "@myComponents/ucfrListsJson/ExportJson";
import ImportJson from "@myComponents/ucfrListsJson/ImportJson";
import LoadFromLs from "@myComponents/ucfrListsJson/LoadFromLs";
import SaveInLS from "@myComponents/ucfrListsJson/SaveInLS";
import { EUcfrListsTypes, UcfrListsTypes, useCurrentModuleContext, useSelectedTabToDisplayContext, useUcfrListsContext, useUpdateCurrentModuleContext, useUpdateSelectedTabToDisplayContext } from "../../contexts/UcfrsContext";
import { customTheme } from "@myStyles/GlobalStyles";
import SearchSubstring from "@myComponents/filters/SearchSubstring";


export default function Index() {
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


   const { isOpen: isAddTagOpen, onOpen: onAddTagOpen, onClose: onAddTagClose,} = useDisclosure()

   const {isOpen: isShowTagsOpen, onOpen: onShowTagsOpen, onClose: onShowTagsClose,} = useDisclosure()

   const { isOpen: isAddModuleOpen, onOpen: onAddModuleOpen, onClose: onAddModuleClose, } = useDisclosure()

   const { isOpen: isShowModulesOpen, onOpen: onShowModulesOpen, onClose: onShowModulesClose, } = useDisclosure()


   return (
      <Flex className={'mainContainer'} 
      position={'relative'} 
      direction={'column'} 
      alignItems={'center'}
      width={'100%'} minHeight={'100vh'} 
      backgroundColor={customTheme.colors[10]} 
      color={customTheme.colors[10]}
      >
         <SearchSubstring/>
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
                  <Grid className='ManageModulesContainer' 
                  width={'100%'}
                  backgroundColor={customTheme.colors[30]}
                  gridTemplateColumns={'20fr 1fr 20fr'}
                  padding={'.2rem'}
                  height={'3rem'}
                  >
                     <button className="showModulesListButton button"
                     onClick={() => onShowModulesOpen()}
                     >
                        Show all Modules
                     </button>
                     <div></div>
                     <Flex className={'button'} 
                     onClick={() => onAddModuleOpen()}
                     alignItems={'center'}
                     justifyContent={'center'}
                     >
                        <AddIcon height='100%' marginRight={'.5rem'}/>
                        {'Module'}
                     </Flex>

                     <FullPopup isOpen={isShowModulesOpen} onClose={onShowModulesClose}>
                        <ListModules />
                     </FullPopup>

                     <FullPopup isOpen={isAddModuleOpen} onClose={onAddModuleClose}>
                        <CreateModule/>
                     </FullPopup>
                  </Grid>


                  <Grid className={'tagManagementContainer'} 
                     templateColumns={'20fr 1fr 20fr'}
                     width={'100%'}
                     backgroundColor={customTheme.colors[30]}
                     padding={'.2rem'}
                     height={'3rem'}
                  >
                     <button className="showTagsListButton button" onClick={() => onShowTagsOpen()}>
                        Show all Tags
                     </button>

                     <div></div>

                     <Flex className='CreateTagContainer button'
                     alignItems={'center'}
                     justifyContent={'center'}
                     onClick={() => onAddTagOpen()}
                     >
                        <AddIcon height='100%' marginRight={'.5rem'}/>
                        Tag

                        <FullPopup isOpen={isAddTagOpen} onClose={onAddTagClose}>
                           <CreateTag/>
                        </FullPopup>
                     </Flex>

                     <FullPopup isOpen={isShowTagsOpen} onClose={onShowTagsClose}>
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
                     <CreateUseCase/>
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
               <Flex width={'.5rem'} height='.5rem'/>
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

            <CopyToClipboard/>
         </Flex>


         <Flex className="blank space at the end"
         height='5rem'/>


      </Flex>
   )
}