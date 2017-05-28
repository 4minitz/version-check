const semver = require('semver'),
    GitHubAPI = require('github'),
    github = new GitHubAPI();

const OWNER = '4minitz',
    REPO = '4minitz';

let versionList = {};
let currentVersion = '0.0.0';

// todo: use travis to filter version that actually work, i.e. have a green build?

function updateVersionList() {
    const gitTags = github.repos.getTags({owner: OWNER, repo: REPO})
        .then(response => {
            versionList = response.data
                // reduce entries to their name which contains just the tag name
                .map(entry => entry.name)
                // clean up the tag name to only contain the version information
                .map(semver.clean)
                // filter non-version tags
                .filter(entry => entry !== null)
                // filter preleases
                .filter(entry => semver.prerelease(entry) === null)
                // sort descending
                .sort(semver.rcompare);

            currentVersion = versionList[0] || '0.0.0';
        })
        .catch(console.error);

    // update table every hour
    setTimeout(updateVersionList, 1000 * 60 * 60);
}

updateVersionList();

// fake version data, for testing purposes, we don't want to hit githubs rate limiter (60 req/hour)
// versionList = ['0.10.0', '0.9.1', '0.9.0', '0.8.1', '0.8.0', '0.7.1',
//     '0.7.0', '0.6.1', '0.6.0', '0.5.0', '0.4.0', '0.3.0', '0.2.1',
//     '0.2.0', '0.1.0' ];
// currentVersion = '0.10.0';

const version = {
    getCurrent() {
        return currentVersion;
    }
}

module.exports = version;