import { v4 as uuidv4 } from 'uuid';
import toastr from 'toastr';
import * as basicLightbox from 'basiclightbox';
import { loadData, saveData } from './api';

const deleteModal = basicLightbox.create(`
  <div class="delete-modal">  
    <h1>Do you really want to delete this item?</h1>
    <p id="text">Lorem</p>
    <button class="cansel">Cansel</button>
    <button class="delete">Delete</button>
  </div>
`);

const itemTemplate = ({ id, label, checked }) => 
`<li data-id=${id} class="list-group-item list-group-item-action">
    <label>
        <input type="checkbox" ${checked ? 'checked' : ''}/>
        <span>${label}</span>
    </label>
    <button type="button" class="btn btn-danger">x</button>
 </li>
`;

const refs = {
    form: document.querySelector('form'),
    listGroup: document.querySelector('ul.list-group'),
    printButton: document.querySelector('.btn-success'),
    modalText: deleteModal.element().querySelector('#text'),
    modalCanselBtn: deleteModal.element().querySelector('.cansel'),
    modalDeleteBtn: deleteModal.element().querySelector('.delete')
};

let todos = [
    // { id: '1', label: 'Cras justo odio', checked: true },
    // { id: '2', label: 'Cras justo odio', checked: false },
    // { id: '3', label: 'Cras justo odio', checked: true },
    // { id: '4', label: 'Cras justo odio', checked: false },
    // { id: '5', label: 'Cras justo odio', checked: false }
];

let currentId;

function handelModalCansel() { 
    deleteModal.close();
}

function handelModalDelete() { 
    todos = todos.filter(todo => todo.id !== currentId);
    toastr.warning('todo is successfully deleted');
    deleteModal.close();
    render();
}

function render() { 
    const items = todos.map(todo => itemTemplate(todo));
    refs.listGroup.innerHTML = '';
    refs.listGroup.insertAdjacentHTML('beforeend', items.join(''));
    saveData('todos', todos);
}

function deleteItem(id) {
    const { label } = todos.find(todo => todo.id === id);
    currentId = id;
    refs.modalText.textContent = label;
    deleteModal.show();    
}

function toggleItem(id) { 
    todos = todos.map(todo =>
        todo.id === id
            ? {
                ...todo,
                checked: !todo.checked,
            }
            : todo,
    );
}

function handleClick(event) { 
    const { id } = event.target.closest('li').dataset;

    switch (event.target.nodeName) { 
        case 'BUTTON':
            deleteItem(id);
            break;
        case 'INPUT':
        case 'LABEL':
            toggleItem(id);
            break;
    }
    render();
}

function print() { 
    console.table(todos);
}

function handleSubmit(event) { 
    event.preventDefault();
    const { value } = event.target.elements.text;

    if (!value) return;
    const newTodo = {
        id: uuidv4(),
        label: value,
        checked: false,
    }

    todos.push(newTodo);
    refs.form.reset();
    toastr.success('todo is succesfully created');
    render();
}

function onLoad() { 
    todos = loadData('todos');

    refs.listGroup.addEventListener('click', handleClick);
    refs.printButton.addEventListener('click', print);
    refs.form.addEventListener('submit', handleSubmit);
    refs.modalCanselBtn.addEventListener('click', handelModalCansel);
    refs.modalDeleteBtn.addEventListener('click', handelModalDelete);

    render();
}

onLoad();


//====================