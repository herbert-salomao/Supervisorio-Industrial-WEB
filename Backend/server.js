const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { updateDB, readLastValues, getDataFromDB, getLastDataFromDB , getLast30Rows} = require('./db.js');
const bcrypt = require('bcryptjs');
const { users } = require('./users');
const jwt = require('jsonwebtoken');
const verifyTokenAndRole = require('./middleware/verifyTokenAndRole');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const moment = require('moment-timezone');

const app = express();
const port = 5000; 


const SECRET_KEY = 'senai-projeto-integrador';

class Planta{
  constructor(Estado) {
    this.Estado = Estado; 
    this.SP1 = 0;
    this.SP2 = 0;
    this.FV01 = 0;
    this.LT02 = 0;
    this.SIC02 = 0;
}

  getEstado() {
    return this.Estado;
  }
  setEstado(newEstado) {
    return this.Estado = newEstado;
  }
  getSP1() {
    return this.SP1;
  }
  setSP1(newSP1) {
    return this.SP1 = newSP1;
  }
  getSP2() {
    return this.SP2;
  }
  setSP2(newSP2) {
    return this.SP2 = newSP2;
  }
  getFV01() {
    return this.FV01;
  }
  setFV01(newFV01) {
    return this.FV01 = newFV01;
  }
  getLT02() {
    return this.LT02;
  }
  setLT02(newLT02) {
    return this.LT02 = newLT02;
  }
  getSIC02() {
    return this.LSIC02T02;
  }
  setSIC02(newSIC02) {
    return this.SIC02 = newSIC02;
  }
}


const planta = new Planta(false)


const supabase = createClient(
  'https://cinuypsyghowlznspxyd.supabase.co',        
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbnV5cHN5Z2hvd2x6bnNweHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5ODQxOTcsImV4cCI6MjA0ODU2MDE5N30.zuDN3Mm3HcLzvCzSs7wA8KvFEv1-XAeLo-KOcFwAQcE'
)

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(cors());

app.use(express.json());


app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});


app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users[username];
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err || !isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.get('/verify', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    res.json({ success: true, username: decoded.username });
  });
});


function getCurrentTime() {
  const now = new Date();

  // Extract hours, minutes, and seconds
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format time as HH:mm:ss
  return `${hours}:${minutes}:${seconds}`;
}


app.get('/api/messages', (req, res) => {
  res.json(receivedMessages);
});


app.get('/api/pv_lt01', (req, res) => {
  res.json(getDataFromDB('./Database/dbCLP01.json')['pvValues'][29]);

});


app.get('/api/pv_lt02', (req, res) => {
  res.json(planta.getLT02());

});

app.put('/api/mv_lt02', (req, res) => {
  const { message } = req.body;
  res.json(planta.setLT02(parseInt(message)));

});

app.get('/api/mv_fv01', (req, res) => {
  res.json(planta.getFV01());

});

app.put('/api/mv_fv01', (req, res) => {
  const { message } = req.body;
  res.json(planta.setFV01(parseInt(message)));

});


app.get('/api/mv_sic02', (req, res) => {
  res.json(planta.getSIC02());

});

app.put('/api/mv_sic02', (req, res) => {
  const { message } = req.body;
  res.json(planta.setSIC02(parseInt(message)));

});

app.get('/api/pv_ft01', (req, res) => {
  res.json(readLastValues('./Database/dbPV_FT01.json'));

});


app.get('/api/sp_clp01', (req, res) => {
  res.json(`${planta.getSP1()}`);

});
app.get('/api/sp_clp02', (req, res) => {
  res.json(`${planta.getSP2()}`);

});

app.put('/api/sp_clp01', verifyTokenAndRole(['admin']), (req, res) => {
  const { message } = req.body;

  
  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }
  let sp_clp01 = message;
  planta.setSP1(parseInt(sp_clp01))
  res.status(200).json({ success: true, sp_clp01});

});

app.put('/api/sp_clp02', verifyTokenAndRole(['admin']), (req, res) => {
  const { message } = req.body;


  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }
  let sp_clp02 = message;
  planta.setSP2(parseInt(sp_clp02))
  res.status(200).json({ success: true, sp_clp02});

});


