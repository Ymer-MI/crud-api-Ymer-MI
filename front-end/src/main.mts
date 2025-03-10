import './style.css';
import CAPIService from './services/CRUD-API-Service.mts';

const app = document.createElement('main'), users = await CAPIService.getUsers(), section = document.createElement('section');

Object.assign(section, {
    id: 'users-container',
    innerHTML: `<h1>Users:</h1>`
});

app.id = 'app';

app.append(section);
document.body.append(app);

users?.forEach(user => {
    const div = document.createElement('div'), h2 = document.createElement('h2'), h3 = document.createElement('h3'),
        p = document.createElement('p');

    h2.innerHTML = user.name;
    h3.innerHTML = user.profession ?? '';
    p.innerHTML  = `
        ${user.address.street}<br>
        ${user.address.zip}, ${user.address.city}
    `;

    div .append(h2, h3, p);
    section.append(div);
});