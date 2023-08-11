// Octokit.js
// https://github.com/octokit/core.js#readme
import {Octokit} from "octokit";
import 'dotenv/config.js';
//import {reposToBeArchived} from "./listOfReposToBeArchived.js";

let errorCount = 0;
let successCount = 0;
const reposToBeArchived = JSON.parse(process.env.reposToBeArchived)
const pat = process.env.pat;
const octokit = new Octokit({
    auth: `${pat}`
})
console.log(reposToBeArchived);
console.log("=== Archiving the list of repo's...");

for (let i = 0; i < reposToBeArchived.length; i++) {
    try {
        const response = await octokit.request('PATCH /repos/{owner}/{repo}', {
            owner: 'alphagov',
            repo: reposToBeArchived[i],
            archived: 'false',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        if(response.status === 200){
            console.log(`=== ${reposToBeArchived[i]} has been archived`)
            successCount++
        }
    } catch (error) {
        if (error.response) {
            console.error(`Error! Status: ${error.response.status}. Message: 
        ${error.response.data.message}`)
            errorCount++;
        }
    }

    console.log("=== Repos archived so far: ", successCount);
    console.log("=== Number of Errors so far: ", errorCount);
}
console.log(`=== All ${successCount} repos have been successfully archived`)
console.log(`=== There were ${errorCount} errors`)
