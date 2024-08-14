const bcrypt = require('bcrypt');

async function generatePasswords() {
  const passwords = ['Admin,14!', 'l3m4m0b1l1'];
  for (let password of passwords) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Password: ${password}, Hashed: ${hashedPassword}`);
  }
}

generatePasswords();