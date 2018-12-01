# Blocipedia

Blocipedia is a wiki creation application built in Node.js on a Postgres database, structured according to the MVC architectural framework.

It authenticates users with a valid email and allows them to create an account. Users can have either a standard or premium account. All users can perform simple CRUD operations to create wikis and post within those wikis

Premium users are also able to create private wikis, which are inaccessible to standard users, unless they are listed as an approved collaborator of that wiki.
