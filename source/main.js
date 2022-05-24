// -- LIBRARIES --
const process = require('process');
const tmi = require('tmi.js');
const spamCheck = require('spam-detection');
// -- LOCAL FILES --
const Functions = require("./functions");
const WaitOnKeyPress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false)
    resolve()
  }))
}
(async () => {
  // Set encoding in console.
  process.stdout.setEncoding('utf8');

  // ----- GET ARGUMENTS SUPPLIED -----
  Functions.ReadAndApplyArguments();
  // ----- GET ARGUMENTS SUPPLIED -----
  Functions.AppTitle(`Twitch Chat - Meaningfull Messages [${Functions.StringChannelsList()}]`);

  Functions.DrawHelpInfo();
  // wait for 2 seconds now...
  console.log("Press any key to continue... ")

  await WaitOnKeyPress();
  
  process.stdout.write('\033c');
  console.log("------------------ CHAT INITIALIZED ------------------")
  // set twitch client
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true
    },
    channels: Functions.Channels
  });

  // set message handling
  client.on('message', (channel, tags, message, self) => 
  {
    if(!Functions.MessageConstraints(tags)){
      return;
    }

    const results = spamCheck.getResults(message); // this is required... - somehow...
    const detection = spamCheck.detect(message);

    let msg = Functions.ClearMessage(message);

    let split = msg.split(" "), tableOfWords = {};

    const duplicatedAmounts = Functions.GenerateDuplocatedWordsTable(tableOfWords, split);

    msg = Functions.RemoveDuplicatedWords(msg, tableOfWords);

    msg = msg.replace(/  /, ' '); // remove doublespaces that got leftover after removing other things
    split = msg.split(" "); // resplit for amount of words left

    // lets validate the message if its worth being displayed
    if(!Functions.Validation(duplicatedAmounts, split, msg, detection)) return; 

    const channelName = (Functions.ShouldDisplayChannelNames()) ? `[${channel}] ` : "";
    const UserName = `\x1b[32m\x1b[40m${tags['display-name']}:\x1b[0m `;
    const Message = `\x1b[37m\x1b[40m${(Functions.UseMsgInCaps) ? msg.toUpperCase() : msg}\x1b[0m`;

    Functions.DrawMessage(
      `${channelName}${UserName}${Message}`,
      `\x1b[35m--------------------------------------\x1b[0m`
    );

  });

  // lets connect to Twitch now
  client.connect();

})()



