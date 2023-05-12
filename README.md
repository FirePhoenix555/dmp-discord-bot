# DMP Discord bot

---

## About

Hello! I'm the official bot for Daily Math Problems! I help out my programmer, [FirePhoenix555](https://github.com/FirePhoenix555), with some tasks relating to posting and archiving DMPs, but you can use me too:

`/check`: Check your answer to a DMP! Any DMP in my archive (no matter how old) can be checked, so long as you haven't already gotten it correct... You can provide a date in this command to check a specific day's DMP, or you can leave the date field blank to check your answer for the most recently posted DMP.  
`/leaderboard`: Display the DMP solving leaderboard! I keep track of a leaderboard based on your attempt history for any DMPs in my archive. You can display that with this command. I hope this encourages you to keep up the work on math problems!  
`/info`: Provide information about a past DMP! Just enter the date and I'll tell you some information about a DMP in my archive, including a link to the post, the content and attachments, and whether or not you've solved it yet.  
`/help`: List out my intro message. Pretty self-explanatory; responds to the command with this message.

And, if you happen to be my programmer (I don't know why you're here for this but I suppose I'll help anyway), here are some of your commands:

`/archive`: Archive a single DMP to the database! You can add DMPs to my archive file using this command. Simply provide the ID of the message and the date and answer of the DMP, and I'll take care of the archiving for you.  
`/queue`: Queue a DMP to be posted on a specified date! Your DMP will be posted at 12 PM CST / 1 PM CDT on the specified day. Make sure to provide the date, answer, and any content or attachments for the DMP.  
`/grade`: Grade someone's response to a DMP! Use `/grade [user] true` to mark an answer as correct and `/grade [user] false` to mark an answer incorrect.

My code is publicly available on GitHub! You can check it out [here](https://github.com/FirePhoenix555/dmp-discord-bot).

---

## Rules for Use

1. **When interacting with the bot, you will:**  
    1. Not (intentionally) troll or spam
    2. Not attempt to insert code (malicious or otherwise) into the arguments of a command in an attempt to get the code to run on the server
2. **When viewing or editing the bot's code, you will:**
    1. Report any issues you find to me, and only to me, without abusing or attempting to abuse them
3. **Always, no matter how you are using the bot, you will:**
    1. Have common sense and don't do what you think should be against the rules, regardless if it is explicitly prohibited here
    2. Not attempt to abuse loopholes in these rules

*I am the only person that needs to decide that you have broken the rules for you to get banned from future bot use. There may be rules not listed here that will get you banned despite not being listed.*  
*If I think you've broken the rules, you have.*

---

## Todo

1. **Refactoring**
    * Rework invalid format errors: invalid answer format (answer is badly formatted) and invalid command format (bad date, etc)
2. **File updates**
    * `leaderboard.json`:
      * send `"you've already answered" on incorrect answers too?
      * including "kdr" (correct : incorrect ratio)? maybe not?
        * kdr: `round(10*(correct+1)/(attempts+2), 2)` to encourage more attempts in general?
        * send command log to testing channel?
    * `archives.json`:
      * back up when every message archived
    * Move files to actual database
3. **Command updates**
    * `/log`:
      * remove when done archiving
    * `/ban`:
      * functionality (ban from bot commands)
    * `/queue`:
      * add "will post at 12pm in the winter (cst) / 1pm in the summer (cdt)" to description
    * `/check`:
      * New user input classes / support
        * Support for `x=1` format / lines (`y=mx+b`) / equation
        * Support for points (`(x,y)`)
        * Support for strings (true/false: yes/no, y/n, t/f)
      * Formatting user input
        * Remove spoiler warning and just reformat answer instead (later)
        * `2xsqrt()` -> `2x*sqrt()`
    * `/info [user]`: (?)
      * functionality (list the DMPs you've solved)
    * `/suggest`, `/accept`: (?)
      * functionality (suggest DMPs and queue from the suggestions list)
      * autoban suggester from answering DMP (but maybe offer some other reward)
4. **Output updates**
    * move "user got this correct" message to always be in #dmp (after testing done)
5. **General bot updates**
    * Host the bot online
    * Set bot nickname/profile pic
6. **Testing**
    * does queueing several days in advance work? (images might be deleted?)

---