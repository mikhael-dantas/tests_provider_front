import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Flex,
  Grid,
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'
import React from 'react';

interface IUcfrItem {
  id: string,
  done: boolean,
  name: string,
  dependencies: string[]
}

interface IUcfrs {
  ucfrs: {
      category: string,
      type: string,
      list: IUcfrItem[]
  }[], 
  newUcfr: string,
  newItem: string,
  newDependency: string
}

export default function Index() {
  // make component with a list of drag and drop writable components

  const [ucfrs, setUcfrs] = React.useState<IUcfrs>({
    ucfrs: [
          {
          category: 'Manager',
          type: 'UC',
          list: []
        },
    ],
    newUcfr: '',
    newItem: '',
    newDependency: ''

  })

  const [currentUcfrs, setCurrentUcfrs]  = React.useState({
    current: {
        category: 'Manager',
        type: 'UC',
    },
  })

  const [jsonInsert, setJsonInsert ] = React.useState('')

  const [dragItem, setDragItem] = React.useState(null);
  
  const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


  // drag logic
  const onDragStart = (e, item) => {
    setDragItem(item);
  }
  const onDragEnd = (e) => {
    setDragItem(null);
  }
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }
  const onDrop = (e, id) => {
    // make the logic for the current category
    // the drag item should exit the list, then on drop it should be added to the list moving the forward elements to the right
    if (dragItem) {
        const fUcfr = ucfrs.ucfrs.find(current => current.category === currentUcfrs.current.category && current.type === currentUcfrs.current.type)
        if (!fUcfr) { throw new Error("Could not find the current category")}
        const newItems = [...fUcfr.list];
        const dragItemIndex = newItems.findIndex(current => current.id === dragItem['id']);
        const dropItemIndex = newItems.findIndex(current => current.id === id);
        newItems.splice(dragItemIndex, 1);
        newItems.splice(dropItemIndex, 0, dragItem);
        setUcfrs({
          ...ucfrs,
          ucfrs: [...ucfrs.ucfrs.map(current => current.category === currentUcfrs.current.category && current.type === currentUcfrs.current.type ? {
              ...current,
              list: newItems
          } : current)]
        })
    }
  }





  // ucfrs management
  const currentUcfrsHandlerSelect = (e) => {
    const [type, category] = e.target.value.split('-')

    setCurrentUcfrs({
        current: {
          category,
          type,
        },
    })
  }
  const addUcfr = () => {

    const [type, category] = ucfrs.newUcfr.split('-')

    if(type !== 'UC' && type !== 'FR') {
        alert('Please select a valid type')
        return;
    }
    // check if the category with the same type already exists in model
    const exists = ucfrs.ucfrs.find(compare => compare.category === category && compare.type === type);
    if (exists) {
        alert('Business Model Model already exists');
        return;
    }

    setUcfrs({
        ucfrs: [...ucfrs.ucfrs, {
          category,
          type,
          list: []
        }],
        newUcfr: '',
        newItem: '',
        newDependency: ''
    })
  }
  const delUcfr = () => {
    const [type, category] = ucfrs.newUcfr.split('-')
    // check if current tab is attempting to be removed
    if(currentUcfrs.current.category === category && currentUcfrs.current.type === type) {
        alert('Cannot remove current tab')
        return;
    }
    // check if items is empty before removing
    const fUcfrs = ucfrs.ucfrs.find(compare => compare.category === category && compare.type === type)
    if(!fUcfrs) { throw new Error('Could not find the current category')}
    const items = fUcfrs.list;
    if (items.length !== 0) {
        alert('Cannot remove tab with items')
        return;
    }
    setUcfrs({
        ucfrs: ucfrs.ucfrs.filter((_, i) => _.category !== category || _.type !== type),
        newUcfr: '',
        newItem: '',
        newDependency: ''
    })
  }
  const handleChangeUCFRInput = (e) => {
    setUcfrs({
        ucfrs: ucfrs.ucfrs,
        newUcfr: e.target.value,
        newItem: '',
        newDependency: ''
    });
  }




  // ucfr item management 
  const addItem = () => {
    // add ucfr item to current ucfr category
    setUcfrs({
        ucfrs: ucfrs.ucfrs.map(ucfr => {
          if (ucfr.category === currentUcfrs.current.category && ucfr.type === currentUcfrs.current.type) {
              return {
                ...ucfr,
                list: [...ucfr.list, {
                    id: `${generateUUID()}`,
                    done: false,
                    name: ucfrs.newItem,
                    dependencies: []
                }]
              }
          }
          return ucfr;
        }, []),
        newUcfr: '',
        newItem: '',
        newDependency: ''
    });
  }
  const editItemViaAlertInput = (id: string) => {
  // edit item name via alert input
  const fUcfr = ucfrs.ucfrs.find(ucfr => ucfr.category === currentUcfrs.current.category && ucfr.type === currentUcfrs.current.type)
  if (!fUcfr) { throw new Error("Could not find the current category")}
  const item = fUcfr.list.find(item => item.id === id);
  if (!item) {
    alert('Item not found');
    return;
  }
  const newName = prompt('Enter new name', item.name);
  if (newName) {
    setUcfrs({
        ucfrs: ucfrs.ucfrs.map(ucfr => {
          if (ucfr.category === currentUcfrs.current.category && ucfr.type === currentUcfrs.current.type) {
              return {
                ...ucfr,
                list: ucfr.list.map(item => item.id === id ? {
                    ...item,
                    name: newName
                } : item)
              }
          }
          return ucfr;
        }
        , []),
        newUcfr: '',
        newItem: '',
        newDependency: ''
    });
  }
}
  const removeItem = (id: string) => {
    // remove item from current ucfr category
    // cannot remove item if it is dependency of other item

    let isDependency = false
    let dependencyName = ''
    for (const ucfr of ucfrs.ucfrs) {
        for (const item of ucfr.list) {
          if (item.dependencies.includes(id)) {
              isDependency = true;
              dependencyName = item.name;
          }
        }
    }

    if (isDependency) {
        alert('Cannot remove item because it is dependency of ' + dependencyName);
        return;
    }
    setUcfrs({
        ucfrs: ucfrs.ucfrs.map(ucfr => {
          if (ucfr.category === currentUcfrs.current.category && ucfr.type === currentUcfrs.current.type) {
              return {
                ...ucfr,
                list: ucfr.list.filter(item => item.id !== id)
              }
          }
          return ucfr;
        }
        , []),
        newUcfr: '',
        newItem: '',
        newDependency: ''
    });
  }
  const toggleItem = (id: string) => {
    // toggle item from current ucfr category
    setUcfrs({
        ucfrs: ucfrs.ucfrs.map(ucfr => {
          if (ucfr.category === currentUcfrs.current.category && ucfr.type === currentUcfrs.current.type) {
              return {
                ...ucfr,
                list: ucfr.list.map(item => {
                    if (item.id === id) {
                      return {
                          ...item,
                          done: !item.done
                      }
                    }
                    return item;
                })
              }
          }
          return ucfr;
        }
        , []),
        newUcfr: '',
        newItem: '',
        newDependency: ''
    });
  }
  const handleChange = (e) => {
    setUcfrs({
        ucfrs: ucfrs.ucfrs,
        newUcfr: ucfrs.newUcfr,
        newItem: e.target.value,
        newDependency: ucfrs.newDependency
    });
  }


  // ucfr item dependencies management
  const findDependencyName = (itemId: string) => {
    for (const ucfr of ucfrs.ucfrs) {
        for (const item of ucfr.list) {
          const found = item.id === itemId;
          if (found) {
              return ucfr.type + '-' + ucfr.category + '| ' + item.name
          }
        }
    }
    return 'invalid';
  }
  const addDependency = (itemId: string, dependencyItemId: string) => {
    if(dependencyItemId === "null") {
        return
    }
    // check if item is already in the dependency list
    let isDependency = false;
    for (const ucfr of ucfrs.ucfrs) {
        for (const item of ucfr.list) {
          if (item.id === itemId) {
              if (item.dependencies.includes(dependencyItemId)) {
                isDependency = true;
              }
          }
        }
    }
    if (isDependency) {
        alert('Item is already a dependency');
        return;
    }
    // add dependency to current ucfr itemId dependency list
    setUcfrs({
        ucfrs: ucfrs.ucfrs.map(ucfr => {
          if (ucfr.category === currentUcfrs.current.category && ucfr.type === currentUcfrs.current.type) {
              return {
                ...ucfr,
                list: ucfr.list.map(item => { if (item.id === itemId) {
                      return {
                          ...item,
                          dependencies: [...item.dependencies, dependencyItemId]
                      }
                    }
                    return item;
                })
              }
          }
          return ucfr;
        }
        , []),
        newUcfr: '',
        newItem: '',
        newDependency: ''
    });
  }
  const removeDependency = (itemId: string, dependencyItemId: string) => {
    if(dependencyItemId === "null") {
        return
    }
    // check if item is in fact in the dependency list
    let isDependency = false;
    for (const ucfr of ucfrs.ucfrs) {
        for (const item of ucfr.list) {
          if (item.id === itemId) {
              if (item.dependencies.includes(dependencyItemId)) {
                isDependency = true;
              }
          }
        }
    }
    if (!isDependency) {
        alert('Item is not a dependency');
        return;
    }
    // remove dependency from current ucfr itemId dependency list
    setUcfrs({
        ucfrs: ucfrs.ucfrs.map(ucfr => {
          if (ucfr.category === currentUcfrs.current.category && ucfr.type === currentUcfrs.current.type) {
              return {
                ...ucfr,
                list: ucfr.list.map(item => { if (item.id === itemId) {
                      return {
                          ...item,
                          dependencies: item.dependencies.filter(dependency => dependency !== dependencyItemId)
                      }
                    }
                    return item;
                })
              }
          }
          return ucfr;
        }
        , []),
        newUcfr: '',
        newItem: '',
        newDependency: ''
    });
  }



  // json management
  const saveUcfrsInLocalStorage = () => {
    localStorage.setItem('ucfrs', JSON.stringify(ucfrs));
    alert('saved')
  }
  const loadUcfrsFromLocalStorage = () => {
      const ucfrsFromLocalStorage = localStorage.getItem('ucfrs');
      if (ucfrsFromLocalStorage) {
      setUcfrs(JSON.parse(ucfrsFromLocalStorage));
      } else {
      alert('No ucfrs found in local storage');
      }
      alert('loaded')
  }
  const downloadUcfrsAsJson = () => {
      const json = JSON.stringify(ucfrs);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ucfrs.json';
      link.click();
      alert('download should start now')
  }
  const insertucfrsFromJson = () => {
    let jsontomakeinsertion
    try {
      jsontomakeinsertion = JSON.parse(jsonInsert);
      setUcfrs(jsontomakeinsertion)
    } catch (error) {
      alert('Invalid JSON');
      return
    }
    // check if json have all properties that ucfrs have
    Object.keys(jsontomakeinsertion).forEach(key => {
      if (!ucfrs.hasOwnProperty(key)) {
          alert('Invalid json');
          return;
      }
    })
    alert('ucfrs inserted');
  }


