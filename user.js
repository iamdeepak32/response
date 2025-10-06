let users = [];

function addUser(userData = {}) {
  const { name, email, password, firstName, lastName, phoneNumber, companyName } = userData;

  if (!name || !email || !password || !firstName || !phoneNumber || !companyName) {
    return { success: false, message: "Missing fields" };
  }
  const bothExist = users.find((u) => u.name === name && u.email === email);
  if (bothExist) return { success: false, message: "Name and Email already exist" };
  
  const emailExist = users.find((u) => u.email === email);
  if (emailExist) return { success: false, message: "Email already exists" };

  const nameExist = users.find((u) => u.name === name);
  if (nameExist) return { success: false, message: "Name already exists" };

  const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = { 
    id: nextId, 
    name, 
    email, 
    password, 
    firstName, 
    lastName: lastName || null, 
    phoneNumber, 
    companyName 
  };
  users.push(newUser);
  
  return { success: true, message: "User added successfully", data: newUser };
}

function updateUser(id, newData = {}) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return { success: false, message: "User not found" };

  if (typeof newData !== "object" || newData === null) {
    return { success: false, message: "Invalid data" };
  }

  const hasValidField = Object.keys(newData).some(key => 
    ['name', 'email', 'password', 'firstName', 'lastName', 'phoneNumber', 'companyName'].includes(key)
  );

  if (!hasValidField) {
    return { success: false, message: "No valid fields to update" };
  }

  users[index] = {
    ...users[index],
    ...newData
  };

  return { success: true, message: "User updated successfully", data: users[index] };
}

function getUserById(id) {
  return users.find((u) => u.id === id);
}

function getAllUsers() {
  return users;
}
module.exports = { 
  users, 
  addUser, 
  updateUser, 
  getUserById, 
  getAllUsers 
};








