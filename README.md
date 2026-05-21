# AWS Event-Driven Order Processing System

This project demonstrates a production-grade **Event-Driven Architecture (EDA)** built on AWS. It uses a decoupled approach to handle high-traffic order ingestion using SNS and SQS for maximum reliability.

## 🚀 Key Features
- **Serverless Ingestion:** Handled by AWS Lambda & API Gateway.
- **Asynchronous Messaging:** Decoupled worker flow using SNS (Pub/Sub) and SQS (Queueing).
- **Observability:** Custom CloudWatch metrics for success/failure tracking.
- **Error Handling:** Simulated DLQ (Dead Letter Queue) support at the worker level.

## 🛠️ Tech Stack
- **Languages:** Node.js v18+, HTML5/CSS3
- **AWS Services:** Lambda, SNS, SQS, API Gateway, CloudWatch
- **SDK:** AWS SDK v3 for JavaScript

## 📦 Components

### 1. Order Ingestion Lambda
- Receives payload from API Gateway.
- Publishes valid orders to an SNS Topic.
- Pushes custom metrics to CloudWatch (`SuccessfulOrders`).

### 2. Order Worker Lambda
- Triggered by SQS Queue.
- Parses SNS-wrapped SQS records.
- Processes fulfillment or simulates failure for DLQ testing.

### 3. Testing Console
A web dashboard to simulate:
- **Standard Flow:** Happy path processing.
- **Validation Failure:** Fails at ingestion level.
- **Worker Failure:** Triggers retry/DLQ logic.

## 🔧 Setup & Configuration
1. **SNS:** Create a Standard Topic and copy the ARN to Ingestor environment variables (`SNS_TOPIC_ARN`).
2. **SQS:** Create a Standard Queue and subscribe it to the SNS Topic. **Enable Raw Message Delivery.**
3. **IAM:** Ensure `OrderWorker` has `AWSLambdaSQSQueueExecutionRole` and `OrderIngestor` has `SNS:Publish` & `CloudWatch:PutMetricData` permissions.
