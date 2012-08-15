# irssi-questions

A filter stream to pull out the questions from an irssi log file

## usage

```javascript
fs.createReadStream('irclogs/node.js/2012-08-16.txt')
  .pipe(IrssiQuestions())
  .pipe(fs.createWriteStream('questions.txt'))
```