app.put('/api/pid_clp02', verifyTokenAndRole(['admin']), async (req, res) => {
  const { message } = req.body;

  
  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required / Mensagem Obrigatória' });
}


  let pid_clp01 = message
  value = message.split(';')

  try {
    const { data, error } = await supabase
      .from('dbPID_CLP02')
      .insert([
        {
          KP: value[0],
          TI: value[1],
          TD: value[2],
        },
      ]);

    // Handle error
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ success: true, pid_clp01});
  } catch (err) {

    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'An error occurred while adding data' });
  }
})

app.put('/api/pid_clp01', verifyTokenAndRole('admin'),  async (req, res) => {
  const { message } = req.body;

  
  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required / Mensagem Obrigatória' });
}


  let pid_clp01 = message
  value = message.split(';')

  try {
    const { data, error } = await supabase
      .from('dbPID_CLP01')
      .insert([
        {
          KP: value[0],
          TI: value[1],
          TD: value[2],
        },
      ]);

    // Handle error
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ success: true, pid_clp01});
  } catch (err) {

    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'An error occurred while adding data' });
  }
})

app.post('/api/clp01', async (req, res) => {
  const { SP, PV, MV } = req.body;

  try {
    const { data, error } = await supabase
      .from('dbCLP01')
      .insert([
        {
          SP: SP,
          PV: PV,
          MV: MV,
        },
      ]);

    // Handle error
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Return the inserted data as a response
    res.status(201).json({ message: 'Data added successfully', data });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'An error occurred while adding data' });
  }
})



app.post('/api/clp02', async (req, res) => {
  const { SP, PV, MV } = req.body;

  try {
    const { data, error } = await supabase
      .from('dbCLP02')
      .insert([
        {
          SP: SP,
          PV: PV,
          MV: MV,
        },
      ]);

    // Handle error
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Return the inserted data as a response
    res.status(201).json({ message: 'Data added successfully', data });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'An error occurred while adding data' });
  }
})


app.put('/api/planta', verifyTokenAndRole(['admin']),  (req, res) => {
  const { estado } = req.body;



   res.status(200).json({ success: true});
  planta.setEstado(estado)
})

app.get('/api/planta',   (req, res) => {
   res.json(planta.getEstado());
})


app.get('/api/pid_clp02', async (req, res) => {
  const { data, error } = await supabase
  .from('dbPID_CLP02')  // Replace with your table name
  .select(`KP, TI, TD, created_at`)  // Specify columns you need
  .order('id', { ascending: false })  // Assuming `id` is the primary key
  .limit(1);

if (error) {
  console.error('Error fetching data:', error);
} else {
// Arrays to hold values
let kpValues = [];
let tiValues = [];
let tdValues = [];
let time = [];

// Loop through the data and extract values
data.forEach(entry => {
  kpValues.push(entry.KP);
  tiValues.push(entry.TI);
  tdValues.push(entry.TD);
    
    // Format the time to HH:mm:ss
    const date = new Date(entry.created_at);
    const formattedTime = date.toISOString().slice(11, 19); // Extract HH:mm:ss from the ISO string
    time.push(formattedTime);
});

  res.json({ times: time, kpValues: kpValues, tiValues: tiValues, tdValues: tdValues })
  
}
  
});

app.get('/api/pid_clp01', async (req, res) => {
  
    const { data, error } = await supabase
    .from('dbPID_CLP01')  // Replace with your table name
    .select(`KP, TI, TD, created_at`)  // Specify columns you need
    .order('id', { ascending: false })  // Assuming `id` is the primary key
    .limit(1);

  if (error) {
    console.error('Error fetching data:', error);
  } else {
  // Arrays to hold values
  let kpValues = [];
  let tiValues = [];
  let tdValues = [];
  let time = [];

  // Loop through the data and extract values
  data.forEach(entry => {
    kpValues.push(entry.KP);
    tiValues.push(entry.TI);
    tdValues.push(entry.TD);
      
      // Format the time to HH:mm:ss
      const date = new Date(entry.created_at);
      const formattedTime = date.toISOString().slice(11, 19); // Extract HH:mm:ss from the ISO string
      time.push(formattedTime);
  });

    res.json({ times: time, kpValues: kpValues, tiValues: tiValues, tdValues: tdValues })
    
  }
  
});

