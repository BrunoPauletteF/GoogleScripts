/**
 * Open the spreadsheet by URL
 *
 */
const spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);

/**
 * The URL of the Google Spreadsheet where data will be pushed.
 * @type {string}
 */
const SPREADSHEET_URL = "target_spreadsheet_url"; // make a copy of the spreadsheet, don’t change any tabs in the sheet

/**
 * Get the sheet by name where data will be pushed.
 * @type {string}
 */
const sheet = spreadsheet.getSheetByName('your_target_sheet_name');

/**
 * Number of days to look back at for shopping performance data.
 * @type {number}
 */
const daysAgo = 60;

/**
 * The main function that orchestrates the script execution.
 */
function main() {
  // Get shopping products data
  const adsProducts = getShoppingProducts(daysAgo);

  // Push the data to the specified spreadsheet
  pushToSpreadsheet(adsProducts);
}

/**
 * Retrieves shopping products data based on the specified date range.
 * @param {number} daysAgo - Number of days to look back at for data retrieval.
 * @returns {Array<Array<string>>} - Array of arrays representing the shopping products data.
 */
function getShoppingProducts(daysAgo) {
  // Calculate date range
  const today = new Date();
  daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
  const dateFrom = Utilities.formatDate(daysAgo, AdWordsApp.currentAccount().getTimeZone(), 'yyyyMMdd');
  const dateTo = Utilities.formatDate(today, AdWordsApp.currentAccount().getTimeZone(), 'yyyyMMdd');

  // Construct AdWords query
  const query =
    "SELECT OfferId, Impressions, Clicks, Ctr, Cost, Conversions, ConversionValue, AverageCpc " +
    "FROM SHOPPING_PERFORMANCE_REPORT " +
    "DURING " + dateFrom + "," + dateTo;

  const products = [];
  let count = 0;

  // Execute AdWords query
  const report = AdWordsApp.report(query);
  const rows = report.rows();

  // Iterate through the rows and populate products array

  while (rows.hasNext()) {

    // Extract data from the row
    const row = rows.next();

    // Process and clean data
    const offer_id = row['OfferId'].toUpperCase();
    const impressions = row['Impressions'];
    const ctr = row['Ctr'];
    const clicks = row['Clicks'];
    const cost = row['Cost'];
    const conversions = row['Conversions'];
    const conversionValue = row['ConversionValue'];
    const averageCPC = row['AverageCpc'];
    let roas = (Number(conversionValue) / Number(cost));
    let acos = (Number(cost) / Number(conversionValue));

    if (isNaN(roas) || roas == 'Infinity') roas = 0;
    if (isNaN(acos) || acos == 'Infinity') acos = 0;

    // Add processed data to the products array
    products.push([offer_id, conversionValue, conversions, roas, cost, clicks, averageCPC, acos, impressions, ctr]);
    count += 1;
  }

  // Sort products array by conversions in descending order
  products.sort((a, b) => {
    return b[2] - a[2]; // Assuming conversions are at index 2
  });

  return products;
}


/**
 * Pushes the provided data to the specified Google Spreadsheet.
 * @param {Array<Array<string>>} data - Array of arrays representing the data to be pushed.
 */
function pushToSpreadsheet(data) {

  // Clear existing content from the sheet
  const lastRow = sheet.getMaxRows();
  sheet.getRange('A2:J' + lastRow).clearContent();

  // Determine the range to set the new values
  const start_row = 2;
  const endRow = start_row + data.length - 1;
  const range = sheet.getRange('A' + start_row + ':' + 'J' + endRow);

  // Set values to the sheet if there is data
  if (data.length > 0) range.setValues(data);
  return;
}