return (
  <Flex className="App" backgroundColor={'springgreen'}>
  <Flex className='contentContainer'
  flexDirection={'column'}
  alignItems={'center'}
  >

    <Grid className={'ucfrsManagementContainer'} 
      templateColumns={'1fr 2fr 1fr'}
      width={'100%'}
      backgroundColor={'#a0ffb0'}
      padding={'.5rem'}
      borderRadius={'5px'}
    >
      <Flex className='selectCurrentUcfrsContainer'>
        <select className={'select'} onChange={currentUcfrsHandlerSelect}>
          {ucfrs.ucfrs.map((model, i) => (
            <option className={'option'} key={i} value={`${model.type}-${model.category}`}>{model.type}-{model.category}</option>
          ))}
        </select>
      </Flex>
      <Flex className='CurrentUcfrsNameContainer'>
        <h1>{currentUcfrs.current.category}</h1>
      </Flex>
      <Flex className='ManageUcfrsContainer' direction={'column'}>
        <input className={'input'} type="text" value={ucfrs.newUcfr} onChange={handleChangeUCFRInput} />
        <button className={'button'} onClick={addUcfr}>Add Item</button>
        <button className={'button'} onClick={delUcfr}>Remove</button>
      </Flex>
    </Grid>

    <Flex className="ucfrsListContainer"
        display='flex'
        flexDirection='column'
        alignItems='center'
        width='80%'
        margin='0 auto'
        marginTop='1rem'
    >
        <h3>Drag and Drop UCFRs</h3>

        <div className="item-insertion">
          <input className={'input'} type="text" value={ucfrs.newItem} onChange={handleChange} />
          <button className={'button'} onClick={addItem}>Add Item</button>
        </div>

        <div className="card-body"
        style={{
          width: '90%'
        }}>
          {/* list items from the current category */}
          {(ucfrs.ucfrs.find(model => model.category === currentUcfrs.current.category && model.type === currentUcfrs.current.type) as any)
          .list.map(item => (
          <div key={item.id} className="ucfrItemContainer">
            <div className="drag-item"
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, item.id)}
            >
              <div className='item-ucfr'>
                <input className={'input'} type="checkbox" checked={item.done} onChange={() => toggleItem(item.id)} />
                {item.name}
                <button className={'button'} onClick={() => removeItem(item.id)}>Remove</button>
                <button className={'button'} onClick={() => editItemViaAlertInput(item.id)}>Edit</button>
              </div>
              <div className='dependencies-tab'>
                {/* select to add dependency using other items name as option and adding by their id */}
                {/* list the dependencies of this item, searching in all lists by id */}
                <div className='dependencies-list'>
                    {item.dependencies.map(dependency => (
                    <div key={dependency} className="dependency">
                      {findDependencyName(dependency)}
                    </div>
                    ))}
                </div>
                <div className='adddelete'>
                  <div>
                    ADD
                    <select className={'select'} onChange={(e) => addDependency(item.id, e.target.value)}>
                      {/* list every single item in the list every ucfr */}
                      <option className={'option'} value="null">Select</option>
                      {ucfrs.ucfrs.map((model, i) => (
                        model.list.map(item => (
                          <option className={'option'} key={item.id} value={item.id}>{model.type +'-'+ model.category +'| '+item.name}</option>
                        ))
                      ))}
                    </select>
                  </div>
                  <div>
                    DELETE
                    <select className={'select'} onChange={(e) => removeDependency(item.id, e.target.value)}>
                    {/* list every single dependency of this item as option */}
                      <option className={'option'} value="null">Select</option>
                      {item.dependencies.map(dependency => (
                        <option className={'option'} key={dependency} value={dependency}>{findDependencyName(dependency)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
    </Flex>

    <Flex className='jsonManagementContainer'>
      <button className={'button'} onClick={saveUcfrsInLocalStorage}>Save</button>
      <button className={'button'} onClick={loadUcfrsFromLocalStorage}>Load</button>
      <button className={'button'} onClick={downloadUcfrsAsJson}>Download</button>
      <input className={'input'} type="text" onChange={(e) => {setJsonInsert(e.target.value)}}/>
      <button className={'button'} onClick={insertucfrsFromJson}>Insert</button>
    </Flex>

  </Flex>
  </Flex>
);
}