app.get('/api/dbPID_CLP01', async (req, res) => {
  const { data, error } = await supabase
  .from('dbPID_CLP01')  // Replace with your table name
  .select('KP, TI, TD, created_at')  // Specify columns you need
  .order('id', { ascending: false });  // Assuming `id` is the primary key

if (error) {
  console.error('Error fetching data:', error);
} else {
  // Object to hold the final structured data
  let groupedData = {};

  // Loop through the data and group by date and time
  data.forEach(entry => {
    const date = new Date(entry.created_at);
    
    
    const formattedDate = moment(date).format('DD/MM/YYYY');
    
    // Format the time to HH:mm:ss
    const formattedTime = moment(date).format('HH:mm:ss');
    
    // Create the nested structure for date -> time -> KP, TI, TD
    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {};
    }
    
    if (!groupedData[formattedDate][formattedTime]) {
      groupedData[formattedDate][formattedTime] = {
        KP: entry.KP,
        TI: entry.TI,
        TD: entry.TD
      };
    } else {
      // If the time already exists, you can modify or append the data (depending on your use case)
      // For now, I will assume overwriting is fine. If not, adjust accordingly.
      groupedData[formattedDate][formattedTime] = {
        KP: entry.KP,
        TI: entry.TI,
        TD: entry.TD
      };
    }
  });

  res.json(groupedData);
    
}

});


app.get('/api/dbPID_CLP02', async (req, res) => {
  const { data, error } = await supabase
  .from('dbPID_CLP02')  // Replace with your table name
  .select('KP, TI, TD, created_at')  // Specify columns you need
  .order('id', { ascending: false });  // Assuming `id` is the primary key

  if (error) {
  console.error('Error fetching data:', error);
  } else {
  // Object to hold the final structured data
  let groupedData = {};

  // Loop through the data and group by date and time
  data.forEach(entry => {
    const date = new Date(entry.created_at);
    
    
    const formattedDate = moment(date).format('DD/MM/YYYY');
    
    // Format the time to HH:mm:ss
    const formattedTime = moment(date).format('HH:mm:ss');
    
    // Create the nested structure for date -> time -> KP, TI, TD
    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {};
    }
    
    if (!groupedData[formattedDate][formattedTime]) {
      groupedData[formattedDate][formattedTime] = {
        KP: entry.KP,
        TI: entry.TI,
        TD: entry.TD
      };
    } else {
      // If the time already exists, you can modify or append the data (depending on your use case)
      // For now, I will assume overwriting is fine. If not, adjust accordingly.
      groupedData[formattedDate][formattedTime] = {
        KP: entry.KP,
        TI: entry.TI,
        TD: entry.TD
      };
    }
  });

  res.json(groupedData);
    
  }
});

app.get('/api/dbPID_CLP01', async (req, res) => {
  const { data, error } = await supabase
  .from('dbPID_CLP01')  // Replace with your table name
  .select('KP, TI, TD, created_at')  // Specify columns you need
  .order('id', { ascending: false });  // Assuming `id` is the primary key

  if (error) {
  console.error('Error fetching data:', error);
  } else {
  // Object to hold the final structured data
  let groupedData = {};

  // Loop through the data and group by date and time
  data.forEach(entry => {
    const date = new Date(entry.created_at);
    
    
    const formattedDate = moment(date).format('DD/MM/YYYY');
    
    // Format the time to HH:mm:ss
    const formattedTime = moment(date).format('HH:mm:ss');
    
    // Create the nested structure for date -> time -> KP, TI, TD
    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {};
    }
    
    if (!groupedData[formattedDate][formattedTime]) {
      groupedData[formattedDate][formattedTime] = {
        KP: entry.KP,
        TI: entry.TI,
        TD: entry.TD
      };
    } else {
      // If the time already exists, you can modify or append the data (depending on your use case)
      // For now, I will assume overwriting is fine. If not, adjust accordingly.
      groupedData[formattedDate][formattedTime] = {
        KP: entry.KP,
        TI: entry.TI,
        TD: entry.TD
      };
    }
  });

  res.json(groupedData);
    
  }
});

