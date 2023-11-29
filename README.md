# Repo Archiving Tool

A small archiving tool that helps speed up the process of archiving multiple repos via the GitHub API. A second script helps manage adding a collaborator to multiple repos (for example setting a robot user to be a maintainer)

## Installation

All from within your terminal --->

1. Clone this repo to your local computer
2. Type `cd repo-archiving-tool` and press enter to go into the new folder
3. Type `npm install` and hit enter.
4. Type `touch .env` and press enter to create a `.env` file.

## Personal Access Token

The GitHub API requires a PAT (Personal Access Token) to allow you to interact with it, as well as to ensure security. You must edit the `.env` file with you own GitHub PAT.

You can do this by adding `pat=` followed by your PAT.

It should look similar to `pat=7g9h9uhui9dh1d8hd012h01` for a classic PAT or pat=`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` for a fine-grained PAT. (In both cases, these are random alphanumeric strings, not real PATs!)

[How to create a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

## Instructions

### Archiving repos

1. Ensure that every repo has had all their PRs closed and the readme file states that the repo is now archived, as per [Verify ADR #0039](https://github.com/alphagov/verify-architecture/blob/master/adr/0039-use-prs-before-archiving-repos.md), if you have access.
1. List the names of each repo by adding an array called `reposToBeArchived` to the `.env` file, one repo name per element. Make sure that you have the exact name (it is case-sensitive) or else it will throw an error. It should look like `reposToBeArchived=["repo1", "repo2", "repo3"]` etc.
1. Now you can run the program by typing `node batch-archive.js` into the terminal. As it is running, you will get a readout of each repo as it is archived.
1. Any errors that occur will be flagged by the program, with a message to help you resolve the issue.
1. Check the repos to ensure the job it completed.

### Adding collaborators

The intended use-case here is to add a robot user to be maintainer to several repos at once.

1. As with archival, the repo list is contained in the `.env` file in a property `reposList=["repo1", "repo2", "repo3"]` etc.
1. Adding a collaborator also needs that user to be included in the `.env` file. Add another property like `userToEscalate=AhmedFulan`
1. Adding a collaborator also needs you to specify the privilege level for the user. As it is expected that this script will be used to add maintainers, this privilege level is hard-coded in the script, as is the organisation owner for the repo:

   ```javascript
   const repoOwner = 'alphagov';
   const escalationPrivilege = 'maintain';
   ```

   The acceptable values for the privilege level are `pull`, `triage`, `push`, `maintain`, `admin` and any custom repository role name defined by the owning organization. See [Add a repository collaborator](https://docs.github.com/en/rest/collaborators/collaborators#add-a-repository-collaborator) in the GitHub API docs for more information.
1. Now you can run the program by typing `node batch-maintainer.js` into the terminal. As it is running, you will get a readout of each repo as it is archived.
1. Any errors that occur will be flagged by the program, with a message to help you resolve the issue.
1. Check the repos to ensure the job it completed.

## Possibilities

Further to being able to batch archive, there is a wealth of other elements of a repo that you can adjust using the
API via a request call. There is an exhaustive list of possible functionality here --->

[List of Repository update parameters](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository)
