# Google Ads Data Export

This script automates the process of exporting Google Ads data for specified businesses and appending it to a Google Sheet.


## Overview

This Google Apps Script fetches Google Ads data for specified businesses within a given date range and appends the data to a designated Google Sheet. The script uses the AdsApp and AdsManagerApp services provided by Google Ads API.

## Prerequisites

Before running the script, make sure you have the following:

- A Google Ads account with API access.
- Google Apps Script account.
- Access to the Google Sheet where the data will be appended.

## Installation

1. Open Google Apps Script Editor.
2. Copy and paste the code from [main.js](main.js) into the editor.
3. Save the script.

## Usage

1. Run the `main()` function to initiate the data export for specified businesses.
2. View the results in the designated Google Sheet.

## Configuration

Before running the script, ensure that you configure the following:

- Update the `BUSINESSES` array with the desired businesses, names, and account IDs.
- Provide the correct Google Sheet ID in the `spreadsheetId` variable.
- Adjust the `sheetName` variable to match the target sheet name in the Google Sheet.
