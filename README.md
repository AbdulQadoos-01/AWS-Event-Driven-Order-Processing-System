## 🏗️ Architecture
![AWS Architecture](https://raw.githubusercontent.com/AbdulQadoos-01/AWS-Event-Driven-Order-Processing-System/main/architecture.png)
*Flow: Client -> API Gateway -> Lambda (Ingestor) -> SNS -> SQS -> Lambda (Worker) -> CloudWatch/DLQ*


## 🛠️ Step-by-Step Implementation

### Phase 1: Decoupling with SNS & SQS
Instead of calling the Worker Lambda directly, we used a **Fan-out pattern**. 
- **SNS Topic** acts as the message dispatcher.
- **SQS Queue** acts as the buffer, ensuring no orders are lost if the Worker is throttled.

### Phase 2: Resilience & Error Handling (DLQ)
- Configured a **Dead Letter Queue (order-dlq)** for the main queue.
- **Redrive Policy:** `maxReceiveCount` is set to 2. If a message fails twice, it’s moved to DLQ for manual inspection.
- This prevents the "Poison Pill" scenario where a bad message blocks the entire queue.

### Phase 3: Observability & Tracing
- **AWS X-Ray:** Enabled Active Tracing to visualize the end-to-end latency.
- **CloudWatch Signals:** Integrated Service Map to track 5xx faults in real-time.





## 🚀 How to Run the Lab

1. **Deploy Frontend:** Open `index.html` in your browser (Live Server recommended).
2. **Success Test:** Select `Standard Order` and click "Process". Check CloudWatch Logs for the `ORD-XXXX` success message.
3. **DLQ Test:** Select `Simulate Worker Failure`. 
   - Fire 3 orders.
   - Go to SQS Console -> `order-dlq` -> Poll for messages.
   - You will see the failed orders preserved there.
4. **Trace Analysis:** Open CloudWatch **Service Map** to see the red nodes indicating the simulated faults.
