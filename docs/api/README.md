# 📡 Nation.fun API

Use Nation.fun API to programmatically create, manage, and monitor your agents.

## Base URL
```
https://api.nation.fun/v1
```

## Authentication

All API requests require authentication via API key:

```bash
curl -X GET https://api.nation.fun/v1/agents \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json"
```

**Get Your API Key:**
1. Login to [app.nation.fun](https://app.nation.fun)
2. Go to Settings → API Keys
3. Click "Generate New Key"
4. Copy and save securely

## Rate Limits

- **Free Tier:** 100 requests/hour
- **Pro:** 1,000 requests/hour
- **Enterprise:** Custom limits

## API Endpoints

### Agents
- `GET /agents` - List your agents
- `POST /agents` - Create new agent
- `GET /agents/{id}` - Get agent details
- `PUT /agents/{id}` - Update agent
- `DELETE /agents/{id}` - Delete agent
- `POST /agents/{id}/deploy` - Deploy agent
- `POST /agents/{id}/pause` - Pause agent

### Analytics
- `GET /agents/{id}/analytics` - Agent metrics
- `GET /agents/{id}/logs` - Activity logs

### Skills
- `GET /skills` - List available skills
- `GET /skills/{id}` - Skill details

## Common Tasks

### Create Agent
```bash
curl -X POST https://api.nation.fun/v1/agents \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
"name": "My Agent",
"type": "twitter-bot",
"config": {
"personality": "Friendly",
"skills": ["reply-to-mentions", "engage-content"]
}
}'
```

### Get Agent Status
```bash
curl -X GET https://api.nation.fun/v1/agents/agent_123 \
-H "Authorization: Bearer YOUR_API_KEY"
```

### Deploy Agent
```bash
curl -X POST https://api.nation.fun/v1/agents/agent_123/deploy \
-H "Authorization: Bearer YOUR_API_KEY"
```

## Error Handling

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Verify API key |
| 404 | Not Found | Check resource ID |
| 429 | Rate Limited | Wait before retrying |
| 500 | Server Error | Contact support |

## Webhooks

Get real-time updates about your agents:

```bash
POST https://your-domain.com/webhook
{
"event": "agent.executed",
"timestamp": "2025-11-17T20:00:00Z",
"agent_id": "agent_123",
"data": {...}
}
```

Configure webhooks in Settings → Webhooks.

## SDKs

- **JavaScript:** `npm install nation-fun-sdk`
- **Python:** `pip install nation-fun`

## More Resources

- [Full API Reference](./agents-api.md)
- [Examples](../tutorials/)
- [Webhooks Guide](./webhooks.md)
