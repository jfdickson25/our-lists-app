import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './List.css';

const List = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [navingBack, setNavingBack] = useState(false);
    const [listName, setListName] = useState('');
    const [categories, setCategories] = useState([]);
    const [crossedOff, setCrossedOff] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [refreshingPage, setRefreshingPage] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);
    const [exploding, setExploding] = useState(false);

    useEffect(() => {
        // Make a get request to https://our-lists-4ff1ad33d970.herokuapp.com/list/:id with the id of the list
        // Then set the list state to the data returned from the request
        fetch(`https://our-lists-4ff1ad33d970.herokuapp.com/list/${id}`)
        .then(res => res.json())
        .then(data => {
            setListName(data.list.name);
            // Add a newItem field to each category
            data.list.categories.forEach(category => {
                category.newItem = '';
                category.movingDown = false;
                category.movingUp = false;
            });

            data.list.categories.forEach(category => {
                category.activeEdit = false;
                category.items.forEach(item => {
                    item.activeEdit = false;
                });
            });
            
            setCategories(data.list.categories);
            setCrossedOff(data.list.crossedOff);
        });
    }, [refreshCount]);

    const navBack = () => {
        setNavingBack(true);
        setTimeout(() => {
            setNavingBack(false);
            navigate('/myLists');
        }, 1000);
    }

    const moveUp = (index) => {
        const newCategories = [...categories];
        const temp = newCategories[index];
        newCategories[index] = newCategories[index - 1];
        newCategories[index - 1] = temp;
        newCategories[index - 1].movingUp = false;
        newCategories[index].movingDown = false;
        setCategories(newCategories);

        fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/moveUp', {
            method: 'POST',
            body: JSON.stringify({code: id, index}),
            headers: {
            'Content-Type': 'application/json'
            }
        });
    }

    const moveDown = (index) => {
        const newCategories = [...categories];
        const temp = newCategories[index];
        newCategories[index] = newCategories[index + 1];
        newCategories[index + 1] = temp;
        newCategories[index + 1].movingDown = false;
        newCategories[index].movingUp = false;
        setCategories(newCategories);

        fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/moveDown', {
            method: 'POST',
            body: JSON.stringify({code: id, index}),
            headers: {
            'Content-Type': 'application/json'
            }
        });
    }

    const deleteCategory = (categoryName) => {
        const newCategories = categories.filter(category => category.name !== categoryName);
        setCategories(newCategories);

        fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/category', {
            method: 'DELETE',
            body: JSON.stringify({code: id, categoryName}),
            headers: {
            'Content-Type': 'application/json'
            }
        });
    }

    const changeQnt = (categoryIndex, itemIndex, quantity) => {
        fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/changeQnt', {
            method: 'POST',
            body: JSON.stringify({
                code: id, 
                quantity,
                categoryIndex,
                itemIndex
            }),
            headers: {
            'Content-Type': 'application/json'
            }
        });

        const newCategories = [...categories];
        newCategories[categoryIndex].items[itemIndex].quantity = quantity;
        setCategories(newCategories);
    }

    return (
        <div id="content">
            <div id="header">
                <img id="back" src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/back.png?v=1703820361532" alt="back" onClick={navBack} style={navingBack ? {animation: 'button-press .75s'} : null} />
                <p>{listName}</p> 
                <img id="refresh" src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/refresh.png?v=1703820199335" alt="refresh" style={refreshingPage ? {
                    // Rotate the image 360 degrees using transform
                    transform: 'rotate(360deg)',
                    transitionDuration: '.5s'
                } : null} onClick={() => { 
                    setRefreshingPage(true);

                    setTimeout(() => {
                        setRefreshingPage(false);
                        setRefreshCount(refreshCount + 1);
                    }, 500);
                }} />
                <div id="code">Code: {id}</div>
                <div id="add-category" onClick={() => { setShowAddCategory(true) }}>+</div>
            </div>
            {
                categories.map((category, categoryIndex) => {
                    return (
                        <div key={categoryIndex} className="category" id={category.name} style={category.movingDown ? {
                            // Use the document to get the sibling category to know how far to move the category down
                            transform: `translateY(${document.getElementById(categories[categoryIndex + 1].name).clientHeight + 50}px)`,
                            transitionDuration: '.5s'
                        } : category.movingUp ? {
                            // Use the document to get the sibling category to know how far to move the category up
                            transform: `translateY(-${document.getElementById(categories[categoryIndex - 1].name).clientHeight + 50}px)`,
                            transitionDuration: '.5s'
                        } : null}>
                            <div className='category-header'>
                                <div className="move-down" onClick={() => { 
                                    if(categoryIndex === categories.length - 1) return;
                                    let temp = [...categories];
                                    temp[categoryIndex].movingDown = true;
                                    temp[categoryIndex + 1].movingUp = true;
                                    setCategories(temp);

                                    setTimeout(() => {
                                        moveDown(categoryIndex, category.name); 
                                    }, 500);
                                }}>▼</div>
                                <div className="move-up" onClick={() => { 
                                    if(categoryIndex === 0) return;
                                    let temp = [...categories];
                                    temp[categoryIndex].movingUp = true;
                                    temp[categoryIndex - 1].movingDown = true;
                                    setCategories(temp);

                                    setTimeout(() => {
                                        moveUp(categoryIndex, category.name); 
                                    }, 500);
                                }}>▲</div>
                                {
                                    // If activeEdit is true, show the input, otherwise show the p tag
                                    category.activeEdit ? (
                                        <input type="text" className="category-update-input" 
                                            onChange={(event) => {
                                                const newCategories = [...categories];
                                                newCategories[categoryIndex].name = event.target.value;
                                                setCategories(newCategories);
                                            }} 
                                            value={category.name} 
                                            onBlur={() => {
                                                // Make a post request to https://our-lists-4ff1ad33d970.herokuapp.com/list/changeCategory with the id of the list, the category name, and the new category name
                                                fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/changeCategoryName', {
                                                    method: 'POST',
                                                    body: JSON.stringify({
                                                        code: id,
                                                        name: category.name,
                                                        index: categoryIndex
                                                    }),
                                                    headers: {
                                                    'Content-Type': 'application/json'
                                                    }
                                                });

                                                const newCategories = [...categories];
                                                newCategories[categoryIndex].activeEdit = false;
                                                setCategories(newCategories);
                                            }} 
                                        />
                                    ) : (
                                        <p className='category-title' onClick={() => {
                                            const newCategories = [...categories];
                                            newCategories[categoryIndex].activeEdit = true;
                                            setCategories(newCategories);

                                            // Focus on the input
                                            setTimeout(() => {
                                                // First find the category element by its index then find the input element by its index
                                                document.getElementsByClassName('category')[categoryIndex].getElementsByClassName('category-update-input')[0].focus();
                                            }, 0);
                                        }}>{category.name}</p>
                                    )
                                }
                                <img className="delete-category" src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/delete.png?v=1703725625808" alt="delete" onClick={() => { deleteCategory(category.name); }} />
                                <div className="add-item">
                                    <input type="text" placeholder="Item Description" className="add-item-input" onChange={(event) => {
                                        const newCategories = [...categories];
                                        newCategories[categoryIndex].newItem = event.target.value;
                                        setCategories(newCategories);
                                    }} value={category.newItem}/>
                                    <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/plus-green.png?v=1703819381081" className="add-item-plus" onClick={() => {
                                        // If the input is empty, don't add the item
                                        if(category.newItem === '') return;

                                        // Make a post request to https://our-lists-4ff1ad33d970.herokuapp.com/list/addItem with the id of the list, the category name, and the item name
                                        fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/addItem', {
                                            method: 'POST',
                                            body: JSON.stringify({code: id, category: category.name, item: category.newItem, qnt: 1}),
                                            headers: {
                                            'Content-Type': 'application/json'
                                            }
                                        });

                                        // Add the item to the category
                                        const newCategories = [...categories];
                                        newCategories[categoryIndex].items.push({name: category.newItem, quantity: 1, category: category.name});
                                        newCategories[categoryIndex].newItem = '';
                                        setCategories(newCategories);
                                    }}/>
                                </div>
                            </div>
                            <div className="items">
                                {
                                    category.items.map((item, itemIndex) => {
                                        return (
                                            <div key={itemIndex} className="item">
                                                {
                                                    // If activeEdit is true, show the input, otherwise show the p tag
                                                    item.activeEdit ? (
                                                        <input type="text" className="item-update-input" onChange={(event) => {
                                                            const newCategories = [...categories];
                                                            newCategories[categoryIndex].items[itemIndex].name = event.target.value;
                                                            setCategories(newCategories);
                                                        }} value={item.name} onBlur={() => {
                                                            // Make a post request to https://our-lists-4ff1ad33d970.herokuapp.com/list/changeItem with the id of the list, the category name, the item name, and the new item name
                                                            fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/changeItemName', {
                                                                method: 'POST',
                                                                body: JSON.stringify({
                                                                    code: id,
                                                                    name: item.name,
                                                                    categoryIndex,
                                                                    itemIndex
                                                                }),
                                                                headers: {
                                                                'Content-Type': 'application/json'
                                                                }
                                                            });

                                                            const newCategories = [...categories];
                                                            newCategories[categoryIndex].items[itemIndex].activeEdit = false;
                                                            setCategories(newCategories);
                                                        }} />
                                                    ) : (
                                                        <p className="item-name" onClick={() => {
                                                            const newCategories = [...categories];
                                                            newCategories[categoryIndex].items[itemIndex].activeEdit = true;
                                                            setCategories(newCategories);

                                                            // Focus on the input
                                                            setTimeout(() => {
                                                                // First find the category element by its index then find the input element by its index
                                                                document.getElementsByClassName('category')[categoryIndex].getElementsByClassName('item')[itemIndex].getElementsByClassName('item-update-input')[0].focus();
                                                            }, 0);
                                                        }}>{item.name}</p>
                                                    )

                                                }
                                                <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/minus-beige.png?v=1703820118196" className="item-qnt-down" 
                                                    onClick={() => {
                                                        // If the quantity is 1, don't decrease the quantity
                                                        if(parseInt(item.quantity) === 1) return;

                                                        changeQnt(categoryIndex, itemIndex, parseInt(item.quantity) - 1);
                                                    }
                                                }
                                                />
                                                <p className='item-qnt'>{item.quantity}</p>
                                                <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/plus-beige.png?v=1703819641865" className="item-qnt-up" 
                                                    onClick={() => {
                                                        changeQnt(categoryIndex, itemIndex, parseInt(item.quantity) + 1);
                                                    }
                                                }
                                                />
                                                <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/delete.png?v=1703726678591" className="item-delete" onClick={() => {
                                                    // Add item to crossed off, and remove from category
                                                    const newCategories = [...categories];
                                                    const newCrossedOff = [...crossedOff];
                                                    newCategories[categoryIndex].items[itemIndex].category = category.name;
                                                    newCrossedOff.push(newCategories[categoryIndex].items[itemIndex]);
                                                    newCategories[categoryIndex].items.splice(itemIndex, 1);
                                                    setCategories(newCategories);
                                                    setCrossedOff(newCrossedOff);

                                                    fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/crossOff', {
                                                        method: 'POST',
                                                        body: JSON.stringify({
                                                            code: id, 
                                                            category: category.name, 
                                                            name: item.name,
                                                            quantity: item.quantity,
                                                            categoryIndex,
                                                            itemIndex
                                                        }),
                                                        headers: {
                                                        'Content-Type': 'application/json'
                                                        }
                                                    });
                                                }} />

                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    );
                })
            }
            <div id="crossed-off-title">Crossed Off</div>
            <div id="bomb-container">
            {
                (exploding) ? (
                    <img id='explosion' src='https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/explosion%20bang.png?v=1727633978134' />
                ) : (
                    <img id="bomb-img" src='https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/bomb-blast.png?v=1727631700707' onClick={() => {
                        // Check if there are any crossed off items
                        if(crossedOff.length === 0) return;

                        setExploding(true);

                        setTimeout(() => {
                            setExploding(false);
                            setCrossedOff([]);
                        }, 800);

                        // Make a post request to https://our-lists-4ff1ad33d970.herokuapp.com/list/clearCrossedOff with the id of the list
                        fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/clearCrossedOff', {
                            method: 'POST',
                            body: JSON.stringify({code: id}),
                            headers: {
                            'Content-Type': 'application/json'
                            }
                        });
                    }}/>
                )
            }
            </div>
            {
                (crossedOff) && crossedOff.map((item, index) => {
                    return (
                        <div key={index} className='crossed-off-item'>
                            <p className='crossed-off-item-desc' onClick={() => {
                                // Add item to category, and remove from crossed off
                                const newCategories = [...categories];
                                const newCrossedOff = [...crossedOff];
                                console.log(item);
                                const categoryIndex = newCategories.findIndex(category => category.name === item.category);
                                console.log(categoryIndex);
                                console.log(newCategories[categoryIndex]);
                                newCategories[categoryIndex].items.push(newCrossedOff[index]);
                                newCrossedOff.splice(index, 1);
                                setCategories(newCategories);
                                setCrossedOff(newCrossedOff);

                                fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/uncrossOff', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        code: id,
                                        name: item.name,
                                        quantity: item.quantity,
                                        category: item.category,
                                        itemIndex: index
                                    }),
                                    headers: {
                                    'Content-Type': 'application/json'
                                    }
                                });
                            }}>{item.quantity} - {item.name}</p>
                            <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/permDelete.png?v=1703740581264" className="crossed-off-item-delete" 
                                onClick={() => {
                                    // Remove item from crossed off
                                    const newCrossedOff = [...crossedOff];
                                    newCrossedOff.splice(index, 1);
                                    setCrossedOff(newCrossedOff);

                                    fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/item', {
                                        method: 'DELETE',
                                        body: JSON.stringify({
                                            code: id,
                                            itemIndex: index
                                        }),
                                        headers: {
                                        'Content-Type': 'application/json'
                                        }
                                    });
                                }
                            }
                            />
                        </div>
                    );
                })
            }
            <div className='footer' />
            {
                showAddCategory ? (
                    <React.Fragment>
                        <div id="add-category-overlay" onClick={() => { 
                            setShowAddCategory(false);
                            setNewCategory('');
                        }}></div>
                        <div id='add-category-modal'>
                            <input id="add-category-input" type="text" placeholder="Category Name" onChange={(event) => {
                                setNewCategory(event.target.value);
                            }} value={newCategory} />
                            <button id="add-category-btn" onClick={() => {
                                if(newCategory === '') return;

                                const category = {
                                    name: newCategory,
                                    items: []
                                };

                                // Add category to the front of the categories array
                                setCategories([category, ...categories]);

                                // Make a post request to https://our-lists-4ff1ad33d970.herokuapp.com/list/addCategory with the id of the list and the new category
                                fetch('https://our-lists-4ff1ad33d970.herokuapp.com/list/addCategory', {
                                    method: 'POST',
                                    body: JSON.stringify({code: id, categoryName: newCategory}),
                                    headers: {
                                    'Content-Type': 'application/json'
                                    }
                                });
                                setShowAddCategory(false);
                                setNewCategory('');
                            }}>Add</button>
                        </div>
                    </React.Fragment>
                ) : null
            }
        </div>
    );
};

export default List;