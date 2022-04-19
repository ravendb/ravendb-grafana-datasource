# RavenDB Data Source Plugin for Grafana
[![Build](https://github.com/ravendb/ravendb-grafana-datasource/workflows/CI/badge.svg)](https://github.com/ravendb/ravendb-grafana-datasource/actions?query=workflow%3A%22CI%22)
[![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22ravendb-grafana-datasource%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://github.com/ravendb/ravendb-grafana-datasource)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22ravendb-grafana-datasource%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://github.com/ravendb/ravendb-grafana-datasource)
[![License](https://img.shields.io/github/license/ravendb/ravendb-grafana-datasource)](LICENSE)

**This RavenDB data source plugin allows you to query and visualize your RavenDB data in Grafana**.

For monitoring metrics of a RavenDB instance (not its data) use the RavenDB Telegraf plugin.  
Please refer to: [Monitoring RavenDB Metrics](https://ravendb.net/docs/article-page/latest/http/server/administration/monitoring).

**In this readme**:
* [Sample dashboard showing data from RavenDB](#sample-dashboard-showing-data-from-ravendb)
* [Install the RavenDB data source plugin](#install-the-ravendb-data-source-plugin)
* [Set RavenDB as your data source - Unsecure server](#set-ravendb-as-your-data-source---unsecure-server)
* [Set RavenDB as your data source - Secure server](#set-ravendb-as-your-data-source---secure-server)
* [Querying Features](#querying-features)

# Sample dashboard showing data from RavenDB

![Screen](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/dashboard_screen.png)

# Install the RavenDB data source plugin

1. Download latest Grafana from [here](https://grafana.com/grafana/download).
2. Download the latest RavenDB data source plugin zip file (**ravendb-datasource-1.0.0.zip**) from [here](https://github.com/ravendb/ravendb-grafana-datasource/releases).
3. Extract the plugin zip file into the following folder in your Grafana working directory:  
   `$GRAFANA_WORKING_DIR/data/plugins`
4. Open your Grafana configuration file, located under the 'conf' folder and apply the following:  
   Edit the `[Plugins]` section - add `ravendb-datasource` as an unsigned plugin.  
   ![addUnsignedPlugin](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/addUnsignedPlugin.png)
5. Run Grafana - the RavenDB plugin will now show in the installed plugins list.  
   ![RavenDBPlugin](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/RavenDBPlugin.png)

# Set RavenDB as your data source - Unsecure server

![unsecure settings](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/unsecureSettings.png)

1. Enter a name for this data source settings.
2. Enter the database name from which to retrieve data.
3. Enter your unsecure RavenDB server URL.
4. Click Save & test to test and save this configuration.

# Set RavenDB as your data source - Secure server

![secure settings](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/secureSettings.png)

1. Enter a name for this data source settings.
2. Enter the database name from which to retrieve data.
3. Enter your secure RavenDB server URL.
4. Toggle on TLS Client Auth.
5. Enter the server name.  
   The above example refers to a free server instance in RavenDB Cloud.  
   Replace it with your own hostname.
6. Enter the certificate Public Key (starts with _-----BEGIN CERTIFICATE-----_)  
   Can be taken from the *.pem file (see below).  
7. Enter the certificate Private Key (starts with _-----BEGIN RSA PRIVATE KEY-----_)  
   Can be taken from the *.key file (see below).
8. Click Save & test to test and save this configuration.

### How to get the certificate parts

Download the certificate from your product instance on [RavenDB Cloud](https://cloud.ravendb.net).  

![download certificate](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/downloadCert.png)

Open the downloaded zip file.  
The certificate parts needed for the Grafana settings are found under the _PEM_ folder.

![pem folder](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/pemFolder.png)

* *.client.certificate.crt => the certificate itself
* *.client.certificate.key => contains the private key
* *.client.certificate.pem => contains both private & public key

# Querying Features
* **RQL**  
  From Grafana, query your RavenDB collections/indexes with [RQL - Raven Query Language](https://ravendb.net/docs/article-page/latest/csharp/indexes/querying/what-is-rql)


* **Visualizations**  
  The queried data can be presented in any of Grafana's tables & charts visualizations,   
  including Table data, Time series data & Spatial data.


* **Grafana Variables**  
  Querying with Grafana variables and templates is supported by the RavenDB plugin.


* **Examples**  
  All query examples bellow are based on RavenDB's [sample data](https://ravendb.net/docs/article-page/latest/csharp/studio/database/tasks/create-sample-data).  
  [A simple collecton query](#a-simple-collection-query)  
  [Generate values for a Grafana variable](#generate-values-for-a-grafana-variable)  
  [Reference Grafana variable in a query](#reference-grafana-variable-in-a-query)  
  [Project query results as Time Series data](#project-query-results-as-time-series-data)  
  [Project query results as Spatial data](#project-query-results-as-spatial-data)  
  [Using Time Macro variables in a time series query](#using-time-macro-variables-in-a-time-series-query)  
  [Querying with Multi-Value variables](#querying-with-multi-value-variables)

### A simple collection query
Query for data from the 'Employees' collection:
```
from 'Employees' select LastName, FirstName, Title, Address
```

### Generate values for a Grafana variable
A RavenDB query can be used to populate a Grafana variable of Type: Query.  
Only the first column from the results is used.  
Therefore, use a query which returns a single column, e.g. Name here below.  
The Name results will populate the Grafana variable values.
```
from 'Products' select distinct Name 
```

![DefineQueryVariable](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/defineQueryVariable.png)

### Reference Grafana variable in a query
Once the Grafana variable is defined, it can be used within the RQL query.  
The following RQL queries a RavenDB index, results are filtered using the `Product` variable.
```
from index 'Product/Rating'
where Name = "${Product}"
select Rating
```

### Project query results as Time Series data
Alias a Date field (e.g. OrderedAt) with `Time`.  
Grafana will autodetect this as a time column and the results can be viewed in the time series chart.
```
from 'Orders'
select Freight, OrderedAt as Time
```

### Project query results as Spatial data
Alias a GeoData field (e.g. Address.Location.Latitude) with `Latitude`/`Longitude`.  
The results can then be viewed in the Geomap Panel.
```
from 'Suppliers'
where Address.Location != null
select 
   Name,
   Address.Location.Latitude as Latitude,
   Address.Location.Longitude as Longitude
```

![Geospatial query result](https://github.com/ravendb/ravendb-grafana-datasource/raw/main/src/img/geospatial.png)

### Using Time Macro variables in a time series query
| Grafana Variable | Description                                                                          | Example                                                   |
|------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `$timeFilter`    | Will be replaced by the date range selected in Grafana's time selector               | "2021-11-17T16:56:28.158Z" and "2022-02-17T09:45:12.697Z" |
| `$__interval`    | Will be replaced by the interval suggested by Grafana (Time range / max data points) | 5m, 15s, etc.                                             |
```
from 'Products'
where id() == 'products/77-A'
select timeseries(
   from 'INC:Views'
   between $timeFilter
   group by $__interval
   select sum()
)
```

### Querying with Multi-Value variables
In order to properly use a multi-value variable in your query, format it using `doublequote`.  
The following RQL:
```
from 'Employees'
where FirstName in (${paramName:doublequote})
```
Will be translated to:
```
from 'Employees'
where FirstName in ("Peter", "Anna", "John")
```

# Links
- [RavenDB](https://ravendb.net)
- [RavenDB Demo](https://demo.ravendb.net/)
