# status-check
Status Check Microservice
-------------------------

The `Status Check Microservice` will monitor our server applications and will send alerts when a downtime happens. The microservice will need to accept a json configuration file `config.json` with a format similar to the following example:

```json
{
  "checks": [
    {
      "id": "EG",
      "type": "http",
      "port": 80,
      "path": "/ping",
      "address": "52.76.216.3",
      "responseTimeout": 5,
      "checkInterval": 30,
      "unhealthyThreshold": 2,
      "healthyThreshold": 10
    },
    {
      "id": "EG Server 1",
      "type": "ping",
      "address": "52.76.216.3",
      "responseTimeout": 5,
      "checkInterval": 30,
      "unhealthyThreshold": 2,
      "healthyThreshold": 10
    }
  ],
  "alerts": [
    {
      "checks": "EG",
      "type": "email",
      "address": "roger.madjos@gmail.com"
    },
    {
      "checks": "EG.*",
      "type": "email",
      "address": "usman@proto-garage.com",
      "statuses": [
        "unhealthy"
      ]
    }
  ]
}
```

Using various protocols, the microservice will send requests to the target server application at regular intervals. Alerts will be sent only when there are changes in the status.

## Options
| Option | Required | Default | Type | Choices | Description |
| --- | --- | --- | --- | --- | --- |
| `checks` | `true` | | `array` | | Collection of status check instances |
| `checks[].id` | `true` | | `string` | | String that uniquely identifies the status check instance |
| `checks[].type` | `true` | | `string` | `http` `ping`| |
| `checks[].port` | `false` | `80` | `integer` | | Only accepted if type is `http` |
| `checks[].path` | `false` | `/ping` | `string` | | Only accepted if type is `http` |
| `checks[].address` | `true` | | `string` | | |
| `checks[].responseTimeout` | `false` | `10` | `integer` | | Request response timeout |
| `checks[].checkInterval` | `false` | `60` | `integer` | | Interval between requests |
| `checks[].unhealthyThreshold` | `false` | `2` | `integer` | | Number of failed requests before status changes to `unhealthy` |
| `checks[].unhealthyThreshold` | `false` | `2` | `integer` | | Number of failed checks before status changes to `unhealthy` |
| `checks[].healthyThreshold` | `false` | `5` | `integer` | | Number of successful checks before status changes to `healthy` |
| `alerts` | `false` | | `array` | | Collection of alerts to be sent when status changes |
| `alerts[].checks` | `false` | `.+` | `string` | | Regular Expression used to match `checks[].id`. All check instances with matching ids will be associated with the alert |
| `alerts[].type` | `true` | | `string` | `email` | Alert type. More choices will be added in the future |
| `alerts[].address` | `true` | | `string` | | |
| `alerts[].statuses` | `false` | ["unhealthy","healthy"] | `array` | `healthy`, `unhealthy` | Send alert only when status changes into the ones specified |


