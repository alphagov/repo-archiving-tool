# Repo-Archiving-Tool

A small archiving tool that helps speed up the process of archiving multiple repos via the GitHub API.

## Installation

1. Clone this repo to your local computer
2. Run `npm install` from your terminal.


## Personal Access Token 

The GitHub API requires a PAT(Personal Access Token) to allow you to interact with it, as well as to ensure security. 
You must edit the `.env` file with you own GitHub PAT(Personal Access Token). You can do this by adding `pat=` 
followed by your PAT.
It should look similar to this: -
`pat=7g9h9uhui9dh1d8hd012h01` (this is random alphanumeric, not a real PAT!)

[How to create a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
## Prepare the Repos

You must ensure every repo you wish to archive has had all PR's closed and the readme file states that the 
repo is now archived. 

## Instructions 

Once you have prepared the repos--->

1. List the names of each repo in the by adding an array called `reposToBeArchived` to the `.env` file, one repo name per 
   element. Make sure that you have the exact name (it is case-sensitive) or else it will throw an error. It should 
   look like this: - 
   `reposToBeArchived=["repo1", "repo2", "repo3"]` etc. 
2. Now you can run the program by typing `node batch-archive.js` into the terminal. As it is running, you will get 
   a read out of each repo as it is archived.
3. Any errors that occur will be flagged by the program, with a message to help you resolve the issue.
4. Check the repos to ensure the job it completed.

