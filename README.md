# DMP Discord bot

---
### Todo Before Release
1. Reset `channelId` etc in `config.json` to actual DMP channel and not the test (yall on github won't be able to see this rip)
2. ~~Archive command~~
    * ~~Attachments~~
3. ~~Post from queue~~
4. ~~Queue command~~
    * ~~but only me~~
5. ~~Check command~~
    * ~~user inserts answer with `/check (answer*) (date)`~~
      * ~~if date not entered, default to last dmp~~
    * autocheck that's not just directly comparing (evaluate f(x) at multiple points and check for match)
6. ~~Update date input commands (`/archive`, `/queue`, `/check`) to validate date format~~
    * And change option types anyway
7. ~~Auto-archive on DMP post~~

### Todo Eventually
1. Read from archive command?
2. Refactoring
    * Move date code into its own file
    * Move json files into own folder
    * I'm sure there's more code I can reorganize into separate files
3. Leaderboard command
4. semi-dmps?