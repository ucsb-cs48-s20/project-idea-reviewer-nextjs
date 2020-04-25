function messageDependencyChanges(packageDiff) {
  const dependenciesDiff = packageDiff.dependencies;

  if (dependenciesDiff) {
    const addedDependencies = dependenciesDiff.added;

    if (addedDependencies.length > 0) {
      let msg = `This PR adds ${addedDependencies.length} dependencies:`;

      for (const dep of addedDependencies) {
        msg += `\n* \`${dep}\`: \`${dependenciesDiff.after[dep]}\``;
      }

      message(msg);
    }
  }
}

function messageDevDependencyChanges(packageDiff) {
  const dependenciesDiff = packageDiff.devDependencies;

  if (dependenciesDiff) {
    const addedDependencies = dependenciesDiff.added;

    if (addedDependencies.length > 0) {
      let msg = `This PR adds ${addedDependencies.length} dev dependencies:`;

      for (const dep of addedDependencies) {
        msg += `\n* \`${dep}\`: \`${dependenciesDiff.after[dep]}\``;
      }

      message(msg);
    }
  }
}

schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile("package.json");

  messageDependencyChanges(packageDiff);
  messageDevDependencyChanges(packageDiff);

  const prBody = danger.github.pr.body;

  if (!prBody) {
    warn("Don't forget to add a description to your PR!");
  }

  const prReviewers = danger.github.requested_reviewers;

  if (prReviewers.users.length === 0 && prReviewers.teams.length === 0) {
    warn("Don't forget to request reviewers!");
  }

  const prAuthor = danger.github.pr.user.login;

  markdown(`:raised_hands: Thanks for the contribution, ${prAuthor}!`);
});
