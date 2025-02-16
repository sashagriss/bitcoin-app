import bcrypt from 'bcrypt'

export async function hashPassword(userPassword) {
    const combinedPassword = userPassword + process.env.BCRYPT_KEY
    const saltRounds = 10;
    
    return await bcrypt.hash(combinedPassword, saltRounds);
}

export async function comparePassword(userPassword, hashedDbPassword) {
    const combinedPassword = userPassword + process.env.BCRYPT_KEY;
    
    return await bcrypt.compare(combinedPassword, hashedDbPassword);
}