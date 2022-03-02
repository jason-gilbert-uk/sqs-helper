const AWS = require('aws-sdk')
AWS.config.update({region:'eu-west-1'});
const SQS = new AWS.SQS({apiVersion:'2012-11-05'});

//----------------------------------------------------------------------------
// function: createSQS(queueName)
// Creates an SQS queue. Returns the URL of the queue.
// Throws exception on unexpected errors.
//----------------------------------------------------------------------------
async function createSQS(queueName) {
    var params = {
        QueueName: queueName, /* required */
        Attributes: {}
      };
      try {
          var result = await SQS.createQueue(params).promise();
          return result.QueueUrl;
      } catch (err) {
        console.log("error in sqs-helper.createSQS. ",err); // an error occurred
        throw err;
      }
}

//----------------------------------------------------------------------------
// function: checkSQSExists(queueName)
// Returns url of queue if the named queue exists, null otherwise.
// Throws exception on unexpected errors.
//----------------------------------------------------------------------------
async function checkSQSExists(queueName) {
    var result = null;

    var params = {
        QueueName: queueName
    }

    try {
        var returnValue= await SQS.getQueueUrl(params).promise();
        return returnValue.QueueUrl;

    } catch (err) {
        if (err.code === 'AWS.SimpleQueueService.NonExistentQueue') {
            result = null
            return result;
        } else {
            console.log('error in sqs-helper.checkSQSExists : ',err);
            throw err;
        }
    }

}

//----------------------------------------------------------------------------
// function: createSQSIfDoesntExist(queueName)
// creates a named sqs queue if it doesn't already exist.
// returns the name of the queues url.
//----------------------------------------------------------------------------
async function createSQSIfDoesntExist(queueName) {
    var result = await checkSQSExists(queueName);
    if ( result ) {
        return result;
    } else {
        return await createSQS(queueName);
    }
}

//----------------------------------------------------------------------------
// function: writeObjectToSQS(queueURL,object)
// writes a JSON object to the SQS queue
// returns the id of the message written. Throws error in any unexpected
// situation.
//----------------------------------------------------------------------------
async function writeObjectToSQS(queueURL,object) {
    var params = {
       DelaySeconds: 10,
       MessageAttributes: {},
       MessageBody: JSON.stringify(object),
       QueueUrl: queueURL
     };
     
     try {
         var result = await SQS.sendMessage(params).promise();
         return result.MessageId;
    
     } catch (err) {
         console.log('Error encountered in sqs-helper.writeObjectToSQS : ',err);
         throw err;
     }
}

//----------------------------------------------------------------------------
// function: readObjectFromSQS(queueURL)
// Reads JSON objects from the SQS queue
// returns stucture including all the messages read.
//----------------------------------------------------------------------------
async function readObjectFromSQS(queueUrl) {
    var params = {
        AttributeNames: [
           "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [
           "All"
        ],
        QueueUrl: queueUrl,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 5
       };
       
       try {
           var result = await SQS.receiveMessage(params).promise();
           if (result.Messages) {
               result.Messages.map(async (msg)=>{
                    var deleteParams = {
                        QueueUrl: queueUrl,
                        ReceiptHandle: msg.ReceiptHandle
                    };
                    var result2 = await SQS.deleteMessage(deleteParams).promise();
               })
               return result;
            }
       } catch (err) {
            console.log("Error encountered in sqs-helper.readObjectFromSQS : ", err); 
            throw err; 
       }
}

//----------------------------------------------------------------------------
// function: deleteSQS(queueURL)
// deletes the sqs queue
// throws exception on unexpected errors.
//----------------------------------------------------------------------------
async function deleteSQS(queueUrl) {

    var params = {
            QueueUrl: queueUrl
        };
    try {
        var result = await SQS.deleteQueue(params).promise();
        return result;
    } catch (err) {
        console.log('error encountered in sqs-helper.deleteSQS : ',err);
        throw err;
    }
}


exports.writeObjectToSQS = writeObjectToSQS;
exports.readObjectFromSQS = readObjectFromSQS;
exports.createSQS = createSQS;
exports.createSQSIfDoesntExist = createSQSIfDoesntExist;
exports.deleteSQS = deleteSQS;