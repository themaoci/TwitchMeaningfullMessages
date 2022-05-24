class TMM {
  constructor(){
      this.Channels = ["asmongold"]; // yea we all love this guy dont we ?
      this.SubOnly = false;
      this.ModOnly = false;
      this.VipOnly = false;
      this.PremiumOnly = false;
      this.TurboOnly = false;
      this.UseMsgInCaps = false;
      this.DisableHarshDetection = false;
  }

  AppTitle = (newTitle) => process.title = newTitle; 

  MessageConstraints = (tags) => {
    
    const isMod = tags['mod'];
    const isSub = (tags['badges'] != undefined) ? tags['badges']['subscriber:'] != undefined : tags['subscriber'];
    const isVip = (tags['badges'] != undefined) ? tags['badges']['vip'] != undefined : false;
    const isPremium = (tags['badges'] != undefined) ? tags['badges']['premium'] != undefined : false;
    const isTurbo = (tags['badges'] != undefined) ? tags['badges']['turbo'] != undefined : false;

    if(isMod && this.ModOnly) 
      return true;
    if(isSub && this.SubOnly) 
      return true;
    if(isVip && this.VipOnly) 
      return true;
    if(isPremium && this.PremiumOnly) 
      return true;
    if(isTurbo && this.TurboOnly) 
      return true;
    if(!this.ModOnly && !this.SubOnly && !this.VipOnly && !this.PremiumOnly && !this.TurboOnly) 
      return true;
    return false;
  }
  ReadAndApplyArguments = () => 
  {
    process.argv.forEach((val, index) => {
      const split = val.split('=');
      if(split.length > 1)
      {
        if(split[0].includes("channels"))
        {
          const channelsToListen = split[1].split(',');
          this.Channels = channelsToListen;
        }
        if(split[0].includes("constraints"))
        {
          const constrains = split[1].split(',');
          for(let constraint of constrains)
          {
            switch(constraint)
            {
              case "mod": this.ModOnly = true; break;
              case "vip": this.VipOnly = true; break;
              case "sub": this.SubOnly = true; break;
              case "turbo": this.TurboOnly = true; break;
              case "premium": this.PremiumOnly = true; break;
            }
          }
        }
        if(split[0].includes("upperCaseMsg"))
        {
          this.UseMsgInCaps = true;
        }
        if(split[0].includes("notHarshDetection"))
        {
          this.DisableHarshDetection = true;
        }
      }
    });
  }
  DrawHelpInfo = () => 
  {
    console.log('Application argument usage:');
    console.log('=> "channels=channelname1,channelname2,channelname3" or "channels=channelname"');
    console.log('=> "constraints=mod,vip,sub,turbo,premium" set constraints to display messages (you can choose how much constraints you want to use this option is optional)');
    console.log('=> "upperCaseMsg" (flag) changes all messages content to uppercase');
    console.log('=> "notHarshDetection" (flag) disable Harsh detection vectors (it sometimes removes messages that are not spam) ');
    console.log('Channels to listen:');
    console.log(this.Channels);
  }
  DrawMessage = (message, spacer) => {
    console.log(message);
    console.log(spacer);
  }
  StringChannelsList = () => this.Channels.join(", ");
  ShouldDisplayChannelNames = () => this.Channels.length > 1;
  replaceAllExceptFirst = (str, search, replace) =>
  {
    let splitted = str.split(search);
    if(splitted.length > 0){
        return splitted.reduce((prev, curr, i) => prev + (i == 1 ? search : replace) + curr);
    } else {
        return str;
    }
  }
  ClearMessage = (str) =>
  {
    str = str.replace(/:.*:/, ''); // remove 
    str = str.replace(/  /, ' '); // remove double spaces
    str = str.replace(/@.* /, ''); // remove mensions
    return str;
  }
  RemoveDuplicatedWords = (str, tableOfWords) => 
  {
    const DuplicatedKeys = Object.keys(Object.keys(tableOfWords).filter(el => tableOfWords[el] > 1));
    for(let key of DuplicatedKeys)
    {
        str = this.replaceAllExceptFirst(str, key, "");
    }
    return str;
  }
  GenerateDuplocatedWordsTable = (tableOfWords, split) =>
  {
    let duplicatedAmounts = 0;
    for (let i = 0; i < split.length; i++) {
        if (tableOfWords[split[i]] === undefined) {
        tableOfWords[split[i]] = 1;
        } else {
        tableOfWords[split[i]]++;
        if(duplicatedAmounts < tableOfWords[split[i]])
        {
            duplicatedAmounts = tableOfWords[split[i]];
        }
        }
    }
    return duplicatedAmounts;
  }
  Validation = (duplicatedAmounts, split, msg, detection) => 
  {
    if(duplicatedAmounts > 3) return false; // remove if highest duplicate word is greater then 3 times
    if(split.length < 3) return false; // remove meaning less comments
    if(msg.length < 5) return false; // message shorter then 5
    if(!this.DisableHarshDetection && detection == "spam") 
    { 
      /*console.log("SPAM: " + msg);*/ return false; 
    } 
    return true;
  }

}

module.exports = new TMM();