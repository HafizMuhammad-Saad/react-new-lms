import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { supabase } from '../services/supabase';

import React from 'react'

function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profile, setProfile] = useState({
      fullName: '',
      email: '',
      phone: '',
      address: '',
    });
  
    useEffect(() => {
      fetchProfile();
    }, []);
  
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch user profile from the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
  
        if (error) throw error;
  
        setProfile({
          fullName: data.full_name || '',
          email: user.email,
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (error) {
        setError('Failed to fetch profile information');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setSaving(true);
        setError('');
        setSuccess('');
  
        const { data: { user } } = await supabase.auth.getUser();
  
        // Update profile in the profiles table
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: profile.fullName,
            phone: profile.phone,
            address: profile.address,
            updated_at: new Date().toISOString(),
          });
  
        if (updateError) throw updateError;
  
        setSuccess('Profile updated successfully');
      } catch (error) {
        setError('Failed to update profile');
        console.error('Error updating profile:', error);
      } finally {
        setSaving(false);
      }
    };
  
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
  
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
  
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
  
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
  
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              disabled
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin="normal"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
}

export default Profile
