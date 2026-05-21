exports.handler = async (event) => {
    for (const record of event.Records) {
        const snsMessage = JSON.parse(record.body);
        const order = JSON.parse(snsMessage.Message);
        
        console.log("Worker executing order:", order.orderId);
        
        // Simulating processing logic
        if (order.item === 'worker_fail') {
            throw new Error("Worker Process Failed - Moving to DLQ");
        }
        
        console.log("Fulfillment Complete for:", order.orderId);
    }
};
