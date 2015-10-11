'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const port = 3000;
const app = express();

app.use(bodyParser.json());

// A list of companies
var companies = [
    {
        id: 0,
        name: 'te og kaffi',
        punchCount: 10
    },
    {
        id: 1,
        name : 'gló',
        punchCount : 10
    }
];

let users = [
    {
        id : 0,
        name: 'Arnar',
        email: 'arnarka13@ru.is'
    },
    {
        id : 1,
        name : "Jörri",
        email : 'jorri@ru.is'
    }
];

let punches = [
    {
        companyId : 0,
        userId : 1,
        date : "2015-10-11"
    },
    {
        companyId : 1,
        userId : 1,
        date : "2015-10-10"
    }
];

// Returns a list of all registered companies
app.get('/api/companies', (req, res) => {
    res.send(companies);
});

// Adds a new company
app.post('/api/companies', (req, res) => {
    console.log('req.body', req.body);
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
    res.status('201').send('../api/companies/' + nextId);
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
        res.status('404').send('company not found.');
    }
});

// Returns a list of all users
app.get('/api/users', (req,res) => {
    res.status('200').send(users);
});

// Adds a new user to the system
app.post('/api/users', (req, res) => {
    console.log('req.body', req.body);
    if (!req.body.hasOwnProperty('name')) {
        res.status('412').send('missing attribute: name');
        return;
    }
    if (!req.body.hasOwnProperty('email')) {
        res.status('412').send('missing attribute: email');
        return;
    }

    users.push(req.body);
    let userIndex = users.indexOf(req.body);
    res.status('201').send('../api/users/' + userIndex);
});

/*
(20%) /api/users/{id}/punches - GET
Returns a list of all punches registered for the given user. Each punch contains
information about what company it was added to, and when it was created.
It should be possible to filter the list by adding a "?company={id}" to the query.
(20%) /api/users/{id}/punches - POST
Adds a new punch to the user account. The only information needed is the id of
the company.
*/
// Returns a list of all punches registered for the given user.
app.get('/api/users/:id/punches', (req, res) => {
    const id = parseInt(req.params.id);
    if (req.query.company) {
        console.log('company', req.query.company);
        res.status('200').send('Requested id: '+req.params.id+" filter: "+req.query.company);
    } else {
        const userPunches = _.filter(punches, 'userId', id);
        console.log('userPunches', userPunches);
        const punchesDTO = [];
        _.forEach(userPunches, (punch) => {
            const company = _.find(companies, (c) => {
                return c.id === punch.companyId;
            });
            punchesDTO.push({
                company: company.name,
                date: punch.date
            });
        });
        res.status('200').send(punchesDTO);
    }
});

// Adds a new punch to the user account.
app.post('/api/users/:id/punches', (req, res) => {
    if(!req.body.hasOwnProperty('companyId')){
        res.status(412).send('Missing attribute company id!');
    }
    const companyId = req.body.companyId;
    console.log("CompanyId", companyId);
    punches.push(req.body);
    res.status('201').send('../api/users/'+companyId+'/punches');
});


// Run the server
app.listen(port, () => {
    console.log('Server is on port', port);
})
