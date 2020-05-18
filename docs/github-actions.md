# Configuring Secrets for Github Actions

Why we need do do this: So that the test cases will have access to the
secrets for Auth0, MongoDB, etc. and our test cases will pass.

For a more detailed explanation, read all the way to the end of the file.

# How to configure the secfrets for Auth0

To configure the Auth0 secrets for GitHub Actions, go to your repo on GitHub.

Click the "Settings" tab for repo, and the find the "Secrets" tab in the left sidebar.

- If your repo name is `cgaucho-lab00` you can also find this at the URL
  `https://github.com/ucsb-cs48-s20/cgaucho-lab00/settings/secrets`

For each of the three secrets in the list below, click "Add Secret"
and enter the key and the value. For example:

![add-secret.png](images/add-secret_50pct.png)

When you are finished, you should have secrets defined for all three
of the values you set up in the instructions listed in [docs/auth0-localhost.md](auth0-localhost.md)

![all-three-secrets.png](images/all-three-secrets.png)

At this point, if you push a new commit to GitHub to trigger a new build,
you should see that the tests pass (provided they were passing in the
starter code repo at the time you copied it.)

# Additional Secrets for MongoDB

Using the same process, you will need to add a secret for
`MONGODB_URI` and `MONGODB_URI_TEST` that points to the database you want
to use when running tests via GitHub actions. Typically, this should be
a different MongoDB instance (cluster) from the one you use for development,
QA and production.

# A more detailed explanation

This repo is already configured to run tests using GitHub Actions.

This is done through the files under the directory `.github/workflows/`

As a result, each commit should have a green check or a red x
indicating whether or not that commit passed or failed the test suite.

However, for the tests to work properly, they need the same three
secrets defined in `.env` via the steps to be exposed to the GitHub
Actions. This is done via the `Secrets` item in the repository settings.

# Next step

Return to [README.md](../README.md) and proceed with configuring for production on now.sh
