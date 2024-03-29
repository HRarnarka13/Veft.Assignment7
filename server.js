'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const port = 3000;
const app = express();

const url = 'http://localhost:' + port + '/api';

app.use(bodyParser.json());

// A list of companies
let companies = [];
let users = [];
let punches = [];

// Returns an array of UserPunchesDTO objects
function getUserPunchesDTO(userPunches) {
    const punchesDTO = [];
    _.forEach(userPunches, (punch) => {
        const company = getCompanyById(punch.companyId);
        if (company) {
            punchesDTO.push({
                company: company.name,
                date: punch.date
            });
        }
    });
    return punchesDTO;
}

function getUserById(userId) {
    return _.find(users, (u) => {
        return u.id === userId;
    });
}

function getCompanyById(companyId) {
    return _.find(companies, (c) => {
        return c.id === companyId;
    });
}

// Returns a list of all registered companies
app.get('/api/companies', (req, res) => {
    res.send(companies);
});

// Adds a new company
app.post('/api/companies', (req, res) => {
    if (!req.body.hasOwnProperty('name')) {
        res.status('412').send('missing attribute: name');
        return;
    }
    if (!req.body.hasOwnProperty('punchCount')) {
        res.status('412').send('missing attribute: punchCount');
        return;
    }

    let nextId = companies.length;
    let company = {
        id : nextId,
        name: req.body.name,
        punchCount: req.body.punchCount
    };
    companies.push(company);
    res.status('201').send(url + '/companies/' + nextId);
});

// Returns a given company by id.
app.get('/api/companies/:id', (req, res) => {
    const id = req.params.id;
    const company = _.find(companies, (c) => {
        return c.id == id;
    });
    if (company) {
        res.status('200').send(company);
    } else {
        res.status('404').send('Company not found.');
    }
});

// Returns a list of all users
app.get('/api/users', (req,res) => {
    res.status('200').send(users);
});

// Adds a new user to the system
app.post('/api/users', (req, res) => {
    if (!req.body.hasOwnProperty('name')) {
        res.status('412').send('Missing attribute: name');
        return;
    }
    if (!req.body.hasOwnProperty('email')) {
        res.status('412').send('Missing attribute: email');
        return;
    }
    let nextId = users.length;
    users.push({
        id: nextId,
        name : req.body.name,
        email : req.body.email
    });
    res.status('201').send(url + '/users/' + nextId);
});

// Returns a list of all punches registered for the given user.
app.get('/api/users/:id/punches', (req, res) => {
    const id = parseInt(req.params.id);
    const user = getUserById(id);
    if (user) {
        if (req.query.company) {
            const companyId = parseInt(req.query.company);
            const userPunches = _.filter(punches, {'userId': id, 'companyId': companyId});
            res.status('200').send(getUserPunchesDTO(userPunches));
        } else {
            const userPunches = _.filter(punches, 'userId', id);
            res.status('200').send(getUserPunchesDTO(userPunches));
        }
    } else {
        res.status('404').send('User not found.');
    }
});

// Adds a new punch to the user account.
app.post('/api/users/:id/punches', (req, res) => {
    const id = parseInt(req.params.id);
    const user = getUserById(id);
    if (user) {
        if(!req.body.hasOwnProperty('companyId')){
            res.status(412).send('Missing attribute company id!');
        }
        const companyId = req.body.companyId;
        const company = getCompanyById(companyId);
        if (company) {
            let nextId = punches.length;
            punches.push({
                id : nextId,
                userId : id,
                companyId : companyId,
                date : Date.now()
            });
            res.status('201').send(url + '/users/'+ id + '/punches/' + nextId);
        } else {
            res.status('412').send('Company not found.');
        }
    } else {
        res.status('404').send('User not found.');
    }
});

app.get('/api/users/:userId/punches/:punchId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = getUserById(userId);
    if (user) {
        const punchId = parseInt(req.params.punchId);
        const punch = _.find(punches, (p) => {
            return p.id === punchId;
        });
        if (punch) {
            res.status('200').send(punch);
        } else {
            res.status('404').send('Punch not found.');
        }
    } else {
        res.status('404').send('User not found.');
    }
});


// Run the server
app.listen(port, () => {
    console.log('Server is on port', port);
});
