import {Octokit} from "octokit";
import 'dotenv/config.js';

let errorCount = 0;
let successCount = 0;
const reposToBeArchived = JSON.parse(process.env.reposToBeArchived)
const pat = process.env.pat;
const verbose = process.env.verbose || "undefined";
const userToEscalate = process.env.userToEscalate;
const repoOwner = 'alphagov';
const escalationPrivilege = 'maintain';
const octokit = new Octokit({
    auth: `${pat}`
})

console.log(`=== Escalating ${userToEscalate} in a list of ${reposToBeArchived.length} repos with PAT ending ${pat.slice(-4)}...`);

for (let i = 0; i < reposToBeArchived.length; i++) {
    try {
        const response = await octokit.request('PUT /repos/{owner}/{repo}/collaborators/{username}', {
            owner: repoOwner,
            repo: reposToBeArchived[i],
            username: userToEscalate,
            permission: escalationPrivilege,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        if(response.status === 204){
            console.log(` ✅ ${userToEscalate} has been made a maintainer of \x1b[33m${repoOwner}/${reposToBeArchived[i]}\x1b[0m`)
            successCount++
        }else if (response.status === 201)
        {
            console.log(` ✅ ${userToEscalate} has been invited as a maintainer of \x1b[33m${repoOwner}/${reposToBeArchived[i]}\x1b[0m`)
            successCount++
        }
    } catch (error) {
        if (error.response) {
            console.error(` ❌ \x1b[31mError with escalating ${userToEscalate} for \x1b[1;4m${repoOwner}/${reposToBeArchived[i]}\x1b[0;31m!\x1b[0m Status: ${error.response.status}. Message: “${error.response.data.message}”`)
            errorCount++;
        }
    }
    if (verbose !== "false")
    {
        console.log("=== Repos amended so far: ", successCount);
        console.log("=== Number of errors so far: ", errorCount);
    }
}
console.log(`=== ${successCount} repos have been successfully amended`)
console.log(`=== There were ${errorCount} errors`)
