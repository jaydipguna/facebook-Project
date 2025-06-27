import bcrypt from 'bcrypt';

const hashPassword = async (password:any) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password:any, hashedPassword:any) => {
  console.log('password', password);
  return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
 