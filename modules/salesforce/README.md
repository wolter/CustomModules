Integrates Cognigy.AI with Salesforce (https://www.salesforce.com)

This module is based on jsforce (https://jsforce.github.io/)

### Secret
This modules needs a CognigySecret to be defined and passed to the Nodes. The secret must have the following keys:

- username

- password

- token

  

## Node: create_entity

All **Salesforce API Fields** are listed in the following PDF File: 
[Salesforce API Fields](https://resources.docs.salesforce.com/206/latest/en-us/sfdc/pdf/salesforce_field_names_reference.pdf)

### Option: Event

Creates an **event** in the Salesforce calendar. The JSON in *Info JSON* shows an example.

#### Info JSON

```json
{
  "Location": "Dusseldorf",
  "Description": "Eating Stones",
  "Subject": "Event X",
  "ActivityDate": "2019-01-25",
  "DurationInMinutes": "60",
  "ActivityDateTime": "2019-01-25T13:00:00"
}
```

### Option: Contact

Creates a new **contact** in the **Contacts** Salesforce table. The JSON in *Info JSON* shows an example.

#### Info JSON

```json 
{
  "FirstName": "Max",
  "LastName": "Mustermann",
  "Phone": "0221 12345",
  "MobilePhone": "012345678912",
  "Email": "max.mustermann@mail.de",
  "Birthdate": "1994-10-14",
  "MailingCity": "Dusseldorf",
  "MailingStreet": "Speditionsstraße 1",
  "MailingState": "NRW",
  "MailingPostalCode": "40221",
  "MailingCountry": "Germany",
  "Description": "New Contact",
  "Department": "IT"
}
```

### Option: Account

Creates a new **account** in the **Accounts** Salesforce table. The JSON in *Info JSON* shows an example.

#### Info JSON

```json
{
  "Name": "Company X",
  "Phone": "0221 12345",
  "BillingCity": "Dusseldorf",
  "BillingStreet": "Speditionsstraße 1",
  "BillingState": "NRW",
  "BillingPostalCode": "40221",
  "BillingCountry": "Germany",
  "Description": "New Contact",
  "Industry": "IT",
  "Website": "www.cognigy.com"
}
```

## Node: retrieve

Retrieves the entity by searching for the given ID.

```json
{
  "sf_retrieve": {
    "id": "0051t000002geBqAAI",
    "organizationId": "00D1t000000xCYwEAM",
    "url": "https://login.salesforce.com/id/00D1t000000xCYwEAM/0051t000002geBqAAI"
  }
}

```