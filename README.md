# NodeJs Developer Position Code Challenge
A simple NodeJS background service that takes a time-line of dates and sends an email notification automatically on those dates without any external trigger.
### Running app

* unzip file
* Switch into project directory from a terminal `cd project/folder`
* install dependencies: `npm install`
* Start app 'node index.js'

#### At this point you can interact with the program by giving it commands
* Command format to set a default receiver: `{"to": "email"}`
* Command format to send timeline for processing: `[{"content": "hello world", "date": "2017-12-31T14:11:01.264Z", "to": "codebugsolved@gmail.com"}]`

**Note**
### Let me see behind the curtain

* Date property can be any value that can be parsed into a date object. If date value is in the best the program will emit an error message that can be seen from the terminal
* You can omit the to property of the json objects in the timeline if default receiver is set
* If program is terminated while there are mails yet to be sent, the program will save the unsent mail into a file and resume sending once the program is up
* Test is not as robust as it should be, sorry I had issues settingup test suit, on the system I worked on, had to use jest test suit instead



##### Happy new Year😀
 