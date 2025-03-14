import './style.css';
import CAPIService from './services/CRUD-API-Service.mts';

const app = document.createElement('main'), users = await CAPIService.getUsers(), section = document.createElement('section'),
    form = document.createElement('form'), label = document.createElement('label'), txtInp = document.createElement('input'),
    btn = document.createElement('button'), lblPlchTxt = 'Enter name to search for', updateHTML = () => {
        users?.forEach(user => {
            const div = document.createElement('div'), h2 = document.createElement('h2'), h3 = document.createElement('h3'),
                p = document.createElement('p');
        
            h2.innerHTML = user.name;
            h3.innerHTML = user.profession ?? '';
            p.innerHTML  = `
                ${user.address.street}<br>
                ${user.address.zip}, ${user.address.city}
            `;
        
            div.append(h2, h3, p);
            section.append(div);
        })
    };

app.id = 'app';

Object.assign(label, {
    htmlFor: 'name',
    innerHTML: `${lblPlchTxt}:`
})

Object.assign(txtInp, {
    type: 'text',
    placeholder: `${lblPlchTxt}...`,
    name: 'name'
});

Object.assign(btn, {
    type: 'submit',
    innerHTML: 'Search'
});

Object.assign(section, {
    id: 'users-container',
    innerHTML: `<h1>Users:</h1>`
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
})

form.append(label, document.createElement('br'), txtInp, btn);
app.append(form, section);
document.body.append(app);

updateHTML();