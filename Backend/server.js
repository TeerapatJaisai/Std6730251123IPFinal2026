const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3084;

app.use(cors());
app.use(express.json());

// ==========================================
// MySQL Database
// ==========================================
const db = mysql.createPool({
  host: 'localhost',
  user: 'std6730251123',
  password: process.env.DB_PASSWORD,
  database: 'ip_std6730251123',
  waitForConnections: true,
  connectionLimit: 10
});

// ==========================================
// Test Database Connection
// ==========================================
async function testDatabase() {
  try {
    const connection = await db.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}

testDatabase();

// ==========================================
// LOGIN
// ==========================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password123') {
    return res.status(200).json({
      success: true,
      token: 'mock-jwt-token'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password'
  });
});

// ==========================================
// GET Employees
// ==========================================
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        Teerapat_ID_Employee AS id,
        Teerapat_Name AS name,
        Teerapat_Position AS position,
        Teerapat_Status AS status,
        Teerapat_Salary AS salary
      FROM Teerapat_Employee
      ORDER BY Teerapat_ID_Employee ASC
    `);

    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// POST Add Employee
// ==========================================
app.post('/api/employees', async (req, res) => {
  try {
    const { name, position, salary } = req.body;

    if (
      !name ||
      !position ||
      salary === undefined ||
      salary === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const salaryNumber = Number(salary);

    if (isNaN(salaryNumber) || salaryNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Salary must be a valid number'
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO Teerapat_Employee
      (
        Teerapat_Name,
        Teerapat_Position,
        Teerapat_Status,
        Teerapat_Salary
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        name.trim(),
        position.trim(),
        'Active',
        salaryNumber
      ]
    );

    const newEmployee = {
      id: result.insertId,
      name: name.trim(),
      position: position.trim(),
      status: 'Active',
      salary: salaryNumber
    };

    res.status(201).json({
      success: true,
      data: newEmployee
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// PUT Edit Employee
// ==========================================
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, salary } = req.body;

    if (
      !name ||
      !position ||
      salary === undefined ||
      salary === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const salaryNumber = Number(salary);

    if (isNaN(salaryNumber) || salaryNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Salary must be a valid number'
      });
    }

    const [result] = await db.query(
      `
      UPDATE Teerapat_Employee
      SET
        Teerapat_Name = ?,
        Teerapat_Position = ?,
        Teerapat_Salary = ?
      WHERE Teerapat_ID_Employee = ?
      `,
      [
        name.trim(),
        position.trim(),
        salaryNumber,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        Teerapat_ID_Employee AS id,
        Teerapat_Name AS name,
        Teerapat_Position AS position,
        Teerapat_Status AS status,
        Teerapat_Salary AS salary
      FROM Teerapat_Employee
      WHERE Teerapat_ID_Employee = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// PUT Toggle Status
// ==========================================
app.put('/api/employees/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        Teerapat_ID_Employee AS id,
        Teerapat_Name AS name,
        Teerapat_Position AS position,
        Teerapat_Status AS status,
        Teerapat_Salary AS salary
      FROM Teerapat_Employee
      WHERE Teerapat_ID_Employee = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const employee = rows[0];

    const newStatus =
      employee.status === 'Active'
        ? 'On Leave'
        : 'Active';

    await db.query(
      `
      UPDATE Teerapat_Employee
      SET Teerapat_Status = ?
      WHERE Teerapat_ID_Employee = ?
      `,
      [newStatus, id]
    );

    employee.status = newStatus;

    res.status(200).json({
      success: true,
      data: employee
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// DELETE Employee
// ==========================================
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        Teerapat_ID_Employee AS id,
        Teerapat_Name AS name,
        Teerapat_Position AS position,
        Teerapat_Status AS status,
        Teerapat_Salary AS salary
      FROM Teerapat_Employee
      WHERE Teerapat_ID_Employee = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await db.query(
      `
      DELETE FROM Teerapat_Employee
      WHERE Teerapat_ID_Employee = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// K-Means Salary Clustering
// ==========================================
app.get('/api/employees/salary-clusters', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT Teerapat_Salary AS salary
      FROM Teerapat_Employee
    `);

    const salaries = rows
      .map(row => Number(row.salary))
      .filter(salary => !isNaN(salary));

    if (salaries.length === 0) {
      return res.status(200).json({
        success: true,
        clusters: [
          { group: 'Tier 1', centroid: 0, count: 0 },
          { group: 'Tier 2', centroid: 0, count: 0 },
          { group: 'Tier 3', centroid: 0, count: 0 }
        ]
      });
    }

    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);

    let centroids = [
      minSalary + (maxSalary - minSalary) * 0.2,
      minSalary + (maxSalary - minSalary) * 0.5,
      minSalary + (maxSalary - minSalary) * 0.8
    ];

    let clusters = [[], [], []];

    const maxIterations = 20;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      clusters = [[], [], []];

      salaries.forEach(salary => {
        const distances = centroids.map(
          centroid => Math.abs(salary - centroid)
        );

        const minDistance = Math.min(...distances);
        const clusterIndex = distances.indexOf(minDistance);

        clusters[clusterIndex].push(salary);
      });

      centroids = centroids.map((centroid, index) => {
        if (clusters[index].length === 0) {
          return centroid;
        }

        const sum = clusters[index].reduce(
          (a, b) => a + b,
          0
        );

        return sum / clusters[index].length;
      });
    }

    let clusterData = centroids.map(
      (centroid, index) => ({
        centroid: isNaN(centroid)
          ? 0
          : Math.round(centroid),

        salaries: clusters[index]
      })
    );

    clusterData.sort(
      (a, b) => a.centroid - b.centroid
    );

    const formattedClusters = clusterData.map(
      (item, index) => ({
        group: `Tier ${index + 1}`,
        centroid: item.centroid,
        count: item.salaries.length
      })
    );

    res.status(200).json({
      success: true,
      clusters: formattedClusters
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});