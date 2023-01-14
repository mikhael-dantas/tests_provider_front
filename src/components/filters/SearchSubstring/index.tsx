import React, { useEffect } from 'react';

// import { Container } from './styles';
import { useDisclosure } from '@chakra-ui/react';
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '@myContexts/AlertStackContext';
import { IFunctionalRequirement, INestedUseCase, IUseCase, useUcfrListsContext, useUpdateUcfrListsContext } from '@myContexts/UcfrsContext';
import { TFilters, UcfrListsContextInterfaces } from '@myFeaturesInterfaces/UcfrListsContextInterfaces';
import FullPopup from '../../FullPopup';
import FRequirementClickable from '@myComponents/ucfrLists/fRequirements/FRequirementClickable';
import UseCaseClickable from '@myComponents/ucfrLists/useCases/UseCaseClickable';
import NestedUseCaseClickable from '@myComponents/ucfrLists/nestedUseCases/NestedUseCaseClicklable';
import FilterFieldsClickable from '../FilterFields/FilterFieldsClickable';

function SearchSubstring ({
    className,
    empty,
    children
} : {
    className?: string
    empty?: boolean
    children?: React.ReactNode
}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()



    const [searchSubstringInput, setSearchSubstringInput] = React.useState<string>("")

    const [FRsFilteredBySubstring, setFRsFilteredBySubstring] = React.useState<IFunctionalRequirement[]>([])
    const [UCsFilteredBySubstring, setUCsFilteredBySubstring] = React.useState<IUseCase[]>([])
    const [NUCsFilteredBySubstring, setNUCsFilteredBySubstring] = React.useState<INestedUseCase[]>([])

    const [filters, setFilters] = React.useState<TFilters>({
        completed: null,
        functionalRequirementIds: [],
        useCaseIds: [],
        moduleIds: [],
        searchIn: {
            functionalRequirements: true,
            useCases: true,
            nestedUseCases: true,
        },
        tagIds: [],
        nestedUseCaseIds: [],
    })

    const searchSubstringHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSubstringInput(e.target.value)
    }

    function performFilterAction() {
        ucfrListsInterfaces.searchSubstringAndFilter(searchSubstringInput, filters)
        .then((result) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: "success", text: "searched" }),
                }
            ])

            
            setFRsFilteredBySubstring(result.functionalRequirements)
            setUCsFilteredBySubstring(result.useCases)
            setNUCsFilteredBySubstring(result.nestedUseCases)
        })
        .catch((err) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: "error", text: 'error - log for details' }),
                }
            ])
        })
    }

    useEffect(() => {
        if (searchSubstringInput === "" && 
            filters.completed === null &&
            filters.functionalRequirementIds.length === 0 &&
            filters.useCaseIds.length === 0 &&
            filters.moduleIds.length === 0 &&
            filters.searchIn.functionalRequirements &&
            filters.searchIn.useCases &&
            filters.searchIn.nestedUseCases &&
            filters.tagIds.length === 0
        ) {
            setFRsFilteredBySubstring([])
            setUCsFilteredBySubstring([])
            setNUCsFilteredBySubstring([])
            return
        }

        const timeout = setTimeout(() => {
            performFilterAction()
        }, 500)

        return () => {
            clearTimeout(timeout)
        }
    }, [searchSubstringInput, filters])

    useEffect(() => {
        // rerender component when the context changes
        setSearchSubstringInput("")
    }, [ucfrListsFromContext])
    const {isOpen, onOpen, onClose} = useDisclosure()

    return ( 
        <>
        <div className={
            className || ''
        } onClick={onOpen}>
            { empty ? null : (
            <img src='https://img.icons8.com/ios/50/000000/search--v1.png' alt='search icon' className='mx-auto p-1 h-[90%]'/>
            )}
            {children}
        </div>
        <FullPopup isOpen={isOpen} onClose={onClose}>
            <div className='search-substring-modal-container 
            h-[80vh] w-[90vw] mx-auto bg-[rgba(255,255,255,0.8)] rounded-md p-3
            shadow-[0px 0px 10px 0px rgba(0,0,0,0.75), inset 0px 0px 10px 0px rgba(0,0,0,0.75)]
            '>

                <div className='search-substring-modal w-[100%] h-[3rem] flex flex-row'>
                    <input type='text' className='w-full h-full rounded-md p-2 w-90' placeholder='Search for a substring'
                    onChange={searchSubstringHandler} value={searchSubstringInput}
                    />
                    <FilterFieldsClickable filters={filters} setFilters={setFilters}>
                        <div className='filters w-[3rem] h-[3rem] bg-blue-200 rounded-md p-2 ml-2'>
                            <img src='https://img.icons8.com/ios/50/000000/filter--v1.png' alt='filter icon'/>
                        </div>
                    </FilterFieldsClickable>
                </div>


                <div className='search-substring-results overflow-y-scroll overflow-hidden h-[60vh] mt-3'> 
                    <div className='search-substring-results__functional-requirements'>
                        <h3 className='text-xl font-bold text-center'>Functional Requirements</h3>
                        <ul className='search-substring-results__functional-requirements__list'>
                            {FRsFilteredBySubstring.map((FR) => {
                                return (
                                    <li key={FR.id} className='search-substring-results__functional-requirements__list__item bg-blue-200 mt-3 p-2'>
                                        <FRequirementClickable fRequirement={FR} key={FR.id}>
                                            <div className='search-substring-results__functional-requirements__list__item__id text-[.8rem] font-semibold'>
                                                {FR.id}
                                            </div>
                                            <div className='search-substring-results__functional-requirements__list__item__title text-[.8rem] font-semibold'>
                                                {FR.name}
                                            </div>
                                        </FRequirementClickable>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className='text-center p-2'>----------------------------</div>

                    <div className='search-substring-results__use-cases'>
                        <h3 className='text-xl font-bold text-center'>Use Cases</h3>
                        <ul className='search-substring-results__use-cases__list'>
                            {UCsFilteredBySubstring.map((UC) => {
                                return (
                                    <li key={UC.id} className='search-substring-results__use-cases__list__item bg-blue-200 mt-3'>
                                        <UseCaseClickable key={UC.id} useCase={UC}>
                                            <div className='container w-full h-full flex flex-col'>
                                                <div className='search-substring-results__use-cases__list__item__id'>
                                                    {UC.id}
                                                </div>
                                                <div className='search-substring-results__use-cases__list__item__name'>
                                                    {UC.name}
                                                </div>
                                            </div>
                                        </UseCaseClickable>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className='text-center p-2'>----------------------------</div>

                    <div className='search-substring-results__nested-use-cases'>
                        <h3 className='text-xl font-bold text-center'>Nested Use Cases</h3>
                        <ul className='search-substring-results__nested-use-cases__list'>
                            {NUCsFilteredBySubstring.map((NUC) => {
                                return (
                                    <li key={NUC.id} className='search-substring-results__nested-use-cases__list__item bg-blue-200 mt-3'>
                                        <NestedUseCaseClickable NestedUseCase={NUC}>
                                            <div className='search-substring-results__nested-use-cases__list__item__id'>
                                                {NUC.id}
                                            </div>
                                            <div className='search-substring-results__nested-use-cases__list__item__description'>
                                                {NUC.name}
                                            </div>
                                        </NestedUseCaseClickable>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </FullPopup>
        </>
    )
}

export default SearchSubstring;