/**
 * Runs a Google Analytics 4 report, retrieves data, and populates a Google Spreadsheet.
 */
function runGA4Report() {
  // Google Analytics 4 property ID
  const propertyId = 'your_ga4_property_id';

  // Target SpreadSheet information
  const SPREADSHEET_URL = "target_spreadsheet_url";
  const SHEETNAME = 'your_target_sheet_name';

  // Number of days to look back for the report
  let daysAgo = 60;

  // Calculate date range
  let today = new Date();
  today.setDate(today.getDate() - 1);
  daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);

  // Convert dates to formatted strings
  const dateFrom = formatDate(daysAgo);
  const dateTo = formatDate(today);

  // Define metrics and dimensions for the report
  const metric = AnalyticsData.newMetric();
  metric.name = 'itemsViewed';

  const metric2 = AnalyticsData.newMetric();
  metric2.name = 'itemsAddedToCart';

  const metric3 = AnalyticsData.newMetric();
  metric3.name = 'itemsPurchased';

  const metric4 = AnalyticsData.newMetric();
  metric4.name = 'itemRevenue';

  const metric5 = AnalyticsData.newMetric();
  metric5.name = 'sessionConversionRate';

  const dimension = AnalyticsData.newDimension();
  dimension.name = 'itemId';

  const dateRange = AnalyticsData.newDateRange();
  dateRange.startDate = dateFrom;
  dateRange.endDate = dateTo;

  const request = AnalyticsData.newRunReportRequest();
  request.dimensions = [dimension];

  // Add metrics to the array
  request.metrics = [metric, metric2, metric3, metric4, metric5];
  request.dateRanges = dateRange;

  // Run the report
  const report = AnalyticsData.Properties.runReport(request, 'properties/' + propertyId);
  if (!report.rows) {
    Logger.log('No rows returned.');
    return;
  }

  const spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const sheet = spreadsheet.getSheetByName(SHEETNAME);

  // Extract dimension and metric headers from the report
  const dimensionHeaders = report.dimensionHeaders.map(
    (dimensionHeader) => {
      return dimensionHeader.name;
    });
  const metricHeaders = report.metricHeaders.map(
    (metricHeader) => {
      return metricHeader.name;
    });
  const headers = [...dimensionHeaders, ...metricHeaders];

  // Map the report data and format metric5 (sessionConversionRate) as a percentage
  const rows = report.rows.map((row) => {
    const dimensionValues = row.dimensionValues.map(
      (dimensionValue) => {
        return dimensionValue.value;
      });
    const metricValues = row.metricValues.map(
      (metricValue, index) => {
        // Format metric5 (sessionConversionRate) as a percentage with two decimal places
        // For this function, you need to use the index of the metric value in the metrics array
        // in this case the metric 5, so the position is 4 
        if (index === 4) {
          return formatPercentage(metricValue.value);
        }
        return metricValue.value;
      });
    return [...dimensionValues, ...metricValues];
  });

  // Populate the spreadsheet with the report data
  sheet.getRange(2, 1, report.rows.length, headers.length)
    .setValues(rows);

  Logger.log('Report spreadsheet updated: %s', spreadsheet.getUrl());
}

/**
 * Formats a date as 'yyyy-MM-dd'.
 * @param {Date} date - The input date.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a number as a percentage with two decimal places.
 * @param {number} number - The input number.
 * @returns {string} The formatted percentage string.
 */
function formatPercentage(number) {
  // For this function, you need to use the index of the metric value in the metrics array
  // in this case the metric 5, so the position is 4 
  return Utilities.formatString('%.2f%%', number * 100);
}
