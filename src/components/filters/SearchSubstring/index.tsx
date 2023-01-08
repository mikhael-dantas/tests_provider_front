import React, { useEffect } from 'react';

// import { Container } from './styles';
import FullPopup from '../../FullPopup';
import { useDisclosure } from '@chakra-ui/react';
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '@myContexts/AlertStackContext';
import { IFunctionalRequirement, INestedUseCase, IUseCase, useUcfrListsContext, useUpdateUcfrListsContext } from '@myContexts/UcfrsContext';
import { UcfrListsContextInterfaces } from '@myFeaturesInterfaces/UcfrListsContextInterfaces';

const SearchSubstring: React.FC = () => {
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


    const searchSubstringHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSubstringInput(e.target.value)
    }

    useEffect(() => {
        if (searchSubstringInput === "") {
            setFRsFilteredBySubstring([])
            setUCsFilteredBySubstring([])
            setNUCsFilteredBySubstring([])
            return
        }

        const timeout = setTimeout(() => {
            performAction()
        }, 500)

        return () => {
            clearTimeout(timeout)
        }
    }, [searchSubstringInput])
    
    
    function performAction() {
        ucfrListsInterfaces.searchSubstring({ substring: searchSubstringInput })
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
            console.log(err)
        })
    }
    
    const {isOpen, onOpen, onClose} = useDisclosure()

    return (
        <>
        <div className='search-toggle-icon
        absolute top-0 right-0 p-2 cursor-pointer
        ' onClick={onOpen}>
            <img src='https://img.icons8.com/ios/50/000000/search--v1.png' alt='search icon'/>
        </div>
        <FullPopup isOpen={isOpen} onClose={onClose}>
            <div className='search-substring-modal w-[95%] h-[3rem]'>
                <input type='text' className='w-full h-full rounded-md p-2' placeholder='Search for a substring'
                onChange={searchSubstringHandler}
                />
            </div>

            <div className='search-substring-results'>
                <div className='search-substring-results__functional-requirements'>
                    <h3 className='text-xl font-bold'>Functional Requirements</h3>
                    <ul className='search-substring-results__functional-requirements__list'>
                        {FRsFilteredBySubstring.map((FR) => {
                            return (
                                <li key={FR.id} className='search-substring-results__functional-requirements__list__item bg-blue-200 mt-3'>
                                    <div className='search-substring-results__functional-requirements__list__item__id'>
                                        {FR.id}
                                    </div>
                                    <div className='search-substring-results__functional-requirements__list__item__description'>
                                        {FR.name}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className='search-substring-results__use-cases'>
                    <h3 className='text-xl font-bold'>Use Cases</h3>
                    <ul className='search-substring-results__use-cases__list'>
                        {UCsFilteredBySubstring.map((UC) => {
                            return (
                                <li key={UC.id} className='search-substring-results__use-cases__list__item bg-blue-200 mt-3'>
                                    <div className='search-substring-results__use-cases__list__item__id'>
                                        {UC.id}
                                    </div>
                                    <div className='search-substring-results__use-cases__list__item__description'>
                                        {UC.name}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className='search-substring-results__nested-use-cases'>
                    <h3 className='text-xl font-bold'>Nested Use Cases</h3>
                    <ul className='search-substring-results__nested-use-cases__list'>
                        {NUCsFilteredBySubstring.map((NUC) => {
                            return (
                                <li key={NUC.id} className='search-substring-results__nested-use-cases__list__item bg-blue-200 mt-3'>
                                    <div className='search-substring-results__nested-use-cases__list__item__id'>
                                        {NUC.id}
                                    </div>
                                    <div className='search-substring-results__nested-use-cases__list__item__description'>
                                        {NUC.name}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </FullPopup>
        </>
    )
}

export default SearchSubstring;