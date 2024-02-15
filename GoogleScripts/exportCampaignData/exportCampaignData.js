// Define your start and end dates
const startDate = getYesterdayDate() ;
const endDate = getYesterdayDate() ;

const BUSINESSES = [
  { NAME: 'Allie', ACCOUNT_ID: '818-371-7266' },
  { NAME: 'Daniel Cassin', ACCOUNT_ID: '508-790-2677' },
  { NAME: 'Daniel Cassin PY', ACCOUNT_ID: '697-754-2391' },
  { NAME: 'Piece Of Cake', ACCOUNT_ID: '786-139-5109' }
];

const mccAccount = AdsApp.currentAccount();

// Open the Google Sheet by ID
const spreadsheetId = '1I02paq3I0XzkgtlsUl0nv4bQJHCKDBEVw_IyYQ7KLxo';
const sheetName = 'GoogleAds';
const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
const sheet = spreadsheet.getSheetByName(sheetName);

/**
 * Main function to iterate through BUSINESSES and send data to the Google Sheet.
 */
function main() {
  BUSINESSES.forEach(({ NAME, ACCOUNT_ID }) => sendDataToSheet(NAME, ACCOUNT_ID));
}

/**
 * Sends data to the specified Google Sheet.
 * @param {string} name - Business name.
 * @param {string} googleAdsId - Google Ads account ID.
 */
function sendDataToSheet(name, googleAdsId) {
  // Select the child account using AdsManagerApp
  const childAccounts = AdsManagerApp.accounts().withIds([googleAdsId]).get();
  const childAccount = childAccounts.next();
  AdsManagerApp.select(childAccount);

  // Fetch Google Ads data with the dynamic date range
  const report = AdsApp.report(
    "SELECT" +
    " metrics.cost_micros,  segments.date, metrics.conversions_value FROM customer  " +
    "WHERE segments.date BETWEEN " +
    startDate + " AND " + endDate
  );

  // Fetch existing data in the Google Sheet
  const sheetData = sheet.getDataRange().getValues();

  // Find the first empty row in column A of the Google Sheet
  let emptyRow = findEmptyRow(sheetData);

  // Get the data from the Google Ads report
  const rows = report.rows();

  // Iterate through the Google Ads data
  while (rows.hasNext()) {
    const row = rows.next();
    const date = row['segments.date'];
    const spend = row['metrics.cost_micros'] / 1000000;

    // Write the new data to the first empty row in the Google Sheet
    sheet.getRange(emptyRow, 1).setValue(name)
    sheet.getRange(emptyRow, 2).setValue(date);
    sheet.getRange(emptyRow, 3).setValue(spend);

    // Move to the next empty row
    emptyRow++;
  }

  // Select the MCC account back
  AdsManagerApp.select(mccAccount);
}

/**
 * Finds the first empty row in the given data array.
 * @param {Array} data - 2D array representing data in the Google Sheet.
 * @returns {number} Row index of the first empty row (1-based).
 */
function findEmptyRow(data) {
  // Search for the first empty row in column A of the data array
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === "") {
      return i + 1; // Return the row index (1-based)
    }
  }
  return data.length + 1; // If no empty row is found, return the next row
}

/**
 * Gets yesterday's date in the format YYYY-MM-DD.
 * @returns {string} Formatted date string.
 */
function getYesterdayDate() {
  const today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = (yesterday.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const day = yesterday.getDate().toString().padStart(2, '0');

  return year + month + day;
}