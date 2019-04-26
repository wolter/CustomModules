
## Node: GetLocationsByFilter

Return your locations, given a chosen filter, such as the `name` or `address`. Find out more about the filter [here](https://developer.yext.com/docs/api-reference/#operation/searchLocations). 

The result will be a list of all found locations: 

```json
    "filteredLocations": {
        "meta": {
        "uuid": "175574c6-3786-4381-9ceb-18d6aeca809d",
        "errors": []
        },
        "response": {
        "count": 1,
        "locations": [
            {
            "id": "f1412123-ec76-4da5-957e-9dd55e457a5a",
            "uid": "EvlrGJ",
```

## Node: CreateLocation

With this node you can create a new location entity in your Yext instance, where the response will be the following:

```json
  "createdLocation": {
    "meta": {
      "uuid": "446fcd75-3614-40f7-a7c5-ef1a3c0e1736",
      "errors": []
    },
    "response": {
      "id": "f1412123-ec76-4da5-957e-9dd55e457a5a"
    }
  }
```
