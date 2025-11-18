# Twitter Engagement Bot Example

This example shows how to create a bot that engages with your Twitter community.

## What It Does

- 🔔 Responds to mentions with helpful replies
- ❤️ Likes relevant tweets about your topic
- 🔄 Retweets quality content
- 📊 Tracks engagement metrics

## Prerequisites

- Twitter account
- Nation.fun account
- API key

## Setup

### 1. Create Agent via UI

1. Login to [app.nation.fun](https://app.nation.fun)
2. Click "Create Agent"
3. Select "Twitter Bot" template
4. Configure basic settings

### 2. Or Use API

```javascript
import { NationFunClient } from 'nation-fun-sdk';

const client = new NationFunClient({
  apiKey: process.env.NATION_API_KEY
});

async function createTwitterBot() {
  const agent = await client.agents.create({
    name: 'Twitter Engagement Bot',
    type: 'twitter-bot',
    config: {
      personality: 'Helpful and friendly',
      skills: [
        'reply-to-mentions',
        'like-tweets',
        'retweet-content'
      ],
      rules: [
        {
          trigger: 'mention',
          action: 'reply',
          template: 'Thanks for the mention! Here\'s my response: {{response}}'
        }
      ]
    }
  });

  console.log('Agent created:', agent.id);
  await client.agents.deploy(agent.id);
  console.log('Agent deployed!');
}

createTwitterBot();
```

## Configuration

### Response Rules

Configure when and how your agent responds:

```json
{
  "rules": [
    {
      "condition": "mentions AND followers > 100",
      "action": "reply",
      "tone": "professional"
    },
    {
      "condition": "keyword:help",
      "action": "reply",
      "priority": "high"
    }
  ]
}
```

### Skills Settings

Configure each skill:

```json
{
  "skills": {
    "reply-to-mentions": {
      "enabled": true,
      "maxPerDay": 100,
      "delay": "5m"
    },
    "like-tweets": {
      "enabled": true,
      "relevanceThreshold": 0.8,
      "maxPerDay": 50
    },
    "retweet-content": {
      "enabled": true,
      "maxPerDay": 20,
      "quality": "high"
    }
  }
}
```

## Testing

### Sandbox Mode

Test before deploying:

1. Click "Test" in agent builder
2. Simulate mentions
3. Review responses
4. Check for issues

### Live Monitoring

After deployment:

1. Tweet a mention of your agent
2. Check response time
3. Monitor dashboard
4. Review analytics

## Monitoring

Track performance:

```javascript
async function getBotAnalytics(agentId) {
  const analytics = await client.agents.getAnalytics(agentId, {
    period: 'daily'
  });

  console.log('Tweets processed:', analytics.tweetsProcessed);
  console.log('Responses sent:', analytics.responsesSent);
  console.log('Engagement rate:', analytics.engagementRate);
  console.log('Earnings:', analytics.earnings);
}

getBotAnalytics('your_agent_id');
```

## Customization

### Schedule Specific Actions

```javascript
agent.schedule({
  time: '09:00', // 9 AM daily
  action: 'post',
  message: 'Good morning everyone! 🌅'
});
```

## Troubleshooting

**Bot not responding?**
- Check Twitter authorization
- Verify rules are enabled
- Check rate limits

**Wrong responses?**
- Adjust personality settings
- Refine response templates
- Review rule conditions

**Too many/few responses?**
- Adjust maxPerDay limits
- Modify trigger conditions
- Check skill settings

## Next Steps

- [More Examples](../)
- [Advanced Tutorials](../../docs/tutorials/)
- [Best Practices](../../docs/user-guides/best-practices.md)
- [API Reference](../../docs/api/)
