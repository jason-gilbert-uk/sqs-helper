# sqs-helper
 A selection of helper functions when working with SQS

## writeObjectToSQS(queueURL,object)
Writes a JSON object to the SQS queue. Returns the id of the message written. Throws exception in any unexpected situation.
```
const {writeObjectToSQS,createSQS} = require('@jasongilbertuk/sqs-helper)
try {
    const myQueueURL = await createSQS('mySQSQueue')
    const myObject = {name: 'example object'}
    const msgId = await writeObjectToSQS(myQueueURL,myObject);
} catch (err) {
    //Your error handling logic
    console.log(err);
}
```

## readObjectFromSQS(queueURL)
Reads JSON objects from the SQS queue. Returns stucture including all the messages read.
```
const {writeObjectToSQS,readObjectsFromSQS,createSQS} = require('@jasongilbertuk/sqs-helper)
try {
    const myQueueURL = await createSQS('mySQSQueue')
    const myObject = {name: 'example object'}
    const msgId = await writeObjectToSQS(myQueueURL,myObject);
    const result = await readObjectFromSQS(myQueueURL);
    console.log(result.Messages);
} catch (err) {
    //Your error handling logic
    console.log(err);
}
```
## createSQS(queueName)
Creates an SQS queue. Returns the URL of the queue. Throws exception on unexpected errors.
```
const {createSQS} = require('@jasongilbertuk/sqs-helper)
try {
    const myQueueURL = await createSQS('mySQSQueue')
} catch (err) {
    //Your error handling logic
    console.log(err);
}
```
## createSQSIfDoesntExist(queueName)
Creates a named sqs queue if it doesn't already exist. Either way, returns the name of the queues url.
```
const {createSQSIfDoesntExist} = require('@jasongilbertuk/sqs-helper)
try {
    const myQueueURL = await createSQSIfDoesntExist('mySQSQueue')
} catch (err) {
    //Your error handling logic
    console.log(err);
}
```
## deleteSQS(queueURL)
Deletes the sqs queue. Throws exception on unexpected errors.
```
const {deleteSQS} = require('@jasongilbertuk/sqs-helper)
try {
    const result = await deleteSQS(myQueueUrl);
} catch (err) {
    //Your error handling logic
    console.log(err);
}
```
