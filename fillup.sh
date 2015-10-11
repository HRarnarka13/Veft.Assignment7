#!/bin/bash

# Set up users
curl -XPOST -d "{ \"name\" : \"Eysteinn\", \"email\" : \"eysteinn13@ru.is\" }" -H "Content-Type: Application/json" http://localhost:3000/api/users
echo
curl -XPOST -d "{ \"name\" : \"Arnar\", \"email\" : \"arnarka13@ru.is\" }" -H "Content-Type: Application/json" http://localhost:3000/api/users
echo
echo "http://localhost:3000/api/users"
curl -XGET http://localhost:3000/api/users
# Set up companies
echo
curl -XPOST -d "{ \"name\" : \"Glo\", \"punchCount\" : 10 }" -H "Content-Type: Application/json" http://localhost:3000/api/companies
echo
curl -XPOST -d "{ \"name\" : \"Serrano\", \"punchCount\" : 10 }" -H "Content-Type: Application/json" http://localhost:3000/api/companies
echo
echo "http://localhost:3000/api/companies"
curl -XGET http://localhost:3000/api/companies

echo
echo "http://localhost:3000/api/companies/0"
curl -XGET http://localhost:3000/api/companies/0

echo
echo "http://localhost:3000/api/companies/3"
curl -XGET http://localhost:3000/api/companies/3

# Adding punches
echo
curl -XPOST -d "{ \"companyId\" : 0 }" -H "Content-Type: Application/json" http://localhost:3000/api/users/0/punches
echo
curl -XPOST -d "{ \"companyId\" : 1 }" -H "Content-Type: Application/json" http://localhost:3000/api/users/0/punches

# Get punches
echo
echo "http://localhost:3000/api/users/0/punches"
curl -XGET http://localhost:3000/api/users/0/punches
echo
echo "http://localhost:3000/api/users/0/punches?company=0"
curl -XGET http://localhost:3000/api/users/0/punches?company=0
echo
echo "http://localhost:3000/api/users/0/punches?company=4"
curl -XGET http://localhost:3000/api/users/0/punches?company=4
echo
echo "http://localhost:3000/api/users/2/punches?company=0"
curl -XGET http://localhost:3000/api/users/2/punches?company=4
echo
echo "http://localhost:3000/api/users/0/punches/0"
curl -XGET http://localhost:3000/api/users/0/punches/0
