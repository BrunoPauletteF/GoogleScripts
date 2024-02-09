# Google Analytics 4 Report Automation

Automate the retrieval and analysis of Google Analytics 4 data and populate a Google Spreadsheet with the results. This script utilizes Google Apps Script and the Google Analytics Data API.

## Prerequisites

Before running the script, ensure you have the following:

- A Google Analytics 4 property ID
- Access to Google Apps Script
- Necessary permissions for accessing Google Analytics data and managing Google Sheets

## Setup

1. Open the [Google Apps Script Editor](https://script.google.com/).
2. Copy and paste the contents of [`runGA4Report.gs`](runGA$Report.gs) into the script editor.
3. Set your Google Analytics 4 property ID and target spreadsheet ID in the script.
4. Save the script.

## Usage

1. Run the `runGA4Report` function in the script editor.
2. The script calculates the date range, fetches the specified metrics and dimensions, and populates the target Google Spreadsheet.

### Resources:

- [Google Analytics - Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1/rest)
- [Google Analytics - Data API Documentation - Dimensions & Metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [Google App Script - Analytics Data API](https://developers.google.com/apps-script/advanced/analyticsdata)

## Configuration

Adjust the `propertyId`, `daysAgo`, and spreadsheet related variables in the script according to your requirements.

```javascript
const propertyId = 'YOUR_GA4_PROPERTY_ID';
let daysAgo = 60;
const spreadsheetId = 'YOUR_SPREADSHEET_ID';
const sheetName = 'YOUR_SHEET_NAME';

