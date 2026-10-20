import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  Modal
} from 'react-native';

// ==========================================
// Backend Server
// ==========================================
const BASE_URL = 'http://119.59.102.161:3084';
const API_URL = `${BASE_URL}/api/employees`;

type Employee = {
  id: number | string;
  name: string;
  position: string;
  status: string;
  salary: number | string;
};

export default function DashboardScreen() {

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');

  const [clusters, setClusters] = useState<any[]>([]);

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingCluster, setLoadingCluster] = useState(false);

  // ==========================================
  // Edit States
  // ==========================================
  const [editVisible, setEditVisible] = useState(false);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editSalary, setEditSalary] = useState('');

  // ==========================================
  // Alert
  // ==========================================
  const showAlert = (title: string, message: string) => {

    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // ==========================================
  // GET Employees
  // ==========================================
  const fetchEmployees = async () => {

    try {

      setLoadingEmployees(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok && data.success) {
        setEmployees(data.data || []);
      } else {
        showAlert(
          'Error',
          data.message || 'Unable to load employees'
        );
      }

    } catch (error) {

      console.error(error);

      showAlert(
        'Connection Error',
        'Unable to connect to backend server'
      );

    } finally {

      setLoadingEmployees(false);

    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ==========================================
  // ADD Employee
  // ==========================================
  const handleAddEmployee = async () => {

    if (
      !name.trim() ||
      !position.trim() ||
      !salary.trim()
    ) {
      showAlert(
        'Validation Error',
        'All fields are required.'
      );

      return;
    }

    const salaryNumber = Number(salary);

    if (
      isNaN(salaryNumber) ||
      salaryNumber <= 0
    ) {
      showAlert(
        'Validation Error',
        'Salary must be a valid number.'
      );

      return;
    }

    try {

      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          name: name.trim(),
          position: position.trim(),
          salary: salaryNumber
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {

        setName('');
        setPosition('');
        setSalary('');

        await fetchEmployees();

      } else {

        showAlert(
          'Error',
          data.message || 'Failed to add employee'
        );
      }

    } catch (error) {

      console.error(error);

      showAlert(
        'Error',
        'Failed to add employee'
      );
    }
  };

  // ==========================================
  // Open Edit
  // ==========================================
  const handleOpenEdit = (employee: Employee) => {

    setEditId(employee.id);
    setEditName(employee.name);
    setEditPosition(employee.position);
    setEditSalary(String(employee.salary));

    setEditVisible(true);
  };

  // ==========================================
  // Close Edit
  // ==========================================
  const handleCloseEdit = () => {

    setEditVisible(false);

    setEditId(null);
    setEditName('');
    setEditPosition('');
    setEditSalary('');
  };

  // ==========================================
  // SAVE Edit
  // ==========================================
  const handleSaveEdit = async () => {

    if (
      !editName.trim() ||
      !editPosition.trim() ||
      !editSalary.trim()
    ) {

      showAlert(
        'Validation Error',
        'All fields are required.'
      );

      return;
    }

    const salaryNumber = Number(editSalary);

    if (
      isNaN(salaryNumber) ||
      salaryNumber <= 0
    ) {

      showAlert(
        'Validation Error',
        'Salary must be a valid number.'
      );

      return;
    }

    if (editId === null) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/${editId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name: editName.trim(),
            position: editPosition.trim(),
            salary: salaryNumber
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {

        handleCloseEdit();

        await fetchEmployees();

      } else {

        showAlert(
          'Error',
          data.message || 'Failed to edit employee'
        );
      }

    } catch (error) {

      console.error(error);

      showAlert(
        'Error',
        'Failed to edit employee'
      );
    }
  };

  // ==========================================
  // TOGGLE Status
  // ==========================================
  const handleToggleStatus = async (
    id: number | string
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/${id}/status`,
        {
          method: 'PUT'
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {

        await fetchEmployees();

      } else {

        showAlert(
          'Error',
          data.message || 'Failed to toggle status'
        );
      }

    } catch (error) {

      console.error(error);

      showAlert(
        'Error',
        'Failed to toggle status'
      );
    }
  };

  // ==========================================
  // DELETE Employee
  // ==========================================
  const deleteEmployee = async (
    id: number | string
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE'
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {

        await fetchEmployees();

      } else {

        showAlert(
          'Error',
          data.message || 'Failed to delete employee'
        );
      }

    } catch (error) {

      console.error(error);

      showAlert(
        'Error',
        'Failed to delete employee'
      );
    }
  };

  // ==========================================
  // DELETE Confirmation
  // ==========================================
  const handleDelete = (
    id: number | string
  ) => {

    if (Platform.OS === 'web') {

      const confirmed = window.confirm(
        'Are you sure you want to delete this employee?'
      );

      if (confirmed) {
        deleteEmployee(id);
      }

      return;
    }

    Alert.alert(
      'Are you sure?',
      'Do you want to delete this employee?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEmployee(id)
        }
      ]
    );
  };

  // ==========================================
  // K-MEANS
  // ==========================================
  const handleAnalyzeSalary = async () => {

    try {

      setLoadingCluster(true);

      const response = await fetch(
        `${API_URL}/salary-clusters`
      );

      const data = await response.json();

      if (response.ok && data.success) {

        setClusters(data.clusters);

      } else {

        showAlert(
          'Error',
          data.message || 'Failed to analyze salary'
        );
      }

    } catch (error) {

      console.error(error);

      showAlert(
        'Error',
        'Failed to fetch cluster analysis'
      );

    } finally {

      setLoadingCluster(false);
    }
  };

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >

      <Text style={styles.header}>
        HR Manager Dashboard
      </Text>

      {/* ================================
          ADD EMPLOYEE
      ================================= */}

      <View style={styles.formCard}>

        <Text style={styles.subHeader}>
          Add New Employee
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Position"
          placeholderTextColor="#888"
          value={position}
          onChangeText={setPosition}
        />

        <TextInput
          style={styles.input}
          placeholder="Salary"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
        />

        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddEmployee}
        >

          <Text style={styles.btnText}>
            Add Employee
          </Text>

        </TouchableOpacity>

      </View>

      {/* ================================
          K-MEANS BUTTON
      ================================= */}

      <TouchableOpacity
        style={styles.clusterBtn}
        onPress={handleAnalyzeSalary}
        disabled={loadingCluster}
      >

        <Text style={styles.clusterBtnText}>
          {loadingCluster
            ? 'Analyzing...'
            : 'Analyze Salary Structure'}
        </Text>

      </TouchableOpacity>

      {loadingCluster && (

        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loading}
        />

      )}

      {/* ================================
          K-MEANS RESULT
      ================================= */}

      {clusters.length > 0 && !loadingCluster && (

        <View style={styles.clusterContainer}>

          <Text style={styles.subHeader}>
            Salary Tiers (K-Means Clustering)
          </Text>

          <View style={styles.cardRow}>

            {clusters.map(
              (cluster: any, index: number) => (

                <View
                  key={index}
                  style={styles.clusterCard}
                >

                  <Text style={styles.tierTitle}>
                    {cluster.group}
                  </Text>

                  <Text style={styles.tierText}>
                    Average Salary: ฿
                    {Number(
                      cluster.centroid
                    ).toLocaleString()}
                  </Text>

                  <Text style={styles.tierText}>
                    Employees: {cluster.count}
                  </Text>

                </View>
              )
            )}

          </View>

        </View>
      )}

      {/* ================================
          EMPLOYEE LIST
      ================================= */}

      <Text style={styles.subHeader}>
        Employee List ({employees.length})
      </Text>

      {loadingEmployees ? (

        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loading}
        />

      ) : (

        employees.map((item) => (

          <View
            key={item.id}
            style={styles.empCard}
          >

            <View style={styles.employeeInfo}>

              <Text style={styles.empName}>
                {item.name}
              </Text>

              <Text style={styles.empDetail}>
                {item.position}
              </Text>

              <Text style={styles.salary}>
                Salary: ฿
                {Number(
                  item.salary
                ).toLocaleString()}
              </Text>

              <Text
                style={[
                  styles.empStatus,
                  {
                    color:
                      item.status === 'Active'
                        ? 'green'
                        : 'orange'
                  }
                ]}
              >
                Status: {item.status}
              </Text>

            </View>

            <View style={styles.actionRow}>

              {/* TOGGLE */}
              <TouchableOpacity
                style={styles.statusBtn}
                onPress={() =>
                  handleToggleStatus(item.id)
                }
              >
                <Text style={styles.actionText}>
                  Toggle Status
                </Text>
              </TouchableOpacity>

              {/* EDIT */}
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  handleOpenEdit(item)
                }
              >
                <Text style={styles.actionText}>
                  Edit
                </Text>
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  handleDelete(item.id)
                }
              >
                <Text style={styles.actionText}>
                  Delete
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        ))

      )}

      <View style={{ height: 50 }} />

      {/* ================================
          EDIT MODAL
      ================================= */}

      <Modal
        visible={editVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseEdit}
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Edit Employee
            </Text>

            <Text style={styles.label}>
              Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={styles.label}>
              Position
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Position"
              value={editPosition}
              onChangeText={setEditPosition}
            />

            <Text style={styles.label}>
              Salary
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Salary"
              keyboardType="numeric"
              value={editSalary}
              onChangeText={setEditSalary}
            />

            <View style={styles.modalButtonRow}>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCloseEdit}
              >
                <Text style={styles.actionText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveEdit}
              >
                <Text style={styles.actionText}>
                  Save
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },

  contentContainer: {
    padding: 16
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20
  },

  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },

  formCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee'
  },

  input: {
    backgroundColor: '#f1f3f5',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },

  addBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  clusterBtn: {
    backgroundColor: '#6f42c1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },

  clusterBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  loading: {
    marginVertical: 15
  },

  clusterContainer: {
    marginBottom: 20
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },

  clusterCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6d8db',
    alignItems: 'center'
  },

  tierTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#495057',
    marginBottom: 6
  },

  tierText: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 3
  },

  empCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee'
  },

  employeeInfo: {
    flex: 1
  },

  empName: {
    fontSize: 16,
    fontWeight: 'bold'
  },

  empDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 3
  },

  salary: {
    fontSize: 13,
    color: '#333',
    marginTop: 3
  },

  empStatus: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3
  },

  actionRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center'
  },

  statusBtn: {
    backgroundColor: '#ffc107',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6
  },

  // ปุ่ม Edit
  editBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6
  },

  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6
  },

  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },

  // ==========================================
  // Edit Modal
  // ==========================================

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  modalCard: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 500,
    padding: 20,
    borderRadius: 10
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },

  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8
  },

  cancelBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6
  },

  saveBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6
  }
});