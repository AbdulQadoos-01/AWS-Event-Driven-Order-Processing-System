const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');

const snsClient = new SNSClient({ region: process.env.AWS_REGION });
const cwClient = new CloudWatchClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    // API Gateway se jab request aati hai wo event.body mein hoti hai
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { orderId, amount, item } = body;

    console.log("Processing Order:", orderId);

    try {
        if (item === 'fail') throw new Error("Item Restricted");

        // SNS ko message bhejna
        await snsClient.send(new PublishCommand({
            Message: JSON.stringify(body),
            TopicArn: process.env.SNS_TOPIC_ARN
        }));

        // Metrics CloudWatch bhejna
        await cwClient.send(new PutMetricDataCommand({
            Namespace: 'Microservices/OrderEngine',
            MetricData: [{ MetricName: 'SuccessfulOrders', Value: 1, Unit: 'Count' }]
        }));

        return {
            statusCode: 202,
            headers: { "Access-Control-Allow-Origin": "*" }, // CORS ke liye zaroori hai
            body: JSON.stringify({ success: true, orderId })
        };
    } catch (err) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ success: false, reason: err.message })
        };
    }
};
