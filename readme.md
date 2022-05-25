## Twitch Meaningfull Messages

_Script made solely to slowdown twitch chats. It removes useless messages that doesnt bring any meaning in the conversation_

_Script by default removes all mentions, double spaces, duplicated words(Example: `pog pog pog`), any messages shorter then 5 characters or with less then 2 words(Example: `lol pog`), if there is more then 3 duplicated words of same kind, message will also not be displayed_

Main script location: `source/main.js`

Usage:
- Install NodeJS and Npm
- Install all packages `npm install`
- Start application `node main.js` (make sure you include proper arguments b4 starting)
- Example of application start command `node main.js channels=asmongold constraints=vip,mod,sub upperCaseMsg`

Arguments:
- **channels** -> channels that you want the messages to be displayed
  - Value Example: `channelname1,channelname2,channelname3`
  - Value Example: `channelname`
- **constraints** -> this will strictly display messages from specific constraints
  - Value Examples: `mod`
  - Value Examples: `mod,vip`
  - Value Examples: `mod,vip,sub,turbo,premium`
  - Values:
    - `mod` -> user is Mod in channel
    - `vip` -> user is VIP in channel
    - `sub` -> user is subscribed to channel
    - `turbo` -> user have "turbo" -> https://www.twitch.tv/turbo
    - `premium` -> user have "premium" -> something with amazon
  - Info: Order doesnt matter
- **upperCaseMsg** -> edits messages making them with all letters being upper case
  - Info: this is a flag argument it doesnt accept any values
- **notHarshDetection** -> disable harsh detection vectors that sometimes flags not spam messages as spam(it happends 1/500 or even less but it still happends)
  - Info: this is a flag argument it doesnt accept any values


For editing scripts:
_All of special code is located in functions.js file. Main functions that starts and sets everything are located in main.js_