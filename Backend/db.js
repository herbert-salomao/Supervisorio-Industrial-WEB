const { createClient } = require('@supabase/supabase-js');
const moment = require('moment-timezone');

// Initialize Supabase client with your project URL and API key
const supabase = createClient(
    'https://cinuypsyghowlznspxyd.supabase.co',        
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbnV5cHN5Z2hvd2x6bnNweHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5ODQxOTcsImV4cCI6MjA0ODU2MDE5N30.zuDN3Mm3HcLzvCzSs7wA8KvFEv1-XAeLo-KOcFwAQcE'
  )
  

// Define the bucket name where the JSON files are stored
const bucketName = 'banco'; // Replace with your Supabase bucket name

// Paths for each JSON file in the Supabase storage bucket
const dbPaths = {
  'PV_FT-01': 'dbPV_FT01.json',
  'SP_CLP-02': 'dbSP_CLP02.json',
  'CLP-02': 'dbCLP02.json',
  'CLP-01': 'dbCLP01.json',
  'PID_CLP-01': 'dbPID_CLP01.json',
  'PID_CLP-02': 'dbPID_CLP02.json',
  'Alarme': 'dbAlarmes.json',
};

// Function to update the database based on the topic and value
async function updateDB(topic, value) {
    console.log('dsadsa')
  if (topic === 'PID_CLP-02') {
    value = value.split(";");

    const currentDate = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');

    let data = {};
    
    try {
      // Fetch the existing JSON data from Supabase Storage
      const { data: fileData, error } = await supabase.storage
        .from(bucketName)
        .download(dbPaths[topic]);

      if (error && error.message !== 'Object not found') {
        throw error; // Handle any other errors
      }

      if (fileData) {
        // If the file exists, read and parse the JSON
        let buffer = Buffer.isBuffer(fileData) ? fileData : Buffer.from(await fileData.arrayBuffer());

        // Decode the file data to a string
        const jsonText = buffer.toString('utf8'); // Convert buffer to string
        data = JSON.parse(jsonText);
      }

      // Ensure the current date exists in the data
      if (!data[currentDate]) {
        data[currentDate] = {};
      }

      // Set the values for the current time
      data[currentDate][currentTime] = { 
        'KP': value[0], 
        'TI': value[1],
        'TD': value[2]
      };

      // Convert the updated data object back to a JSON string
      const updatedJson = JSON.stringify(data, null, 2);

      // Upload the updated JSON back to Supabase, overwriting the file
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(dbPaths[topic], Buffer.from(updatedJson, 'utf-8'), {
          upsert: true,  // Ensures the file is overwritten
          contentType: 'application/json'
        });

      if (uploadError) {
        throw uploadError;
      }

      console.log('Successfully updated JSON file in Supabase Storage');

    } catch (error) {
      console.error('Error managing PID_CLP-02 data:', error.message);
    }
  }

  // Handle other topics (example shown for 'SP_CLP-02')
}

// Function to get the last values (example: last 30 entries)
async function getLastValuesFromDB(topic) {
  const { data: fileData, error } = await supabase.storage
    .from(bucketName)
    .download(dbPaths[topic]);

  if (error) {
    console.error(`Error fetching ${topic} data:`, error.message);
    return { times: [], values: [] };
  }

  // If the file exists, read and parse the JSON
  const jsonText = new TextDecoder().decode(fileData);
  const data = JSON.parse(jsonText);

  let entries = [];
  Object.keys(data).forEach(date => {
    Object.keys(data[date]).forEach(time => {
      entries.push({ datetime: `${date} ${time}`, value: data[date][time] });
    });
  });

  // Sort entries by datetime
  entries.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  // Get the last 30 entries
  const lastEntries = entries.slice(-30);

  const times = lastEntries.map(entry => entry.datetime);
  const values = lastEntries.map(entry => entry.value);

  return { times, values };
}





