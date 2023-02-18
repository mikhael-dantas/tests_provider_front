import { EditIcon } from "@chakra-ui/icons"
import { useDisclosure } from "@chakra-ui/react"
import TagClickable from "@myComponents/tags/TagClickable"
import { IFunctionalRequirement, INestedUseCase, IUseCase } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"
import { useEffect, useState } from "react"
import ItemModal from "../ItemModal/ItemModal"

import { ManageComponentUcfrActions } from "../../../lib/componentActions"
import styles from "./styles.module.css"
import ModalClickable from "@myComponents/ucfrLists/ItemModal/ModalClickable"
export default function Item(
{
   item: itemReceived, 
   itemType: itemTypeReceived,
}: {
   item: IUseCase | INestedUseCase | IFunctionalRequirement
   itemType: "useCase" | "nestedUseCase" | "functionalRequirement"
}) {
   const Manager = new ManageComponentUcfrActions()


   // in case it's a use case
   const [nestedUseCases, setNestedUseCases] = useState<INestedUseCase[]>([])

   const completedToggleHandler = () => {
      switch (itemTypeReceived) {
         case "useCase":
            Manager.updateUseCaseByIdHandler({
               id: itemReceived.id,
               name: itemReceived.name,
               completed: !itemReceived.completed,
            })
            break
         case "nestedUseCase":
            Manager.updateNestedUseCaseByIdHandler({
               id: itemReceived.id,
               name: itemReceived.name,
               completed: !itemReceived.completed,
            })
            break
         case "functionalRequirement":
            Manager.updateFunctionalRequirementByIdHandler({
               id: itemReceived.id,
               name: itemReceived.name,
               completed: !itemReceived.completed,
            })
            break
      }
   }


   useEffect(() => {
      // search nested use cases
      if (itemTypeReceived !== "useCase") return
      Manager.searchSubstringAndFilter('', {
         useCaseIds: [itemReceived.id],
         searchIn: {
            useCases: false,
            functionalRequirements: false,
            nestedUseCases: true 
         },
      })
      .then((result) => {
         setNestedUseCases(result.nestedUseCases)
      })
   }, [itemReceived])


   const { isOpen, onOpen, onClose } = useDisclosure()

   return (

      <div className={`
      listItemContainer
      flex flex-col
      `}
      >
         <div className={`itemMainContentContainer
            grid
            items-center mt-[.5rem] mx-auto p-[.4rem] rounded-[.3rem]
            shadow-md
            py-10
            `
            }
            style={{
               gridTemplateColumns: '7fr 1fr',
               backgroundColor: itemReceived.completed ? customTheme.colors.green[80] : customTheme.colors[60]
            }}
         >

            <div className={`itemInformationContainer
            flex flex-col
            `}
            >
               <div className={'itemId flex text-sm'}
               >
                  {itemReceived.id}
               </div>
               <div className={`itemInfo 
               grid
               items-center
               mt-[.5rem]
               `} 
               style={{gridTemplateColumns:'1fr 10fr 1fr'}} 
               >
                  <div id="checkbox-container" className={styles.container}>
                     <input id="checkbox-input" type="checkbox"
                        checked={itemReceived.completed} onChange={completedToggleHandler} 
                        className={
                           `${styles.checkbox} ${itemReceived.completed ? styles.checkboxAnimation : ""}`
                        }
                        />
                  </div>

                  <div className={`
                  max-w-[90%] text-[1.2rem]
                  `}>{itemReceived.name}</div>
               </div>
            </div>

            <div className={`actions 
            flex flex-col items-center justify-center
            `}
            >
               <EditIcon className="editUseCase"
               width={'60%'}
               height={'60%'}
               cursor={'pointer'}
               onClick={onOpen}/>

               <ItemModal isOpen={isOpen} onClose={onClose} item={itemReceived} itemType={itemTypeReceived}/>
            </div>
         </div>


         <div className={`ItemTags
         flex flex-wrap
         mx-auto
         w-[95%]
         justify-items-center
         text-[.8rem]
         rounded-[.3rem]
         p-2
         bg-[${customTheme.colors[60]}]
         `}
         style={{
            backgroundColor: customTheme.colors[60]
         }}
         >
            {itemReceived.tagIds.map(tagId => (
               <TagClickable
               key={tagId}
               tagId={tagId}
               />
            ))}
         </div>

         {itemTypeReceived === "useCase" && nestedUseCases.length > 0 && (
         < div className={`useCaseNestedUseCases 
         p-4 bg-green-500 rounded-md shadow-md p-2 flex items-center justify-center w-[97%] mx-auto
         flex-col gap-1
         `}>
            {nestedUseCases.map(scopedNestedUseCase => (
               <ModalClickable key={scopedNestedUseCase.id} item={scopedNestedUseCase} itemType="nestedUseCase"
               className="w-[100%]"
               >
                  <div className="p-4 border border-gray-400 w-100 bg-[rgba(0,0,0,0.5)] rounded-md shadow-md p-2 flex items-center justify-center flex-col">
                     <p className="
                     text-sm
                     "
                     >{scopedNestedUseCase.id}</p>
                     <p className="
                     text-lg
                     ">{scopedNestedUseCase.name}</p>
                  </div>
               </ModalClickable>
            ))
            }
         </div>
         )}
      </div>
   )
}