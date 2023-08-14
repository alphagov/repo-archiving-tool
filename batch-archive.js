import {Octokit} from "octokit";
import 'dotenv/config.js';

let errorCount = 0;
let successCount = 0;
const reposToBeArchived = JSON.parse(process.env.reposToBeArchived)
const pat = process.env.pat;
const verbose = process.env.verbose || "undefined";
const octokit = new Octokit({
    auth: `${pat}`
})

console.log(`=== Archiving the list of ${reposToBeArchived.length} repos...`);

for (let i = 0; i < reposToBeArchived.length; i++) {
    try {
        const response = await octokit.request('PATCH /repos/{owner}/{repo}', {
            owner: 'alphagov',
            repo: reposToBeArchived[i],
            archived: 'true',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        if(response.status === 200){
            console.log(` ✅ \x1b[33m${reposToBeArchived[i]}\x1b[0m has been archived`)
            successCount++
        }
    } catch (error) {
        if (error.response) {
            console.error(` ❌ \x1b[31mError with ${reposToBeArchived[i]}!\x1b[0m Status: ${error.response.status}. Message: “${error.response.data.message}”`)
            errorCount++;
        }
    }
    if (verbose !== "false")
    {
        console.log("=== Repos archived so far: ", successCount);
        console.log("=== Number of errors so far: ", errorCount);
    }
}
console.log(`=== ${successCount} repos have been successfully archived`)
console.log(`=== There were ${errorCount} errors`)
