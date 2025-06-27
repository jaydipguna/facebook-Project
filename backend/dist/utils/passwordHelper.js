import bcrypt from 'bcrypt';
// Function to hash a password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
const comparePassword = async (password, hashedPassword) => {
    console.log('password', password);
    return await bcrypt.compare(password, hashedPassword);
};
export { hashPassword, comparePassword };
