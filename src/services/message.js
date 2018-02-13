const semver = require('semver');
const fs = require("fs");

let messageList = {};

function updateMessageList() {
    try {
        let content = fs.readFileSync("versionmessage.json");
        if (content) {
                messageList = JSON.parse(content);
                console.log(messageList);
        }
    } catch (e) {
        console.log("versionmessage.json Error: ", e);
        console.log("------------- Continue!");
        // gracefully continue without messages
    }

    // update table every hour
    setTimeout(updateMessageList, 1000 * 60 * 60);
}
updateMessageList();


const message = {
    getForVersion(versionTag) {
        let filteredMsgs = {};

        let myKeys = Object.keys(messageList);
        let matchingKeys = myKeys.filter(semVersionOfMsg => { return semver.satisfies(versionTag, semVersionOfMsg)});
        matchingKeys.map(key => { filteredMsgs[key] = messageList[key] });
        // for "1.0.2" may e.g., return something like:
        // {"1.0.x":"10x - xxx","1.0.2":"102 - yyyy"}
        return filteredMsgs;
    }
};

module.exports = message;
