import { Button } from '@chakra-ui/react';
import FullPopup from '@myComponents/FullPopup';
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '@myContexts/AlertStackContext';
import { useUcfrListsContext, useUpdateUcfrListsContext } from '@myContexts/UcfrsContext';
import { TFilters, UcfrListsContextInterfaces } from '@myFeaturesInterfaces/UcfrListsContextInterfaces';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import Select from 'react-select'

function FilterFieldsModal({
    isOpen,
    onClose,
    filters,
    setFilters,
} : {
    isOpen: boolean,
    onClose: () => void,
    filters: TFilters
    setFilters: Dispatch<SetStateAction<TFilters>>
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

    const [completed, setCompleted] = React.useState(filters.completed === null ? 'all' : filters.completed.toString());
    const [moduleIds, setModuleIds] = React.useState(filters.moduleIds);
    const [tagIds, setTagIds] = React.useState(filters.tagIds);
    const [searchIn, setSearchIn] = React.useState(filters.searchIn);
    const [useCaseIds, setUseCaseIds] = React.useState(filters.useCaseIds);
    const [functionalRequirementIds, setFunctionalRequirementIds] = React.useState(filters.functionalRequirementIds)
    const [nestedUseCaseIds, setNestedUseCaseIds] = React.useState(filters.nestedUseCaseIds)


    const HandleApplyFilters = () => {
        setFilters({
            ...filters,
            completed: completed === 'all' ? null : completed === 'true' ? true : false,
            moduleIds: moduleIds,
            tagIds: tagIds,
            searchIn: searchIn,
            useCaseIds: useCaseIds,
            functionalRequirementIds: functionalRequirementIds,
            nestedUseCaseIds: nestedUseCaseIds
        })
        onClose()
    }

    const HandleClearFilters = () => {
        setFilters({
            ...filters,
            completed: null,
            moduleIds: [],
            tagIds: [],
            searchIn: {
                functionalRequirements: true,
                useCases: true,
                nestedUseCases: true
            },
            useCaseIds: [],
            functionalRequirementIds: [],
            nestedUseCaseIds: []
        })
        onClose()
    }

    useEffect(() => {
    }, [filters])

    return (
        <FullPopup isOpen={isOpen} onClose={onClose}>
            <div className='p-3 bg-gray-100
            rounded-lg
            max-w-95%
            mx-auto
            '>
                <h1>Filter Fields</h1>
                <h2>Completed</h2>
                <div className='radioButtons'>
                    <label>
                        <input
                            type='radio'
                            name='completed'
                            value='all'
                            checked={completed === 'all'}
                            onChange={() => setCompleted('all')}
                        />
                        <span>All</span>
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='completed'
                            value='true'
                            checked={completed === 'true'}
                            onChange={() => setCompleted('true')}
                        />
                        <span>True</span>
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='completed'
                            value='false'
                            checked={completed === 'false'}
                            onChange={() => setCompleted('false')}
                        />
                        <span>False</span>
                    </label>
                </div>

                <h2>Modules</h2>
                <Select options={ucfrListsFromContext.modules.map(moduleScoped => {
                    return { value: moduleScoped.id, label: moduleScoped.name }
                })} isMulti={true} onChange={(selectedOptions) => {
                    setModuleIds(selectedOptions.map(option => option.value))
                }} value={moduleIds.map(moduleId => {
                    return { value: moduleId, label: ucfrListsFromContext.modules.find(module => module.id === moduleId)?.name }
                })} />

                <h2>Tags</h2>
                <Select options={ucfrListsFromContext.tags.map(tagScoped => {
                    return { value: tagScoped.id, label: tagScoped.name }
                })} isMulti={true} onChange={(selectedOptions) => {
                    setTagIds(selectedOptions.map(option => option.value))
                }} value={tagIds.map(tagId => {
                    return { value: tagId, label: ucfrListsFromContext.tags.find(tag => tag.id === tagId)?.name }
                })} />

                <h2>Search In</h2>
                <div className='checkBoxes flex flex-col'>
                    <label>
                        <input
                            type='checkbox'
                            name='searchIn'
                            value='name'
                            checked={searchIn.useCases}
                            onChange={() => setSearchIn({ ...searchIn, useCases: !searchIn.useCases })}
                        />
                        <span>Use Cases</span>
                    </label>
                    <label>
                        <input
                            type='checkbox'
                            name='searchIn'
                            value='name'
                            checked={searchIn.functionalRequirements}
                            onChange={() => setSearchIn({ ...searchIn, functionalRequirements: !searchIn.functionalRequirements })}
                        />
                        <span>Functional Requirements</span>
                    </label>
                    <label>
                        <input
                            type='checkbox'
                            name='searchIn'
                            value='name'
                            checked={searchIn.nestedUseCases}
                            onChange={() => setSearchIn({ ...searchIn, nestedUseCases: !searchIn.nestedUseCases })}
                        />
                        <span>Nested Use Cases</span>
                    </label>
                </div>

                <h2>Use Cases related</h2>
                <Select options={ucfrListsFromContext.modules.reduce((acc, moduleScoped) => {
                    return [...acc, ...moduleScoped.useCases.map(useCaseScoped => {
                        return { value: useCaseScoped.id, label: useCaseScoped.name + ' - ' + useCaseScoped.id }
                    })]
                }, [])} isMulti={true} onChange={(selectedOptions) => {
                    setUseCaseIds(selectedOptions.map(option => option.value))
                }} value={useCaseIds.map(useCaseId => {
                    return { value: useCaseId, label: ucfrListsFromContext.modules.reduce((acc, moduleScoped) => {
                        return [...acc, ...moduleScoped.useCases.map(useCaseScoped => {
                            return { value: useCaseScoped.id, label: useCaseScoped.name + ' - ' + useCaseScoped.id }
                        })]
                    }, []).find(useCase => useCase.value === useCaseId)?.label }
                })} />

                <h2>Functional Requirements related</h2>
                <Select options={ucfrListsFromContext.modules.reduce((acc, moduleScoped) => {
                    return [...acc, ...moduleScoped.functionalRequirements.map(functionalRequirementScoped => {
                        return { value: functionalRequirementScoped.id, label: functionalRequirementScoped.name + ' - ' + functionalRequirementScoped.id }
                    })]
                }, [])} isMulti={true} onChange={(selectedOptions) => {
                    setFunctionalRequirementIds(selectedOptions.map(option => option.value))
                }} value={functionalRequirementIds.map(functionalRequirementId => {
                    return { value: functionalRequirementId, label: ucfrListsFromContext.modules.reduce((acc, moduleScoped) => {
                        return [...acc, ...moduleScoped.functionalRequirements.map(functionalRequirementScoped => {
                            return { value: functionalRequirementScoped.id, label: functionalRequirementScoped.name + ' - ' + functionalRequirementScoped.id }
                        })]
                    }, []).find(functionalRequirement => functionalRequirement.value === functionalRequirementId)?.label }
                })} />

                <h2>Nested Use Cases related</h2>
                <Select options={ucfrListsFromContext.modules.reduce((acc, moduleScoped) => {
                    acc.push(...moduleScoped.nestedUseCases.map(nestedUseCaseScoped => {
                        return { value: nestedUseCaseScoped.id, label: nestedUseCaseScoped.name + ' - ' + nestedUseCaseScoped.id }
                    }))
                    return acc
                }, [])} isMulti={true} onChange={(selectedOptions) => {
                    setNestedUseCaseIds(selectedOptions.map(option => option.value))
                }} value={nestedUseCaseIds.map(nestedUseCaseId => {
                    return { value: nestedUseCaseId, label: ucfrListsFromContext.modules.reduce((acc, moduleScoped) => {
                        acc.push(...moduleScoped.nestedUseCases.map(nestedUseCaseScoped => {
                            return { value: nestedUseCaseScoped.id, label: nestedUseCaseScoped.name + ' - ' + nestedUseCaseScoped.id }
                        }))
                        return acc
                    }, []).find(nestedUseCase => nestedUseCase.value === nestedUseCaseId)?.label }
                })} />

                <div className='flex justify-around mt-3'>
                    <Button colorScheme='blue' onClick={HandleClearFilters}>Clear</Button>
                    <Button colorScheme='green' onClick={HandleApplyFilters}>Apply</Button>
                </div>
            </div>
        </FullPopup>
    )
}

export default FilterFieldsModal;