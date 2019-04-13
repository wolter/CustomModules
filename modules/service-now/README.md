# Service Now Custom Module

Integrates the Service Now Software with Cognigy.AI.

Table Node Source: https://developer.servicenow.com/app.do#!/rest_api_doc?v=madrid&id=c_TableAPI



## Node: GETFromTable

Returns the data from a requested [Table](https://docs.servicenow.com/bundle/jakarta-servicenow-platform/page/administer/reference-pages/reference/r_TablesAndClasses.html?title=Tables_and_Classes) and stores it into the Cognigy Context. You have to specify the columns (Fields) you want to show in the results.



## Node: PostToTable

This Node will post the given **data** to the chosen **table**. The data could look like this: 

```json
{
  "short_description": "I lost my keys"
}
```

The result will be a json object including the new table entry:

```json
"posted": {
    "first_reported_by_task": "",
    "parent": "",
    "made_sla": "true",
    "watch_list": "",
    "fix_communicated_by": "",
    "upon_reject": "cancel",
    "sys_updated_on": "2019-04-12 12:54:09",
    "cause_notes": "",
    "approval_history": "",
    "number": "PRB0040026",
    "resolved_by": "",
    "sys_updated_by": "blub",
    "opened_by": {
      "link": "https://23456789.service-now.com/api/now/table/sys_user/123456789098765432",
      "value": "123456789098765432"
    },
```



## Node: DeleteFromTable

This Node deletes the entry with the given **sysId** and returns a success message if nothing gone wrong: 

```json
{
  "deleted": "succefully deleted entry with id da4fe285dbbc330045da2bfa4b9619d6"
}
```



## PatchRecordInTable

This node updates an entry in your chosen Service Now table. You have to define the **sysId** and the **data** to update. If you don't know the sysId of your entry, just execute the **GetFromTable** Node of this Custom Module and take a look into the **CognigyContext**. 

To define the data to update, you have to use a JSON format such as: 

```json
{
  "short_description": "I updated the short description of this entry"
}
```

As response you will get a JSON object, which looks like: 

```json
"patched": {
    "first_reported_by_task": "",
    "parent": "",
    "made_sla": "true",
    "watch_list": "",
    "fix_communicated_by": "",
    "upon_reject": "cancel",
    "sys_updated_on": "2019-04-13 08:16:38",
    "cause_notes": "",
    "approval_history": "",
    "number": "PRB0040027",
    "resolved_by": "",
    "sys_updated_by": "blub",
    "opened_by": {
      "link": "https://123456.service-now.com/api/now/table/sys_user/6816f79cc0a8016401c5a33be04be441",
      "value": "6816f79cc0a8016401c5a33be04be441"
    },
```

If you now open your updated table in your **Service Now Instance** you will see the difference. 