"use strict";
import {Octokit} from "octokit";
import 'dotenv/config.js';

let errorList = [];
let successList = [];
let archiveList = [];
const reposList = JSON.parse(process.env.reposList)
const pat = process.env.pat;
const verbose = process.env.verbose || "undefined";
const userToEscalate = process.env.userToEscalate;
const repoOwner = 'alphagov';
const escalationPrivilege = 'maintain';
const apiVersion = '2022-11-28';
const octokit = new Octokit({
    auth: `${pat}`
})

console.log(`=== Escalating ${userToEscalate} in a list of ${reposList.length} repos with PAT ending ${pat.slice(-4)}...`, (verbose !== "false") ? " in verbose mode." : '');

for (let i = 0; i < reposList.length; i++) {
    let wasRepoArchived = false;
    try {
        const repo = await octokit.request('GET /repos/{owner}/{repo}', {
            owner: repoOwner,
            repo: reposList[i],
            headers: { 'X-GitHub-Api-Version': apiVersion }
        })
        if (repo.data.archived === true)
        {
            if (verbose !== "false")
            {
                console.log(`Repo \x1b[33m${repoOwner}/${reposList[i]}\x1b[0m is currently archived...`)
            }
            wasRepoArchived = true;
            archiveList.push(reposList[i]);

            const unarchive = await octokit.request('PATCH /repos/{owner}/{repo}', {
                owner: repoOwner,
                repo: reposList[i],
                archived: 'false',
                headers: { 'X-GitHub-Api-Version': apiVersion }
            })

            if (unarchive.status !== 200)
            {
                console.error(` 🟡 \x1bError unarchiving \x1b[33m${repoOwner}/${reposList[i]}\x1b[0m. Message: “${response.data.message}”`)
            } else if (verbose !== "false")
            {
                console.log(`Unarchived \x1b[33m${repoOwner}/${reposList[i]}\x1b[0m`)
            }
        }

        const response = await octokit.request('PUT /repos/{owner}/{repo}/collaborators/{username}', {
            owner: repoOwner,
            repo: reposList[i],
            username: userToEscalate,
            permission: escalationPrivilege,
            headers: { 'X-GitHub-Api-Version': apiVersion }
        })
        if (response.status === 204){
            console.log(` ✅ ${userToEscalate} has been made a maintainer of \x1b[33m${repoOwner}/${reposList[i]}\x1b[0m`, (repo.data.archived) ? ", which had been archived." : '');
            successList.push(reposList[i]);
        } else if (response.status === 201)
        {
            console.log(` ✅ ${userToEscalate} has been invited as a maintainer of \x1b[33m${repoOwner}/${reposList[i]}\x1b[0m`, (repo.data.archived) ? ", which had been archived." : '')
            successList.push(reposList[i]);
        } else if (verbose !== "false")
        {
            console.log(`Response ${response.status}: “${response.data.message}” on escalating \x1b[33m${repoOwner}/${reposList[i]}\x1b[0m`)
        }
    } catch (error) {
        if (error.response) {
            console.error(` ❌ \x1b[31mError with escalating ${userToEscalate} for \x1b[1;4m${repoOwner}/${reposList[i]}\x1b[0;31m!\x1b[0m Status: ${error.response.status}. Message: “${error.response.data.message}”`)
            errorList.push(reposList[i]);
        } else {
            console.error(` ❌ \x1b[31mError with escalating ${userToEscalate} for \x1b[1;4m${repoOwner}/${reposList[i]}\x1b[0;31m!\x1b[0m Message: “${error.message ?? "No message"}”`)
        }
    }
    if (verbose !== "false")
    {
        console.log("=== Repos amended so far: ", successList.length, (archiveList.length > 0) ? `, of which ${archiveList.length} had been archived.` : '');
        console.log("=== Number of errors so far: ", errorList.length);
    }
}
console.log(`=== ${successList.length} repos have been successfully amended`, (archiveList.length > 0) ? `, of which ${archiveList.length} had been archived.` : '')

if (archiveList.length > 0)
{
     console.log(`===>> The following repos will need re-archiving: ["${archiveList.join('","')}"]. You probably want to copy/paste this list to somewhere.`);
}

console.log(`=== There were ${errorList.length} errors`,
    (errorList.length > 0) ? `: ["${errorList.join('","')}"].` : '.')
