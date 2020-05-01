# project-idea-reviewer-nextjs

A nextjs version of https://github.com/ucsb-cs48-s20/project-idea-reviewer

# Commands

These likely will not work until initial configuration is done per instructions below.

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run test`         | Runs entire test suite                   |
| `npm run test:format`  | Checks the project for formatting issues |
| `npm run test:cypress` | Runs Cypress integration tests           |
| `npm run fix:format`   | Reformats all project files              |

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

Optionally, you may also define two additional `.env` values if you have
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
set up an initial admin user, follow the instructions in [docs/mongo-setup.md](./docs/mongo-setup.md).

## Configuring secrets for GitHub Actions

If your tests cases are passing locally (when you run `npm test`) but
are failing when run as Continuous Integration (CI) tests on GitHub Actions
then it may be because you need to set up secrets for GitHub Actions.

That process is explained here:
[docs/auth0-github-actions.md](./docs/auth0-github-actions.md).

# Running the Storybook

This project uses [Storybook](https://storybook.js.org/), an interactive environment for documenting and testing
individual React components. To run the storybook, type `npm run storybook`. The storybook will be accessible at
`http://localhost:6006` (or another port, if 6006 is not available).

To add new component stories to the storybook, add your `<Component Name>.stories.js` files to the `/stories` folder.
