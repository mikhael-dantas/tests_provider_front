import { useDisclosure } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction } from 'react';
import FilterFieldsModal from './FilterFieldsModal';
import { TFilters } from '@myFeaturesInterfaces/UcfrListsContextInterfaces';

// import { Container } from './styles';

function FilterFieldsClickable({
    filters, setFilters, children
} : {
    filters: TFilters,
    children: React.ReactElement
    setFilters: Dispatch<SetStateAction<TFilters>> 
}) {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <div onClick={onOpen} className='cursor-pointer'>
            {children}
            <FilterFieldsModal isOpen={isOpen} onClose={onClose} filters={filters} setFilters={setFilters} />
        </div>
    );
}

export default FilterFieldsClickable