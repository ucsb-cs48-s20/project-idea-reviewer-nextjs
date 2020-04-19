# project-idea-reviewer-nextjs

A nextjs version of https://github.com/ucsb-cs48-s20/project-idea-reviewer

# Configuration of `.env`

Before this app will work, you need to:

- copy `.env.SAMPLE` to `.env`
  - note that `.env` is in the `.gitignore`
- fill in correct values in the `.env` file according to the instructions below.

# Auth0 Setup (configured in `.env`)

The Auth0 Setup for this application is the same as that for this app. Follow the instructions in the `README.md` and linked documents to obtain values
for the `.env` values that start with `AUTH0_`

- <https://github.com/ucsb-cs48-s20/demo-nextjs-app>

# MongoDB Setup (configured in `.env`)

This application requires a connection to a MongoDB database.
Follow the instructions at <https://ucsb-cs48.github.io/topics/mongodb_cloud_atlas_setup/> to set up a MongoDB database on Mongo Cloud Atlas.
You'll need to put the specific MongoDB URI for your database (copying in the correct password) into your `.env` file, e.g.

```
MONGODB_URI=mongodb+srv://db-user-here:actual-password-here@cluster0-6c3fw.mongodb.net/test?retryWrites=true&w=majority
```
