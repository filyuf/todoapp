const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()

const TABLE_NAME = 'todoapp'

exports.handler = async (event) => {
  const method = event.httpMethod
  const path = event.path
  const id = event.pathParameters ? event.pathParameters.id : null

  try {
    if (method === 'GET' && path === '/todos') {
      const data = await dynamo.scan({ TableName: TABLE_NAME }).promise()
      return response(200, data.Items)
    }

    if (method === 'POST' && path === '/todos') {
      const item = JSON.parse(event.body)
      await dynamo.put({ TableName: TABLE_NAME, Item: item }).promise()
      return response(200, { message: 'Task added' })
    }

    if (method === 'PUT' && id) {
      const updatedData = JSON.parse(event.body)
      const params = {
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #task = :task',
        ExpressionAttributeNames: {
          '#task': 'task',
        },
        ExpressionAttributeValues: {
          ':task': updatedData.task,
        },
        ReturnValues: 'ALL_NEW',
      }
      const result = await dynamo.update(params).promise()
      return response(200, result.Attributes)
    }

    if (method === 'DELETE' && id) {
      await dynamo.delete({ TableName: TABLE_NAME, Key: { id } }).promise()
      return response(200, { message: 'Task deleted' })
    }

    return response(400, { message: 'Unsupported method or path' })
  } catch (err) {
    console.error(err)
    return response(500, { error: 'Something went wrong' })
  }
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*', // biar bisa diakses dari frontend
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
