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

The required `.env` value is `MONGODB_URI`, which should be set to the connection
string for the MongoDB Cluster you will use for development.

Optionally, you may also defined two additional `.env` values if you have
separate databases for production and staging sites

- To get the value from `MONGODB_URI_PRODUCTION`, `export NODE_ENV=production`
- To get the value from `MONGODB_URI_STAGING`, `export NODE_ENV=staging`

Or, in a Heroku environment, for example, set the `NODE_ENV` value as a Config Var.

Follow the instructions at
<https://ucsb-cs48.github.io/topics/mongodb_cloud_atlas_setup/> to set
up a MongoDB database on Mongo Cloud Atlas. You'll need to put the
specific MongoDB URI for your database (copying in the correct
password) into your `.env` file, e.g.

```
MONGODB_URI=mongodb+srv://db-user-here:actual-password-here@cluster0-6c3fw.mongodb.net/test?retryWrites=true&w=majority
```

NOTE: This URI above is _only an example_ and is _totally
fake_. All of the parts of the URI will be _specific_ to the MongoDB
cluster you create, not just the user and password. So please go
through the setup instructions in detail to generate your own proper
MongoDB Connection String.

# Setup of initial admin user

After setting up a MongoDB cluster and obtaining the MONGODB_URI, to
set up an initial admin user, follow the instructions in [/docs/mongo-setup.md](./docs/mongo-setup.md).
