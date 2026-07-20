// controllers/authController.js
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { sendPasswordResetEmail } from '../utils/email.js';

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      full_name,
      nip,
      phone,
      unit_kerja,
      jabatan,
      ppk_name,
    } = req.body;

    // 1. Validasi input
    if (!username || !email || !password || !full_name || !nip) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi',
      });
    }

    // 2. Validasi email BMKG
    if (!email.endsWith('@bmkg.go.id')) {
      return res.status(400).json({
        success: false,
        message: 'Email harus menggunakan domain @bmkg.go.id',
      });
    }

    // 3. Validasi password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter',
      });
    }

    // 4. Cek apakah email/username sudah terdaftar
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email atau username sudah terdaftar',
      });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Insert ke database
    const result = await pool.query(
      `INSERT INTO users 
      (username, email, password, full_name, nip, phone, unit_kerja, jabatan, ppk_name) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, username, email, full_name, role`,
      [
        username,
        email,
        hashedPassword,
        full_name,
        nip,
        phone,
        unit_kerja,
        jabatan,
        ppk_name,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') {
      // Unique constraint violation
      if (error.constraint === 'users_email_key') {
        return res.status(400).json({
          success: false,
          message: 'Email sudah terdaftar',
        });
      } else if (error.constraint === 'users_username_key') {
        return res.status(400).json({
          success: false,
          message: 'Username sudah terdaftar',
        });
      } else if (error.constraint === 'users_nip_key') {
        return res.status(400).json({
          success: false,
          message: 'NIP sudah terdaftar',
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
      });
    }

    // 2. Cari user berdasarkan email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    const user = result.rows[0];

    // 3. Cek apakah akun aktif
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda tidak aktif. Hubungi admin.',
      });
    }

    // 4. Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '24h' }
    );

    // 6. Hapus password dari response
    delete user.password;

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message,
    });
  }
};

// GET USER PROFILE (bonus untuk protected route)
export const getProfile = async (req, res) => {
  try {
    // req.user sudah di-set oleh middleware
    const result = await pool.query(
      'SELECT id, username, email, full_name, nip, phone, unit_kerja, jabatan, role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

// FORGOT PASSWORD — kirim tautan reset ke email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email wajib diisi',
      });
    }

    // Selalu balas pesan generik agar email yang tidak terdaftar tidak terbocor.
    const genericMessage =
      'Jika email terdaftar, tautan reset password telah dikirim. Periksa kotak masuk / spam.';

    const result = await pool.query(
      'SELECT id, email, full_name, is_active FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.json({ success: true, message: genericMessage });
    }

    const user = result.rows[0];

    // Invalidasi token lama yang belum dipakai
    await pool.query(
      'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND used_at IS NULL',
      [user.id]
    );

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    const frontendBase = (
      process.env.FRONTEND_URL ||
      process.env.CORS_ORIGIN ||
      'http://localhost:3000'
    ).replace(/\/$/, '');
    const resetUrl = `${frontendBase}/reset-password?token=${rawToken}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl,
        fullName: user.full_name,
      });
    } catch (mailErr) {
      console.error('Gagal kirim email reset:', mailErr.message);
      return res.status(500).json({
        success: false,
        message:
          'Gagal mengirim email. Pastikan SMTP (Gmail App Password) sudah dikonfigurasi.',
      });
    }

    return res.json({ success: true, message: genericMessage });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message,
    });
  }
};

// RESET PASSWORD — set password baru memakai token dari email
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token dan password baru wajib diisi',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter',
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokenResult = await pool.query(
      `SELECT id, user_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token_hash = $1
       LIMIT 1`,
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tautan reset tidak valid atau sudah kadaluarsa',
      });
    }

    const row = tokenResult.rows[0];

    if (row.used_at) {
      return res.status(400).json({
        success: false,
        message: 'Tautan reset sudah digunakan',
      });
    }

    if (new Date(row.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Tautan reset sudah kadaluarsa. Silakan minta ulang.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
      hashedPassword,
      row.user_id,
    ]);

    await pool.query(
      'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1',
      [row.id]
    );

    // Invalidate remaining unused tokens for this user
    await pool.query(
      'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND used_at IS NULL',
      [row.user_id]
    );

    res.json({
      success: true,
      message: 'Password berhasil diubah. Silakan login dengan password baru.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message,
    });
  }
};
