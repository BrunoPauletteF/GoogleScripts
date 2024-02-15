function getCampaignData(accountID) {
  const versionAPI = 'v19.0';
  const fields = 'spend%2Cimpressions%2Cactions%2Caction_values%2Cclicks%2Ccampaign_name%2Cpurchase_roas%2Cobjective';
  const level = 'campaign';
  const filter = '%5B%7Bfield%3A%22action_type%22%2C%22operator%22%3A%22CONTAIN%22%2C%22value%22%3A%22omni_purchase%22%7D%5D';
  const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'

  // Construct API URL for the current date
  var url = `https://graph.facebook.com/${versionAPI}/act_${accountID}/insights?fields=${fields}&time_range=%7B'since'%3A'${dynamicDate}'%2C'until'%3A'${dynamicDate}'%7D&limit=100&level=${level}&filtering=${filter}&access_token=${TOKEN}`

  const options = {
    method: 'get',
    contentType: 'application/json',
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log(url);

  if (response.getResponseCode() === 200) {
    const data = JSON.parse(response.getContentText());

    if (data.data && data.data.length > 0) {
      setCampaignData(data.data);
      Logger.log(`Data saved successfully for ${formattedDate}`);
    } else {
      Logger.log(`No data found in the response for ${formattedDate}`);
    }
  } else {
    throw new Error(`Error: HTTP response code ${response.getResponseCode()}`);
  }
}


function getCampaignDataByYear(accountID) {
  const versionAPI = 'v19.0';
  const fields = 'spend%2Cimpressions%2Cactions%2Caction_values%2Cclicks%2Ccampaign_name%2Cpurchase_roas%2Cobjective';
  const startDate = new Date('2024-01-01'); // YYYY-MM-DD
  const endDate = new Date('2024-02-13');
  const level = 'campaign';
  const filter = '%5B%7Bfield%3A%22action_type%22%2C%22operator%22%3A%22CONTAIN%22%2C%22value%22%3A%22omni_purchase%22%7D%5D';


  // Iterate over dates in the range
  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'

    // Construct API URL for the current date
    var url = `https://graph.facebook.com/${versionAPI}/act_${accountID}/insights?fields=${fields}&time_range=%7B'since'%3A'${formattedDate}'%2C'until'%3A'${formattedDate}'%7D&limit=100&level=${level}&filtering=${filter}&access_token=${TOKEN}`

    const options = {
      method: 'get',
      contentType: 'application/json',
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    Logger.log(url);

    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());

      if (data.data && data.data.length > 0) {
        setCampaignData(data.data);
        Logger.log(`Data saved successfully for ${formattedDate}`);
      } else {
        Logger.log(`No data found in the response for ${formattedDate}`);
      }
    } else {
      throw new Error(`Error: HTTP response code ${response.getResponseCode()}`);
    }
  }
}

function setCampaignData(jsonResponses) {
  const sheet = ss.getSheetByName('Campaigns');
  const rowValues = jsonResponses.map(item => [
    item?.date_start,
    item?.campaign_name,
    item?.objective,
    item?.impressions,
    item?.clicks,
    item?.spend,
    item?.purchase_roas?.[0]?.value || 0,
    item?.action_values?.[0]?.value || 0,
    item?.actions?.[0]?.value || 0,
  ]);

  sheet.getRange(sheet.getLastRow() + 1, 1, rowValues.length, rowValues[0].length).setValues(rowValues);
}