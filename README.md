### DMP Discord bot
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
### Todo Before Release
1. ~~Reset `channelId` etc in `config.json` to actual DMP channel and not the test (yall on github won't be able to see this rip)~~
2. ~~Archive command~~
    * ~~Attachments~~
3. ~~Post from queue~~
4. ~~Queue command~~
    * ~~but only me~~
5. ~~Check command~~
    * ~~user inserts answer with `/check (answer*) (date)`~~
      * ~~if date not entered, default to last dmp~~
    * ~~autocheck that's not just directly comparing (evaluate f(x) at multiple points and check for match)~~
6. ~~Update date input commands (`/archive`, `/queue`, `/check`) to validate date format~~
    * ~~And change option types anyway~~
7. ~~Auto-archive on DMP post~~

### Todo Eventually
1. ~~Read from archive command?~~
2. Refactoring
    * ~~Move date code into its own file~~
    * ~~Move json files into own folder~~
    * ~~I'm sure there's more code I can reorganize into separate files~~
    * Remove unnecessary `console.log`s
    * ~~List default replies in `config.json`~~
      * ~~only as one attribute though, not multiple~~
      * ~~send response on "invalid format" log~~
3. ~~Leaderboard command~~
    * ~~Don't re-check an answer if a user's already gotten it correct~~
      * send "you've already answered" on incorrect answers too?
    * including "kdr" (correct : incorrect ratio)? maybe not? ~~maybe `console.log` on attempt but nothing more?~~
      * kdr: `round(10*(correct+1)/(attempts+2), 2)` to encourage more attempts in general?
      * send command log to testing channel?
    * ~~sort alphabetically (by user id?) on tie~~
4. semi-dmps?
5. Host the bot online
    * Move database files onto an actual database
6. ~~Help / introduction command~~
    * ~~Pin in #dmp~~
7. ~~legacy command to archive dmps from link list~~
    * remove this when you're done archiving
      * back up `archives.json` after everything is archived
8. Move "user got this correct" message to always be in #dmp
    * After testing done though
9. Add "will post at 12pm in the winter (cst) / 1pm in the summer (cdt)" to `/queue` description
10. New user input classes / support
    * ~~Matrix user input class (format convert to mathjs `[a b; c d]`)~~
    * ~~Detect variable with `/[^a-z]+([a-z]+)[^a-z]+/` or smth~~
    * Support for `x=1` format / lines (`y=mx+b`) / equation
    * ~~Support for complex numbers~~
    * Support for points (`(x,y)`)
    * Support for strings
      * true/false: yes/no, y/n, t/f
11. Set bot ~~status~~/nickname/profile pic
12. ~~Move `/help` descriptions to config file~~
13. ~~Add `/help [command]`~~
14. ~~Add replacement for superscript characters to their corresponding normal ones (so that they work properly with mathjs)~~
15. Remove spoiler warning and just reformat answer instead (later)
16. Does queueing several days in advance work? (images might be deleted?)
17. `/ban` command (for trolling / spamming / ~xss)
18. `2xsqrt()` -> `2x*sqrt()`?
19. Rework invalid format errors: invalid answer format (answer is badly formatted) and invalid command format (bad date, etc)
20. Command to list the DMPs you've solved? maybe `/info [user]`?