app.get('/api/dbCLP01', async (req, res) => {
  const { data, error } = await supabase
  .from('dbCLP01')  // Replace with your table name
  .select('SP, PV, MV, created_at')  // Specify columns you need
  .order('id', { ascending: false });  // Assuming `id` is the primary key

  if (error) {
  console.error('Error fetching data:', error);
  } else {
  // Object to hold the final structured data
  let groupedData = {};

  // Loop through the data and group by date and time
  data.forEach(entry => {
    const date = new Date(entry.created_at);
    
    
    const formattedDate = moment(date).format('DD/MM/YYYY');
    
    // Format the time to HH:mm:ss
    const formattedTime = moment(date).format('HH:mm:ss');
    
    // Create the nested structure for date -> time -> KP, TI, TD
    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {};
    }
    
    if (!groupedData[formattedDate][formattedTime]) {
      groupedData[formattedDate][formattedTime] = {
        SP: entry.SP,
        PV: entry.PV,
        MV: entry.MV
      };
    } else {
      // If the time already exists, you can modify or append the data (depending on your use case)
      // For now, I will assume overwriting is fine. If not, adjust accordingly.
      groupedData[formattedDate][formattedTime] = {
        SP: entry.SP,
        PV: entry.PV,
        MV: entry.MV
      };
    }
  });

  res.json(groupedData);
    
  }

});
app.get('/api/dbCLP02', async (req, res) => {
  const { data, error } = await supabase
  .from('dbCLP02')  // Replace with your table name
  .select('SP, PV, MV, created_at')  // Specify columns you need
  .order('id', { ascending: false });  // Assuming `id` is the primary key

  if (error) {
  console.error('Error fetching data:', error);
  } else {
  // Object to hold the final structured data
  let groupedData = {};

  // Loop through the data and group by date and time
  data.forEach(entry => {
    const date = new Date(entry.created_at);
    
    
    const formattedDate = moment(date).format('DD/MM/YYYY');
    
    // Format the time to HH:mm:ss
    const formattedTime = moment(date).format('HH:mm:ss');
    
    // Create the nested structure for date -> time -> KP, TI, TD
    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {};
    }
    
    if (!groupedData[formattedDate][formattedTime]) {
      groupedData[formattedDate][formattedTime] = {
        SP: entry.SP,
        PV: entry.PV,
        MV: entry.MV
      };
    } else {
      // If the time already exists, you can modify or append the data (depending on your use case)
      // For now, I will assume overwriting is fine. If not, adjust accordingly.
      groupedData[formattedDate][formattedTime] = {
        SP: entry.SP,
        PV: entry.PV,
        MV: entry.MV
      };
    }
  });

  res.json(groupedData);
    
  }
});

app.get('/api/clp02', async (req, res) => {
  
  res.json(await getLast30Rows('dbCLP02', 'SP', 'PV', 'MV', 'created_at'));

});

app.get('/api/clp01', async (req, res) => {

  res.json(await getLast30Rows('dbCLP01', 'SP', 'PV', 'MV', 'created_at'));

});


app.post('/api/alarme', verifyTokenAndRole(['admin']), async (req, res) => {
  const { Nome, Descricao, Severidade } = req.body;

  try {
    const { data, error } = await supabase
      .from('dbCLP01')
      .insert([
        {
          Nome: Nome,
          Descricao: Descricao,
          Severidade: Severidade,
        },
      ]);

    // Handle error
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Return the inserted data as a response
    res.status(201).json({ message: 'Data added successfully', data });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'An error occurred while adding data' });
  }

})

app.get('/api/alarme', async (req, res) => {
  const { data, error } = await supabase
  .from('dbAlarme')  // Replace with your table name
  .select('id, Nome, Descricao, Severidade, created_at')  // Specify columns you need
  .order('id', { ascending: false });  // Assuming `id` is the primary key

if (error) {
  console.error('Error fetching data:', error);
} else {
  // Object to hold the final structured data
  let groupedData = {};

  // Loop through the data and group by date and time
  data.forEach(entry => {
    const date = new Date(entry.created_at);
    
    
    const formattedDate = moment(date).format('DD/MM/YYYY');
    
    // Format the time to HH:mm:ss
    const formattedTime = moment(date).format('HH:mm:ss');
    
    // Create the nested structure for date -> time -> KP, TI, TD
    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {};
    }
    
    if (!groupedData[formattedDate][formattedTime]) {
      groupedData[formattedDate][formattedTime] = {
        id: entry.id,
        Nome: entry.Nome,
        Descricao: entry.Descricao,
        Severidade: entry.Severidade
      };
    } else {
      // If the time already exists, you can modify or append the data (depending on your use case)
      // For now, I will assume overwriting is fine. If not, adjust accordingly.
      groupedData[formattedDate][formattedTime] = {
        id: entry.id,
        Nome: entry.Nome,
        Descricao: entry.Descricao,
        Severidade: entry.Severidade
      };
    }
  });

  res.json(groupedData);
    
}
});


app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
  console.log(`http server running at  http://localhost:5000/`)
})