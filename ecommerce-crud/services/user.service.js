const userRepository = require("../repositories/user.repository");
const UserDTO = require("../dto/user.dto");

class UserService {
  async register(userData) {
    const user = await userRepository.create(userData);
    return new UserDTO(user);
  }

  async getUserByEmail(email) {
    const user = await userRepository.getByEmail(email);
    return user ? new UserDTO(user) : null;
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);
    return user ? new UserDTO(user) : null;
  }

  async getAllUsers() {
    const users = await userRepository.getAll();
    return users.map(u => new UserDTO(u));
  }

  async updateUser(id, data) {
    const updated = await userRepository.update(id, data);
    return new UserDTO(updated);
  }

  async deleteUser(id) {
    return userRepository.delete(id);
  }
}

module.exports = new UserService();
