# Yext Custom Module

This Custom Module integrates [Yext.com](www.yext.com) with Cognigy.

**Secrets**

- api_key
  - You need the **Knowledge API Key** from your [Yext Developer](https://developer.yext.com/) Account. There you have to create a new application and add this API to get the key.



## Node: GetEntity

With this node you can get all entries of a chosen entity, such as `Locations` or `Events`, where the output will be a list of results.



## Node: GetEntityById

If you don't want to handle all results of a chosen entity, you can filter them by Id, to get only one output. Therefore you have to find out the Id. The Best way is to execute the **GetEntity** node before.



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
