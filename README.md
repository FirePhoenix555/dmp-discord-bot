# DMP Discord bot

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
    * Move date code into its own file
    * Move json files into own folder
    * I'm sure there's more code I can reorganize into separate files
    * Remove unnecessary `console.log`s
    * List default replies in `config.json`
      * only as one attribute though, not multiple
      * ~~send response on "invalid format" log~~
3. ~~Leaderboard command~~
    * ~~Don't re-check an answer if a user's already gotten it correct~~
      * send "you've already answered" on incorrect answers too?
    * including "kdr" (correct : incorrect ratio)? maybe not? ~~maybe `console.log` on attempt but nothing more?~~
      * kdr: `round(10*(correct+1)/(attempts+2), 2)` to encourage more attempts in general?
      * send command log to testing channel?
    * sort alphabetically (by user id?) on tie
4. semi-dmps?
5. Host the bot online
    * Move database files onto an actual database
6. Help / introduction command
    * Pin in #dmp
7. ~~legacy command to archive dmps from link list~~
    * remove this when you're done archiving
      * back up `archives.json` after everything is archived
8. Move "user got this correct" message to always be in #dmp
    * After testing done though
9. Add "will post at 12pm in the winter (cst) / 1pm in the summer (cdt)" to `/queue` description