async function getDataFromDB(filePath) {
    
    let data = {};
    try {
        // Fetch the JSON file from Supabase Storage
        const { data: fileData, error } = await supabase.storage
            .from(bucketName)
            .download(filePath);

        // Handle errors (e.g., file not found)
        if (error) {
            console.error('Error downloading file from Supabase Storage:', error);
            return { times: [], spValues: [], pvValues: [], mvValues: [] };
        }

        // Decode the file data and parse as JSON
        let buffer = Buffer.isBuffer(fileData) ? fileData : Buffer.from(await fileData.arrayBuffer());

        // Decode the file data to a string
        const jsonText = buffer.toString('utf8'); // Convert buffer to string
        data = JSON.parse(jsonText);

    } catch (err) {
        console.error('Error reading or parsing the JSON file:', err);
        return { times: [], spValues: [], pvValues: [], mvValues: [] };
    }

    // Initialize arrays for time and values
    const times = [];
    const spValues = [];
    const pvValues = [];
    const mvValues = [];

    // Iterate over the date entries
    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            // Iterate over the time entries
            for (const time in data[date]) {
                if (data[date].hasOwnProperty(time)) {
                    times.push(time);
                    spValues.push(data[date][time]['SP']);
                    pvValues.push(data[date][time]['PV']);
                    mvValues.push(data[date][time]['MV']);
                }
            }
        }
    }

    // Limit the data to the last 30 entries
    const sliceSize = 30;
    const lastTimes = times.slice(-sliceSize);
    const lastSpValues = spValues.slice(-sliceSize);
    const lastPvValues = pvValues.slice(-sliceSize);
    const lastMvValues = mvValues.slice(-sliceSize);
    
    return { times: lastTimes, spValues: lastSpValues, pvValues: lastPvValues, mvValues: lastMvValues };
}


async function getLastDataFromDB(filePath) {
    
    // Only process the specific file paths for PID_CLP01 and PID_CLP02
    if (filePath === 'dbPID_CLP01.json' || filePath === 'dbPID_CLP02.json') {
     
        let data = {};

        try {
            // Fetch the JSON file from Supabase Storage
            const { data: fileData, error } = await supabase.storage
                .from(bucketName)
                .download(filePath);

            // Handle errors (e.g., file not found)
            if (error) {
                console.error('Error downloading file from Supabase Storage:', error);
                return { times: [], kpValues: [], tiValues: [], tdValues: [] };
            }

            // Decode the file data and parse as JSON
            let buffer = Buffer.isBuffer(fileData) ? fileData : Buffer.from(await fileData.arrayBuffer());
            const jsonText = buffer.toString('utf8');
            try {
                data = JSON.parse(jsonText);
            } catch (err) {
                console.error('Error parsing JSON data:', err.message);
                return { times: [], kpValues: [], tiValues: [], tdValues: [] };
            }

        } catch (err) {
            console.error('Error reading or parsing the JSON file:', err);
            return { times: [], kpValues: [], tiValues: [], tdValues: [] };
        }

        // Initialize arrays to hold time and values
        const times = [];
        const kpValues = [];
        const tiValues = [];
        const tdValues = [];

        // Iterate over the date entries
        for (const date in data) {
            if (data.hasOwnProperty(date)) {
                // Iterate over the time entries
                for (const time in data[date]) {
                    if (data[date].hasOwnProperty(time)) {
                        times.push(time);
                        kpValues.push(data[date][time]['KP']);
                        tiValues.push(data[date][time]['TI']);
                        tdValues.push(data[date][time]['TD']);
                    }
                }
            }
        }
        const sliceSize = 1;
        const lastTimes = times.slice(-sliceSize)
        const lastKPValues = kpValues.slice(-sliceSize)
        const lastTIValues = tiValues.slice(-sliceSize)
        const lastTDValues = tdValues.slice(-sliceSize)
      
        return { times: lastTimes, kpValues: lastKPValues, tiValues: lastTIValues, tdValues: lastTDValues };
    }

}

async function getLast30Rows(tableName, column1, column2, column3, column4) {
    const { data, error } = await supabase
      .from(tableName)  // Replace with your table name
      .select(`${column1}, ${column2}, ${column3}, ${column4}`)  // Specify columns you need
      .order('id', { ascending: false })  // Assuming `id` is the primary key
      .limit(30);
  
    if (error) {
      console.error('Error fetching data:', error);
    } else {
    // Arrays to hold values
    let spValues = [];
    let pvValues = [];
    let mvValues = [];
    let time = [];

    // Loop through the data and extract values
    data.forEach(entry => {
        spValues.push(entry.SP);
        pvValues.push(entry.PV);
        mvValues.push(entry.MV);
        
        // Format the time to HH:mm:ss
        let date = new Date(entry.created_at);

        //const formattedDate = moment(isoDate).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss');
        const formattedTime = moment(date).tz('America/Sao_Paulo').format('HH:mm:ss');



        time.push(formattedTime);
    });

      return { times: time, spValues: spValues, pvValues: pvValues, mvValues: mvValues };
      
    }
  }


// Export functions
module.exports = { updateDB, getLastValuesFromDB, getDataFromDB, getLastDataFromDB , getLast30Rows};
