"use strict";
import {Octokit} from "octokit";
import 'dotenv/config.js';

let errorList = [];
const reposList = JSON.parse(process.env.infoList)
const pat = process.env.pat;
const verbose = process.env.verbose || "undefined";
const repoOwner = 'alphagov';
const apiVersion = '2022-11-28';
const octokit = new Octokit({
    auth: `${pat}`
})

console.log(`=== Inspecting a list of ${reposList.length} repos with PAT ending ${pat.slice(-4)}...`);

for (let i = 0; i < reposList.length; i++) {
    try {
        const repo = await octokit.request('GET /repos/{owner}/{repo}', {
            owner: repoOwner,
            repo: reposList[i],
            headers: { 'X-GitHub-Api-Version': apiVersion }
        })

        console.log(`Repo \x1b[33m${repoOwner}/${reposList[i]}\x1b[0m is currently`, (repo.data.archived === true) ? '🛑 archived.' :  '✅ unarchived.', "and", (repo.data.private === true) ? '🔐 private.' :  '🟢 public.');
    } catch (error) {
        if (error.response) {
            console.error(` ❌ \x1b[31mError for \x1b[1;4m${repoOwner}/${reposList[i]}\x1b[0;31m!\x1b[0m Status: ${error.response.status}. Message: “${error.response.data.message}”`)
            errorList.push(reposList[i]);
        } else {
            console.error(` ❌ \x1b[31mError for \x1b[1;4m${repoOwner}/${reposList[i]}\x1b[0;31m!\x1b[0m Message: “${error.message ?? "No message"}”`)
        }
    }
}

console.log(`=== There were ${errorList.length} errors`,
    (errorList.length > 0) ? `: ["${errorList.join('","')}"].` : '.')
