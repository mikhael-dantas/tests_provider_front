import { useDisclosure } from "@chakra-ui/react"
import CreateItemModal from "./Item/createItemModal"
import { useState } from "react"

export default function CreateItemsBar() {


   const [itemType, setItemType] = useState<"useCase" | "nestedUseCase" | "functionalRequirement">("useCase")

   const handleCreateOpen = (item: string) => {
      switch (item) {
         case "useCase":
            setItemType("useCase")
            onOpenCreateItem()
            break;
         case "nestedUseCase":
            setItemType("nestedUseCase")
            onOpenCreateItem()
            break;
         case "functionalRequirement":
            setItemType("functionalRequirement")
            onOpenCreateItem()
            break;
         default:
            break;
      }
   }

   const {isOpen: isOpenCreateItem, onOpen: onOpenCreateItem, onClose: onCloseCreateItem} = useDisclosure()


   return (
      <div className={`ucfrsItemsListCreationContainer
         grid 
         grid-rows-3
         sm:grid-cols-3
         gap-1
         sm:gap-0
         w-[90%]
         mx-auto
         mt-1
      `} 
      >
         {[{id:"useCase", name: "UseCase"}, {id:"nestedUseCase", name: "Nested UseCase"}, {id:"functionalRequirement", name: "Functional Requirement"}].map((item, i) => (
         <div className="CreateItemButton
         flex items-center justify-center
         col-span-1
         w-100
         p-2
         text-center
         font-semibold
         uppercase
         cursor-pointer
         bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full
         "
         onClick={() => { handleCreateOpen(item.id) }}
         key={item.id + i}
         >
            + {item.name}
         </div>))}
         <CreateItemModal isOpen={isOpenCreateItem} onClose={onCloseCreateItem} itemType={itemType} />
      </div>
   )
}