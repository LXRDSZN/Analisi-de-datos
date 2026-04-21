import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@bluemart.com',
    password: '$2b$10$7nninDL1ZVKblB3kDtCmrepxMobsgOsAu7qHMyZ.GFKBDCPun.nxa' // password: admin123
  }
];

const SECRET_KEY = 'bluemart_analytics_secret_2026';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('📝 Intento de login:', { username });

    const user = users.find(u => u.username === username);

    if (!user) {
      console.log('❌ Usuario no encontrado:', username);
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    console.log('✅ Usuario encontrado:', user.username);
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    console.log('🔐 Validación de contraseña:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      SECRET_KEY, 
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 28800000, // 8 hours
    });

    console.log('✅ Login exitoso para:', user.username);

    res.json({ 
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: 'Error en login', error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = users.find(u => u.username === username || u.email === email);

    if (existingUser) {
      return res.status(400).json({ message: 'Usuario o email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en registro', error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  });
  res.json({ message: 'Sesión cerrada exitosamente' });
};

export const getProfile = (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email
  });
};
