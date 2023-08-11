# repo-archiving-tool

A small archiving tool that helps speed up the process of archiving multiple repos. 

## Installation

1. Clone this repo to your local computer
2. run `npm install`


## Personal Access Token 

The GitHub API requires a PAT(Personal Access Token) to allow you to interact with it, and to ensure security. You 
must edit the `.env` file with you own GitHub PAT(Personal Access Token). This ensures GitHub knows it is you who is doing the archiving.

## Prepare the Repos

You must ensure every repo you wish to archive has had all PR's closed and the readme file states that the 
repo is now archived. 

## Instructions 

Once you have prepared the repos--->

1. List the names of each repo in the `listOfReposToBeArchived` file. You must make sure that you have the exact 
   name (it is case-sensitive) or else it will throw an error.
2. 


